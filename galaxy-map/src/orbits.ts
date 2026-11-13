import type { GalaxyLocation, GalaxyOrbit, GalaxyOrbitAttachment } from "./galaxy-types";

export const DEFAULT_ORBIT_ASPECT = 16 / 9;
type Point = { x: number; y: number };
export type OrbitDrag = { id: string; point: Point; angle?: number };

declare const game: any;

export function orbitTime() {
  const serverTime = typeof game === "undefined" ? undefined : game.time?.serverTime;
  return Number.isFinite(serverTime) ? serverTime as number : Date.now();
}

function bounded(value: unknown, fallback: number, min: number, max: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function wrapAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function normalizeOrbits(value: unknown): GalaxyOrbit[] {
  const orbits = new Map<string, GalaxyOrbit>();
  for (const entry of Array.isArray(value) ? value : []) {
    if (typeof entry?.id !== "string" || !entry.id || orbits.has(entry.id)) continue;
    orbits.set(entry.id, { id: entry.id, radius: bounded(entry.radius ?? 15, 15, 1, 100) });
  }
  return [...orbits.values()];
}

export function normalizeOrbit(value: any): GalaxyOrbitAttachment | undefined {
  if (typeof value?.centerId !== "string" || !value.centerId || typeof value.orbitId !== "string" || !value.orbitId) return;
  return {
    centerId: value.centerId,
    orbitId: value.orbitId,
    angle: wrapAngle(bounded(value.angle, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
    period: Number(value.period) > 0 ? bounded(value.period, 60, 5, 3600) : 0,
    clockwise: value.clockwise !== false,
    epoch: bounded(value.epoch, 0, 0, Number.MAX_SAFE_INTEGER)
  };
}

export function canAttachToOrbit(objects: GalaxyLocation[], objectId: string, attachment: Pick<GalaxyOrbitAttachment, "centerId" | "orbitId">) {
  const byId = new Map(objects.map(object => [object.id, object]));
  return canAttach(byId, objectId, attachment);
}

function canAttach(byId: Map<string, GalaxyLocation>, objectId: string, attachment: Pick<GalaxyOrbitAttachment, "centerId" | "orbitId">) {
  const center = byId.get(attachment.centerId);
  if (!center?.orbits?.some(orbit => orbit.id === attachment.orbitId)) return false;
  const visited = new Set([objectId]);
  let ancestor: GalaxyLocation | undefined = center;
  while (ancestor) {
    if (visited.has(ancestor.id)) return false;
    visited.add(ancestor.id);
    ancestor = ancestor.orbit ? byId.get(ancestor.orbit.centerId) : undefined;
  }
  return true;
}

export function orbitAngle(orbit: GalaxyOrbitAttachment, time: number, motion = true) {
  if (!motion || !orbit.period) return orbit.angle;
  const elapsed = (time - orbit.epoch) % (orbit.period * 1000);
  return wrapAngle(orbit.angle + elapsed / (orbit.period * 1000) * 360 * (orbit.clockwise ? 1 : -1));
}

export function orbitRadii(radius: number, aspect: number) {
  return { x: radius / Math.max(1, aspect), y: radius * Math.min(1, aspect) };
}

export function orbitAngleAt(point: Point, center: Point, aspect: number) {
  return wrapAngle(Math.atan2(point.y - center.y, (point.x - center.x) * aspect) * 180 / Math.PI);
}

export function createOrbitLayout(objects: GalaxyLocation[], obscuredIds = new Set<string>()) {
  const byId = new Map(objects.map(object => [object.id, object]));
  const attachments = new Map<string, { orbit: GalaxyOrbit; attachment: GalaxyOrbitAttachment }>();
  const concealed = new Set<string>();
  const checked = new Set<string>();

  function collect(object: GalaxyLocation) {
    if (checked.has(object.id)) return;
    checked.add(object.id);
    if (!object.orbit) return;
    const center = byId.get(object.orbit.centerId);
    const ring = center?.orbits?.find(orbit => orbit.id === object.orbit?.orbitId);
    if (center && ring && canAttach(byId, object.id, object.orbit)) {
      collect(center);
      if (!concealed.has(center.id) && !obscuredIds.has(center.id)) {
        if (!obscuredIds.has(object.id)) attachments.set(object.id, { orbit: ring, attachment: object.orbit });
        return;
      }
    }
    concealed.add(object.id);
  }
  objects.forEach(collect);

  return {
    attachments,
    rings: objects.flatMap(object => concealed.has(object.id) || obscuredIds.has(object.id) ? []
      : (object.orbits ?? []).map(orbit => ({ centerId: object.id, ...orbit }))),
    animated: [...attachments.values()].some(({ attachment }) => attachment.period > 0),
    positions(aspect: number, time: number, motion = true, drag?: OrbitDrag) {
      const positions = new Map<string, Point>();
      function position(object: GalaxyLocation): Point {
        const cached = positions.get(object.id);
        if (cached) return cached;
        const link = attachments.get(object.id);
        const point = drag?.id === object.id ? drag.point : object;
        let result: Point = { x: point.x, y: point.y };
        if (link) {
          const center = position(byId.get(link.attachment.centerId)!);
          const angle = drag?.id === object.id ? drag.angle ?? orbitAngleAt(point, center, aspect)
            : orbitAngle(link.attachment, time, motion);
          const radians = angle * Math.PI / 180;
          const radii = orbitRadii(link.orbit.radius, aspect);
          result = { x: center.x + radii.x * Math.cos(radians), y: center.y + radii.y * Math.sin(radians) };
        }
        positions.set(object.id, result);
        return result;
      }
      objects.forEach(position);
      return positions;
    }
  };
}

export function detachFromOrbit(object: GalaxyLocation, point?: Point) {
  if (point) {
    object.x = bounded(point.x, object.x, 0, 100);
    object.y = bounded(point.y, object.y, 0, 100);
  }
  delete object.orbit;
}
