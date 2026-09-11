import type { BountyIntel } from "./bounty-integration";
import { getHologramPortrait } from "./hologram-image";

type CalloutOptions = {
  root: HTMLElement;
  stage: HTMLElement;
  resolveItems: (systemId: string) => BountyIntel[] | Promise<BountyIntel[]>;
  onOpen: (bountyId: string) => unknown;
};

export function createPlanetIntelCallout({ root, stage, resolveItems, onOpen }: CalloutOptions) {
  const layer = root.querySelector<HTMLElement>("[data-intel-layer]");
  if (!layer) return null;
  const listeners = new AbortController();
  const signal = listeners.signal;
  const callout = document.createElement("aside");
  callout.className = "gmf-intel-callout";
  callout.setAttribute("aria-label", "Bounty intel");
  callout.hidden = true;
  callout.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <button type="button" class="gmf-intel-callout__body" data-intel-open>
      <span class="gmf-intel-callout__portrait"><img alt="" data-intel-image hidden /><i class="fa-solid fa-crosshairs" data-intel-fallback></i></span>
      <span class="gmf-intel-callout__copy"><small data-intel-kicker>ACTIVE BOUNTY</small><strong data-intel-name></strong><span data-intel-meta></span></span>
    </button>
    <footer class="gmf-intel-callout__nav" data-intel-nav hidden>
      <button type="button" data-intel-previous aria-label="Previous bounty"><i class="fa-solid fa-chevron-left"></i></button>
      <span data-intel-count></span>
      <button type="button" data-intel-next aria-label="Next bounty"><i class="fa-solid fa-chevron-right"></i></button>
    </footer>`;
  layer.append(callout);

  let items: BountyIntel[] = [];
  let itemIndex = 0;
  let activeNode: HTMLElement | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let request = 0;
  let portraitRequest = 0;

  const cancelHide = () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
  };
  const hide = () => {
    request++;
    if (showTimer) clearTimeout(showTimer);
    showTimer = null;
    hideTimer = null;
    activeNode = null;
    items = [];
    callout.hidden = true;
    callout.classList.remove("is-visible", "is-left");
  };
  const scheduleHide = (delay = 180) => {
    cancelHide();
    request++;
    if (showTimer) clearTimeout(showTimer);
    showTimer = null;
    hideTimer = setTimeout(hide, delay);
  };
  const position = () => {
    if (!activeNode || callout.hidden) return;
    const stageRect = stage.getBoundingClientRect();
    const nodeRect = activeNode.getBoundingClientRect();
    const width = callout.offsetWidth || 242;
    const height = callout.offsetHeight || 126;
    const placeLeft = nodeRect.right - stageRect.left + width + 24 > stageRect.width;
    const left = placeLeft ? nodeRect.left - stageRect.left - width - 18 : nodeRect.right - stageRect.left + 18;
    const top = Math.max(48, Math.min(stageRect.height - height - 12, nodeRect.top - stageRect.top + nodeRect.height / 2 - height / 2));
    callout.classList.toggle("is-left", placeLeft);
    callout.style.left = `${Math.max(8, left)}px`;
    callout.style.top = `${top}px`;
  };
  const renderItem = () => {
    const item = items[itemIndex];
    if (!item) return hide();
    const name = callout.querySelector("[data-intel-name]");
    const kicker = callout.querySelector("[data-intel-kicker]");
    const meta = callout.querySelector("[data-intel-meta]");
    const nav: HTMLElement | null = callout.querySelector("[data-intel-nav]");
    const count = callout.querySelector("[data-intel-count]");
    const image: HTMLImageElement | null = callout.querySelector("[data-intel-image]");
    const fallback: HTMLElement | null = callout.querySelector("[data-intel-fallback]");
    if (name) name.textContent = item.name;
    if (kicker) kicker.textContent = `BOUNTY // ${(item.statusLabel || "INTEL").toUpperCase()}`;
    if (meta) meta.textContent = [item.statusLabel, item.reward].filter(Boolean).join(" // ");
    if (nav) nav.hidden = items.length < 2;
    if (count) count.textContent = `${String(itemIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    const currentPortraitRequest = ++portraitRequest;
    if (image) {
      image.hidden = true;
      image.removeAttribute("src");
    }
    if (fallback) fallback.hidden = false;
    if (item.image && image) {
      image.src = item.image;
      image.classList.add("is-css-fallback");
      image.hidden = false;
      if (fallback) fallback.hidden = true;
      image.onerror = () => {
        if (currentPortraitRequest !== portraitRequest) return;
        image.hidden = true;
        if (fallback) fallback.hidden = false;
      };
      void getHologramPortrait(item.image, item.id).then((source) => {
        if (!source || currentPortraitRequest !== portraitRequest || items[itemIndex]?.id !== item.id) return;
        image.classList.remove("is-css-fallback");
        image.src = source;
      });
    }
    position();
  };
  const show = async (node: HTMLElement) => {
    cancelHide();
    activeNode = node;
    const currentRequest = ++request;
    let resolved: BountyIntel[] = [];
    try {
      resolved = await resolveItems(node.dataset.systemId ?? "");
    } catch {
      // Optional integrations must fail closed without disturbing map interaction.
    }
    if (currentRequest !== request || activeNode !== node) return;
    if (!resolved.length) return hide();
    items = resolved;
    itemIndex = 0;
    callout.hidden = false;
    renderItem();
    requestAnimationFrame(() => {
      position();
      callout.classList.add("is-visible");
    });
  };
  const scheduleShow = (node: HTMLElement) => {
    cancelHide();
    request++;
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      showTimer = null;
      void show(node);
    }, 90);
  };

  root.querySelectorAll<HTMLElement>("[data-system-id]").forEach((node) => {
    node.addEventListener("pointerenter", () => scheduleShow(node), { signal });
    node.addEventListener("pointerleave", () => scheduleHide(), { signal });
    node.addEventListener("focus", () => scheduleShow(node), { signal });
    node.addEventListener("blur", () => scheduleHide(), { signal });
    node.addEventListener("pointerdown", () => hide(), { signal });
  });
  callout.addEventListener("pointerenter", cancelHide, { signal });
  callout.addEventListener("pointerleave", () => scheduleHide(), { signal });
  callout.addEventListener("click", (event) => event.stopPropagation(), { signal });
  callout.querySelector("[data-intel-open]")?.addEventListener("click", () => {
    const item = items[itemIndex];
    if (item) onOpen(item.id);
  }, { signal });
  callout.querySelector("[data-intel-previous]")?.addEventListener("click", () => {
    itemIndex = (itemIndex - 1 + items.length) % items.length;
    renderItem();
  }, { signal });
  callout.querySelector("[data-intel-next]")?.addEventListener("click", () => {
    itemIndex = (itemIndex + 1) % items.length;
    renderItem();
  }, { signal });
  stage.addEventListener("wheel", () => requestAnimationFrame(position), { signal });
  window.addEventListener("resize", position, { signal });

  return {
    dispose() {
      request++;
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) clearTimeout(showTimer);
      listeners.abort();
      callout.remove();
    }
  };
}
