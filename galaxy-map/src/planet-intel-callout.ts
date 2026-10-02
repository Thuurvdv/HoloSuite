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
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`;
  layer.append(callout);

  let items: BountyIntel[] = [];
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
    portraitRequest++;
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
    callout.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, stageRect.height - 72)}px`);
    const width = callout.offsetWidth || 224;
    const height = callout.offsetHeight || 126;
    const placeLeft = nodeRect.right - stageRect.left + width + 24 > stageRect.width;
    const left = placeLeft ? nodeRect.left - stageRect.left - width - 18 : nodeRect.right - stageRect.left + 18;
    const top = Math.max(48, Math.min(stageRect.height - height - 12, nodeRect.top - stageRect.top + nodeRect.height / 2 - height / 2));
    callout.classList.toggle("is-left", placeLeft);
    callout.style.left = `${Math.max(8, left)}px`;
    callout.style.top = `${top}px`;
  };
  const renderItems = () => {
    const list: HTMLElement | null = callout.querySelector("[data-intel-list]");
    if (!list || !items.length) return hide();
    list.replaceChildren();
    const currentPortraitRequest = ++portraitRequest;
    items.forEach((item, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "gmf-intel-callout__body";
      card.dataset.intelOpen = item.id;
      card.style.setProperty("--gmf-intel-index", String(index));
      card.style.setProperty("--gmf-intel-delay", `${index * 55}ms`);
      card.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const name = card.querySelector("strong");
      const kicker = card.querySelector("small");
      const meta = card.querySelector(".gmf-intel-callout__copy > span");
      const image: HTMLImageElement | null = card.querySelector("img");
      const fallback: HTMLElement | null = card.querySelector("i");
      if (name) name.textContent = item.name;
      if (kicker) kicker.textContent = `BOUNTY // ${(item.statusLabel || "INTEL").toUpperCase()}`;
      if (meta) meta.textContent = item.reward || "";
      card.addEventListener("click", () => onOpen(item.id), { signal });
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
          if (!source || currentPortraitRequest !== portraitRequest || !card.isConnected) return;
          image.classList.remove("is-css-fallback");
          image.src = source;
        });
      }
      list.append(card);
    });
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
    callout.hidden = false;
    renderItems();
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
