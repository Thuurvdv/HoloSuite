const detailAnimations = new WeakMap<HTMLElement, Animation>();

export function prefersReducedMotion() {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function revealBoard(root: HTMLElement) {
  if (prefersReducedMotion()) return;
  root.querySelector<HTMLElement>(".bb-dossier-frame")?.animate?.(
    [{ opacity: 0.25 }, { opacity: 1 }], { duration: 240, easing: "ease-out" }
  );
  // Only animate visible cards, and cap the stagger for large boards.
  const viewport = root.querySelector(".bb-results")?.getBoundingClientRect();
  let index = 0;
  root.querySelectorAll<HTMLElement>(".bb-card:not([hidden])").forEach((card) => {
    if (viewport && card.getBoundingClientRect().top >= viewport.bottom) return;
    const animation = card.animate?.(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 240, delay: Math.min(index++, 5) * 45, easing: "ease-out", fill: "backwards" }
    );
    if (animation) animation.onfinish = () => animation.cancel();
  });
}

export function toggleDetails(details: HTMLElement, expanded: boolean) {
  const previous = detailAnimations.get(details);
  const startHeight = details.hidden ? 0 : details.getBoundingClientRect().height;
  previous?.cancel();
  detailAnimations.delete(details);
  details.inert = !expanded;
  if (prefersReducedMotion() || !details.animate) {
    details.hidden = !expanded;
    details.style.removeProperty("overflow");
    return;
  }
  details.hidden = false;
  const fullHeight = details.getBoundingClientRect().height;
  const style = getComputedStyle(details);
  const open = { height: `${fullHeight}px`, paddingTop: style.paddingTop, paddingBottom: style.paddingBottom,
    borderTopWidth: style.borderTopWidth, marginBottom: style.marginBottom, opacity: 1 };
  const closed = { height: "0px", paddingTop: "0px", paddingBottom: "0px", borderTopWidth: "0px", marginBottom: "0px", opacity: 0 };
  const from = previous ? { ...open, height: `${startHeight}px` } : expanded ? closed : open;
  details.style.overflow = "hidden";
  const animation = details.animate([from, expanded ? open : closed], { duration: 190, easing: "ease-out" });
  detailAnimations.set(details, animation);
  animation.onfinish = () => {
    if (detailAnimations.get(details) !== animation) return;
    details.hidden = !expanded;
    details.style.removeProperty("overflow");
    detailAnimations.delete(details);
    animation.cancel();
  };
}

export function pulseStatus(card: HTMLElement, previousStatus: string | undefined) {
  if (!previousStatus || previousStatus === card.dataset.status || prefersReducedMotion()) return;
  card.classList.add("bb-status-changed");
  card.addEventListener("animationend", () => card.classList.remove("bb-status-changed"), { once: true });
}
