/** A selectable help popup that stays open until an outside click. */
export function bindPersistentTooltip(trigger: HTMLElement | null, getText: () => string) {
  if (!trigger || trigger.dataset.persistentTooltipBound) return;
  trigger.dataset.persistentTooltipBound = "true";
  let popup: HTMLElement | null = null;
  const open = () => {
    if (popup || !trigger.isConnected || !trigger.getClientRects().length) return;
    // Both modules use this event so only one skill help popup is open at once.
    document.dispatchEvent(new Event("holosuite-close-skill-help"));
    popup = document.createElement("aside");
    popup.className = "holosuite-skill-help";
    popup.id = `holosuite-skill-help-${crypto.randomUUID()}`;
    popup.setAttribute("role", "note");
    popup.setAttribute("popover", "manual");
    popup.tabIndex = 0;
    popup.textContent = getText();
    Object.assign(popup.style, {
      position: "fixed", inset: "auto", margin: "0", padding: "12px",
      width: "min(380px, calc(100vw - 24px))", maxHeight: "calc(100vh - 24px)",
      boxSizing: "border-box", overflow: "auto", overflowWrap: "break-word",
      background: "#10151f", color: "#edf2f7", border: "1px solid #65788c",
      borderRadius: "6px", boxShadow: "0 4px 16px #0008", zIndex: "100000",
      fontSize: "14px", lineHeight: "1.45", fontWeight: "normal", textAlign: "left",
      userSelect: "text", pointerEvents: "auto"
    });
    document.body.appendChild(popup);
    popup.showPopover?.();
    trigger.setAttribute("aria-describedby", popup.id);
    trigger.setAttribute("aria-expanded", "true");
    const position = () => {
      if (!popup) return;
      const box = trigger.getBoundingClientRect();
      const left = Math.max(12, Math.min(box.left, window.innerWidth - popup.offsetWidth - 12));
      const below = box.bottom + 8;
      const top = below + popup.offsetHeight <= window.innerHeight - 12
        ? below : Math.max(12, box.top - popup.offsetHeight - 8);
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    };
    const close = () => {
      popup?.remove();
      popup = null;
      trigger.removeAttribute("aria-describedby");
      trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", outsideClick, true);
      document.removeEventListener("keydown", keydown, true);
      document.removeEventListener("holosuite-close-skill-help", close);
      window.removeEventListener("resize", position);
      document.removeEventListener("scroll", position, true);
      observer.disconnect();
    };
    const outsideClick = (event: MouseEvent) => {
      if (!popup?.contains(event.target as Node) && !trigger.contains(event.target as Node)) close();
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const observer = new MutationObserver(() => {
      if (!trigger.isConnected || !trigger.getClientRects().length) close();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("click", outsideClick, true);
    document.addEventListener("keydown", keydown, true);
    document.addEventListener("holosuite-close-skill-help", close);
    window.addEventListener("resize", position);
    document.addEventListener("scroll", position, true);
    position();
  };
  trigger.addEventListener("pointerenter", open);
  trigger.addEventListener("focus", open);
  trigger.addEventListener("click", (event) => { event.preventDefault(); open(); });
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
  });
}
