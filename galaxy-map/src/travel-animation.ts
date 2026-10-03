import { TRAVEL_ANIMATION_MS } from "./galaxy-model";

export function animateShipTravel(from: any, to: any, html: HTMLElement) {
  const layer = html.querySelector("[data-ship-layer]");
  const stage = html.querySelector(".gmf-map-stage");
  if (!layer || !stage) return Promise.resolve();

  const rect = stage.getBoundingClientRect();
  const dx = (to.x - from.x) * rect.width / 100;
  const dy = (to.y - from.y) * rect.height / 100;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const ship = document.createElement("div");
  ship.className = "gmf-travel-ship";
  ship.innerHTML = '<i class="fa-solid fa-rocket"></i>';
  ship.style.left = `${from.x}%`;
  ship.style.top = `${from.y}%`;
  ship.style.setProperty("--gmf-ship-angle", `${angle}deg`);
  layer.replaceChildren(ship);

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      ship.removeEventListener("transitionend", finish);
      ship.classList.add("is-arrived");
      globalThis.setTimeout(() => {
        ship.remove();
        resolve();
      }, 260);
    };
    ship.addEventListener("transitionend", finish, { once: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ship.style.left = `${to.x}%`;
        ship.style.top = `${to.y}%`;
      });
    });
    globalThis.setTimeout(finish, TRAVEL_ANIMATION_MS);
  });
}
