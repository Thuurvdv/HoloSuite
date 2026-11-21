import { createOrbitLayout, DEFAULT_ORBIT_ASPECT, orbitAngleAt, orbitRadii, orbitTime } from "./orbits";
import type { OrbitDrag } from "./orbits";
import { buildTerritories } from "./territories";

type OrbitLayout = ReturnType<typeof createOrbitLayout>;
type Point = { x: number; y: number };

export function mountOrbitLayer(viewport: HTMLElement, layout: OrbitLayout, territories?: {
  members: (Parameters<typeof buildTerritories>[0][number] & { id: string })[];
  factions: Parameters<typeof buildTerritories>[1];
}) {
  const svg = viewport.querySelector(".gmf-orbits");
  const rings = svg ? layout.rings.map(ring => {
    const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    ellipse.setAttribute("vector-effect", "non-scaling-stroke");
    svg.append(ellipse);
    return { ...ring, ellipse };
  }) : [];
  const markers = Array.from(viewport.querySelectorAll<HTMLElement>(".gmf-system[data-system-id]"));
  const routes = Array.from(viewport.querySelectorAll<SVGLineElement>("[data-route-from][data-route-to]"));
  const outlines = Array.from(viewport.querySelectorAll<SVGPolygonElement>("[data-territory-faction]"));
  const labels = Array.from(viewport.querySelectorAll<HTMLElement>("[data-territory-label]"));
  const reducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
  let aspect = DEFAULT_ORBIT_ASPECT;
  let frame: number | null = null;
  let drag: OrbitDrag | undefined;

  const positionsAt = (time = orbitTime()) => layout.positions(aspect, time, !reducedMotion.matches, drag);
  function draw() {
    const positions = positionsAt();
    for (const marker of markers) {
      const point = positions.get(marker.dataset.systemId!);
      if (!point) continue;
      const left = `${Number(point.x.toFixed(5))}%`;
      const top = `${Number(point.y.toFixed(5))}%`;
      if (marker.style.left !== left) marker.style.left = left;
      if (marker.style.top !== top) marker.style.top = top;
    }
    for (const line of routes) {
      const from = positions.get(line.dataset.routeFrom!);
      const to = positions.get(line.dataset.routeTo!);
      if (from && to) {
        setNumber(line, "x1", from.x);
        setNumber(line, "y1", from.y);
        setNumber(line, "x2", to.x);
        setNumber(line, "y2", to.y);
      }
    }
    for (const { centerId, radius, ellipse } of rings) {
      const center = positions.get(centerId)!;
      const radii = orbitRadii(radius, aspect);
      setNumber(ellipse, "cx", center.x);
      setNumber(ellipse, "cy", center.y);
      setNumber(ellipse, "rx", radii.x);
      setNumber(ellipse, "ry", radii.y);
    }
    if (territories && outlines.length) {
      const regions = buildTerritories(territories.members.map(member => ({
        ...member, ...positions.get(member.id)
      })), territories.factions, { cluster: false });
      for (const region of regions) {
        const outline = outlines.find(element => element.dataset.territoryFaction === region.id);
        if (outline && outline.getAttribute("points") !== region.points) outline.setAttribute("points", region.points);
        const label = labels.find(element => element.dataset.territoryLabel === region.id);
        if (label) {
          label.style.left = `${region.labelX}%`;
          label.style.top = `${region.labelY}%`;
        }
      }
    }
  }

  function refresh() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!viewport.isConnected) return;
    draw();
    if (layout.animated && !reducedMotion.matches) frame = requestAnimationFrame(refresh);
  }

  reducedMotion.addEventListener("change", refresh);
  return {
    get aspect() { return aspect; },
    get motion() { return !reducedMotion.matches; },
    setAspect(value: number) {
      if (Number.isFinite(value) && value > 0) aspect = value;
      refresh();
    },
    previewDrag(id: string, point: Point) {
      drag = { id, point };
      draw();
    },
    finishDrag(id: string, point: Point) {
      const link = layout.attachments.get(id)?.attachment;
      const center = link && positionsAt().get(link.centerId);
      if (!link || !center) return;
      const angle = orbitAngleAt(point, center, aspect);
      drag = { id, point, angle };
      return { centerId: link.centerId, orbitId: link.orbitId, angle };
    },
    cancelDrag() {
      drag = undefined;
      draw();
    },
    position(id: string, time?: number) {
      return layout.attachments.has(id) ? positionsAt(time).get(id) : undefined;
    },
    dispose() {
      if (frame !== null) cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", refresh);
    }
  };
}

function setNumber(element: SVGElement, name: string, value: number) {
  const text = String(value);
  if (element.getAttribute(name) !== text) element.setAttribute(name, text);
}
