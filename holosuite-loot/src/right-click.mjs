/** Own only player loot gestures, before document-level token menu handlers.
 * Contextmenu may arrive before or after pointerup depending on the browser. */
export class LootRightClick {
  gesture = null;
  constructor(target, { canvas, tokenAt, toggle, dismiss, now = Date.now }) {
    this.target = target;
    this.canvas = canvas;
    this.tokenAt = tokenAt;
    this.toggle = toggle;
    this.dismiss = dismiss;
    this.now = now;
    for (const type of ["pointerdown", "pointerup", "pointercancel", "contextmenu"]) target.addEventListener(type, this.handle, { capture: true });
    target.addEventListener("blur", this.blur, { capture: true });
  }
  reset = () => { this.gesture = null; };
  blur = event => { if (event.target === this.target) this.reset(); };
  consume(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  handle = event => {
    if (event.type === "pointercancel") {
      if (this.gesture && this.gesture.pointerId === event.pointerId) { this.consume(event); this.reset(); }
      return;
    }
    if (event.type === "pointerup") {
      if (event.button === 2 && this.gesture && this.gesture.pointerId === event.pointerId && this.gesture.releasedAt === null) {
        this.consume(event);
        this.gesture.releasedAt = this.now();
      }
      return;
    }
    if (event.type === "pointerdown") {
      if (event.button !== 2) return;
      this.reset();
    }
    if (!this.canvas || !event.composedPath().includes(this.canvas)) return;
    if (event.type === "contextmenu" && this.gesture) {
      if (this.gesture.releasedAt === null || this.now() - this.gesture.releasedAt < 1000) {
        // Suppress the second half of an already handled gesture even if the
        // pointer moved or the corpse became unavailable while the button was held.
        this.consume(event);
        return;
      }
      this.reset();
    }
    const token = this.tokenAt(event);
    if (!token) { this.dismiss(); return; }
    this.consume(event);
    if (event.type === "pointerdown") this.gesture = { pointerId: event.pointerId, releasedAt: null };
    this.toggle(token);
  };
  destroy() {
    for (const type of ["pointerdown", "pointerup", "pointercancel", "contextmenu"]) this.target.removeEventListener(type, this.handle, { capture: true });
    this.target.removeEventListener("blur", this.blur, { capture: true });
    this.reset();
  }
}
