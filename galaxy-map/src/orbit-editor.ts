import { randomId } from "./galaxy-model";
import type { GalaxyOrbit, GalaxyOrbitAttachment } from "./galaxy-types";
import { orbitTime } from "./orbits";

export function bindOrbitEditor(form: HTMLFormElement, data: { orbits?: GalaxyOrbit[]; orbit?: GalaxyOrbitAttachment }) {
  const editor = form.querySelector("[data-orbit-editor]");
  if (!editor) return;
  const rows = editor.querySelector("[data-orbit-rows]")!;
  const template = editor.querySelector<HTMLTemplateElement>("[data-orbit-row-template]")!;
  const attachment = editor.querySelector<HTMLSelectElement>("[data-orbit-attachment]")!;
  const placement = editor.querySelector<HTMLElement>("[data-orbit-placement]")!;
  const angle = editor.querySelector<HTMLInputElement>("[data-orbit-angle]")!;
  const motion = editor.querySelector<HTMLSelectElement>("[data-orbit-motion]")!;
  const speed = editor.querySelector<HTMLElement>("[data-orbit-speed]")!;
  const period = editor.querySelector<HTMLInputElement>("[data-orbit-period]")!;

  function addRow(ring: GalaxyOrbit, focus = false) {
    const row = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const radius = row.querySelector<HTMLInputElement>("[data-orbit-radius]")!;
    row.dataset.orbitId = ring.id;
    radius.value = String(ring.radius);
    row.querySelector("[data-remove-orbit]")!.addEventListener("click", () => row.remove());
    rows.append(row);
    if (focus) radius.focus();
  }
  for (const ring of data.orbits ?? []) addRow(ring);
  editor.querySelector("[data-add-orbit]")!.addEventListener("click", () => {
    addRow({ id: randomId("orbit"), radius: Math.min(100, 15 + rows.childElementCount * 10) }, true);
  });

  const previous = data.orbit;
  if (previous) {
    angle.value = String(previous.angle);
    if (previous.period) {
      motion.value = previous.clockwise ? "clockwise" : "counterclockwise";
      period.value = String(previous.period);
    }
  }

  function updatePlacement() {
    placement.hidden = !attachment.value;
    angle.disabled = placement.hidden;
    speed.hidden = motion.value === "fixed";
    period.disabled = placement.hidden || speed.hidden;
  }
  attachment.addEventListener("change", updatePlacement);
  motion.addEventListener("change", updatePlacement);
  updatePlacement();

  return () => {
    const orbits = Array.from(rows.querySelectorAll<HTMLElement>("[data-orbit-row]"), row => ({
      id: row.dataset.orbitId!,
      radius: Number(row.querySelector<HTMLInputElement>("[data-orbit-radius]")!.value)
    }));
    const previousRings = data.orbits ?? [];
    const changedRings = orbits.length !== previousRings.length || orbits.some((ring, index) =>
      ring.id !== previousRings[index].id || ring.radius !== previousRings[index].radius);
    const changes = changedRings ? { orbits } : {};
    if (!attachment.value) return previous ? { ...changes, orbit: null } : changes;
    const [centerId, orbitId] = JSON.parse(attachment.value);
    const link = {
      centerId, orbitId,
      angle: Number(angle.value),
      period: speed.hidden ? 0 : Number(period.value),
      clockwise: speed.hidden ? previous?.clockwise ?? true : motion.value === "clockwise"
    };
    const unchanged = previous && Object.entries(link).every(([key, value]) => previous[key as keyof GalaxyOrbitAttachment] === value);
    return unchanged ? changes : { ...changes, orbit: { ...link, epoch: orbitTime() } };
  };
}
