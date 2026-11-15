import type { GalaxyFaction } from "./galaxy-types";

interface TerritoryMember {
  factionId: string;
  x: number;
  y: number;
  obscured?: boolean;
}

type Point = [number, number];

// Bound the span of each galaxy region even when a chain of nearby systems
// connects opposite ends of the map. Input is sorted before grouping.
const GALAXY_REGION_SPAN = 22;

function clusterPoints(points: Point[]) {
  const clusters: Point[][] = [];
  for (const point of points) {
    const cluster = clusters.find(group => group.every(other =>
      Math.hypot(point[0] - other[0], point[1] - other[1]) <= GALAXY_REGION_SPAN));
    if (cluster) cluster.push(point);
    else clusters.push([point]);
  }
  return clusters;
}

const comparePoints = (a: Point, b: Point) => a[0] - b[0] || a[1] - b[1];

function uniquePoints(points: Point[]) {
  return points.sort(comparePoints).filter((point, index) =>
    index === 0 || comparePoints(point, points[index - 1]) !== 0);
}

function convexHull(points: Point[]) {
  const cross = (o: Point, a: Point, b: Point) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Point[]) => {
    const hull: Point[] = [];
    for (const point of list) {
      while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
      hull.push(point);
    }
    return hull.slice(0, -1);
  };
  return [...half(points), ...half([...points].reverse())];
}

// Display-only influence regions. Call with visibility-filtered map data.
export function buildTerritories(
  systems: TerritoryMember[],
  factions: (Pick<GalaxyFaction, "id" | "name" | "color"> & Partial<Pick<GalaxyFaction, "kind">>)[],
  { cluster = true } = {}
) {
  const members = new Map<string, Point[]>();
  for (const system of systems) {
    if (!system.factionId || system.obscured || !Number.isFinite(system.x) || !Number.isFinite(system.y)) continue;
    const points = members.get(system.factionId) ?? [];
    points.push([Math.max(0, Math.min(100, system.x)), Math.max(0, Math.min(100, system.y))]);
    members.set(system.factionId, points);
  }
  const radiusX = cluster ? 5 : 7;
  const radiusY = cluster ? 7 : 9;
  const toMap = (value: number) => Math.round(Math.max(1, Math.min(99, value)) * 100) / 100;
  return factions.filter(faction => faction.kind !== "minor").flatMap(({ id, name, color }) => {
    const points = uniquePoints(members.get(id) ?? []);
    if (!points.length) return [];
    return (cluster ? clusterPoints(points) : [points]).map(region => {
      const padding = uniquePoints(region.flatMap(([x, y]) => Array.from({ length: 12 }, (_, i): Point => {
        const angle = i * Math.PI / 6;
        return [toMap(x + Math.cos(angle) * radiusX), toMap(y + Math.sin(angle) * radiusY)];
      })));
      const hull = convexHull(padding);
      const bounds = hull.reduce(({ left, right, top }, [x, y]) => ({
        left: Math.min(left, x), right: Math.max(right, x), top: Math.min(top, y)
      }), { left: 100, right: 0, top: 100 });
      return {
        id, name, color,
        points: hull.map(point => point.join(",")).join(" "),
        labelX: Math.max(12, Math.min(88, (bounds.left + bounds.right) / 2)),
        labelY: Math.max(3, bounds.top + 1)
      };
    });
  });
}
