// Display-only influence regions. Call with the visibility-filtered map data.
export function buildTerritories(systems: any[], factions: any[]) {
  const cross = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  return factions.flatMap(faction => {
    const members = systems.filter(s => s.factionId === faction.id && !s.obscured);
    if (!members.length) return [];
    const points = members.flatMap(s => Array.from({ length: 12 }, (_, i) => {
      const angle = i * Math.PI / 6;
      return [Math.max(1, Math.min(99, s.x + Math.cos(angle) * 7)),
        Math.max(1, Math.min(99, s.y + Math.sin(angle) * 9))];
    })).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const half = (list: number[][]) => {
      const hull: number[][] = [];
      for (const point of list) {
        while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) hull.pop();
        hull.push(point);
      }
      return hull.slice(0, -1);
    };
    const hull = [...half(points), ...half([...points].reverse())];
    const minY = Math.min(...points.map(p => p[1]));
    return [{ id: faction.id, name: faction.name, color: faction.color,
      points: hull.map(p => p.map(n => n.toFixed(2)).join(',')).join(' '),
      labelX: (Math.min(...points.map(p => p[0])) + Math.max(...points.map(p => p[0]))) / 2,
      labelY: Math.max(3, minY + 3) }];
  });
}
