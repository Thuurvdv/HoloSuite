declare const canvas: any;

export class OutsideDismissal {
  outside = (event: PointerEvent) => {
    if (!event.composedPath().includes(this.root)) this.dismiss();
  };
  constructor(public root: HTMLElement, public dismiss: () => void) {
    document.addEventListener("pointerdown", this.outside, true);
  }
  destroy() { document.removeEventListener("pointerdown", this.outside, true); }
}

/** A DOM overlay follows canvas coordinates without joining Foundry's PIXI scene. */
export class LootPopupPresentation {
  frame = 0;
  destroyed = false;
  svg: SVGSVGElement;
  line: SVGLineElement;
  lastGeometry = "";
  outside = (event: PointerEvent) => {
    const path = event.composedPath();
    // The canvas handler owns right-click toggling. Closing in both capture
    // handlers would immediately reopen a window that is still tearing down.
    if (event.button === 2 && path.includes(canvas.app?.canvas ?? canvas.app?.view)) return;
    if (!path.includes(this.root)) this.dismiss();
  };
  constructor(public root: HTMLElement, public token: any,
    public position: (left: number, top: number) => void, public dismiss: () => void) {
    const ns = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(ns, "svg");
    this.svg.classList.add("hl-loot-tether");
    this.svg.setAttribute("aria-hidden", "true");
    this.line = document.createElementNS(ns, "line");
    this.svg.append(this.line);
    document.body.append(this.svg);
    document.addEventListener("pointerdown", this.outside, true);
    this.frame = requestAnimationFrame(this.update);
  }
  update = () => {
    if (this.destroyed) return;
    const view = canvas.app?.canvas ?? canvas.app?.view;
    const target = this.token.object;
    // Do not dismiss during a transient canvas visibility recalculation.
    if (!this.root.isConnected) { this.destroy(); return; }
    if (!target || this.token.hidden) {
      this.destroy();
      this.dismiss();
      return;
    }
    if (this.root.isConnected && view && canvas.stage) {
      const bounds = view.getBoundingClientRect();
      const screen = canvas.app.renderer.screen;
      const point = canvas.stage.worldTransform.apply(target.center);
      const x = bounds.left + point.x * bounds.width / screen.width;
      const y = bounds.top + point.y * bounds.height / screen.height;
      const rect = this.root.getBoundingClientRect();
      const gap = 24 + Math.min(60, (target.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2);
      const preferredLeft = x + gap + rect.width <= innerWidth - 8 ? x + gap : x - gap - rect.width;
      const left = Math.max(8, Math.min(innerWidth - rect.width - 8, preferredLeft));
      const top = Math.max(8, Math.min(innerHeight - rect.height - 8, y - rect.height / 3));
      if (Math.abs(rect.left - left) > .5 || Math.abs(rect.top - top) > .5) this.position(left, top);
      const panel = this.root.querySelector<HTMLElement>(".hl-panel") ?? this.root;
      const border = panel.getBoundingClientRect();
      const style = getComputedStyle(panel);
      const thickness = parseFloat(style.borderLeftWidth) || 3;
      const radius = Math.min(parseFloat(style.borderTopLeftRadius) || 0, border.height / 2, border.width / 2);
      const side = x <= border.left || x >= border.right;
      const endX = side
        ? (x <= border.left ? border.left + thickness / 2 : border.right - thickness / 2)
        : Math.max(border.left + radius, Math.min(border.right - radius, x));
      const endY = side
        ? Math.max(border.top + radius, Math.min(border.bottom - radius, y))
        : (y < (border.top + border.bottom) / 2 ? border.top + thickness / 2 : border.bottom - thickness / 2);
      const geometry = `${x},${y},${endX},${endY}`;
      if (geometry !== this.lastGeometry) {
        this.line.setAttribute("x1", String(x)); this.line.setAttribute("y1", String(y));
        this.line.setAttribute("x2", String(endX)); this.line.setAttribute("y2", String(endY));
        this.lastGeometry = geometry;
      }
      this.line.style.stroke = style.borderLeftColor;
      this.line.style.strokeWidth = String(thickness);
      this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
    }
    this.frame = requestAnimationFrame(this.update);
  };
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    document.removeEventListener("pointerdown", this.outside, true);
    this.svg.remove();
  }
}
