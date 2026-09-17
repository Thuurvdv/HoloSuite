export type PlanetLocationItem = {
  id: string;
  sceneId: string;
  name: string;
  accessible: boolean;
  missing?: boolean;
  canRemove?: boolean;
};

export function createPlanetLocationCallout({ host }: { host: HTMLElement }) {
  const callout = document.createElement("aside");
  callout.className = "gmf-location-callout";
  callout.hidden = true;
  callout.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`;
  host.append(callout);

  let active: PlanetLocationItem | null = null;
  let anchor = { x: 0, y: 0, visible: false };
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const cancelHide = () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
  };
  const hide = () => {
    cancelHide();
    active = null;
    callout.hidden = true;
    callout.classList.remove("is-visible", "is-left");
  };
  const position = () => {
    if (!active || callout.hidden || !anchor.visible) return;
    const width = callout.offsetWidth || 180;
    const height = callout.offsetHeight || 24;
    const placeLeft = anchor.x + width + 76 > host.clientWidth;
    const left = placeLeft ? anchor.x - width - 64 : anchor.x + 64;
    const top = Math.max(8, Math.min(host.clientHeight - height - 8, anchor.y - height / 2));
    callout.classList.toggle("is-left", placeLeft);
    callout.style.left = `${Math.max(8, left)}px`;
    callout.style.top = `${top}px`;
  };
  const show = (item: PlanetLocationItem) => {
    cancelHide();
    active = item;
    const name = callout.querySelector("[data-location-name]");
    if (name) name.textContent = item.missing ? "Missing linked scene" : item.accessible ? item.name : "Restricted location";
    callout.hidden = false;
    position();
    requestAnimationFrame(() => { position(); callout.classList.add("is-visible"); });
  };
  const scheduleHide = (delay = 180) => {
    cancelHide();
    hideTimer = setTimeout(hide, delay);
  };

  return {
    show,
    scheduleHide,
    hide,
    setAnchor(next: { x: number; y: number; visible: boolean }) {
      anchor = next;
      if (!next.visible) return scheduleHide(40);
      position();
    },
    dispose() {
      hide();
      callout.remove();
    }
  };
}
