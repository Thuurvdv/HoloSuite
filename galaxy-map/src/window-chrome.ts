declare const document: any;

const FRAME_SOURCE = "/modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let frameSourceRequest: Promise<string> | null = null;
const themedFrameUrls = new Map<string, string>();
let frameThemeObserver: MutationObserver | null = null;

const FRAME_PALETTES: Record<string, { primary: string; success: string; background: string }> = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};

function mixHex(first: string, second: string, firstWeight: number) {
  const channels = (hex: string) => [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16));
  const a = channels(first), b = channels(second);
  return `rgb(${a.map((channel, index) => Math.round(channel * firstWeight + b[index] * (1 - firstWeight))).join(", ")})`;
}

function activeFramePalette() {
  const root = document.documentElement;
  const deviceStyle = root?.dataset?.holosuiteDeviceStyle || document.body?.dataset?.holosuiteDeviceStyle || "";
  if (FRAME_PALETTES[deviceStyle]) return FRAME_PALETTES[deviceStyle];
  const theme = root?.dataset?.holosuiteTheme || document.body?.dataset?.holosuiteTheme || "default";
  return FRAME_PALETTES[theme] ?? FRAME_PALETTES.default;
}

async function applyGalaxyFramePalette(frame: HTMLElement) {
  const { primary, success, background } = activeFramePalette();
  const body = mixHex(primary, background, 0.58);
  const shadow = mixHex(primary, background, 0.34);
  const key = [primary, success, body, shadow, background].join("|");
  frame.dataset.gmfFramePalette = key;
  let url = themedFrameUrls.get(key);
  if (!url) {
    try {
      frameSourceRequest ??= fetch(FRAME_SOURCE).then(response => {
        if (!response.ok) throw new Error(`Galaxy frame request failed (${response.status})`);
        return response.text();
      });
      let svg = await frameSourceRequest;
      // Scripts exported by drawing tools are unnecessary and cannot run when
      // an SVG is consumed as a CSS border image.
      svg = svg.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const palette = new Map([
        ["#18ebed", primary], ["#28f3f5", primary], ["#3be8e4", primary],
        ["#64f4f1", success], ["#1490ab", body], ["#22788b", shadow],
        ["#042228", background]
      ]);
      for (const [source, replacement] of palette) svg = svg.replace(new RegExp(source, "gi"), replacement);
      url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      themedFrameUrls.set(key, url);
    } catch {
      return; // Keep the original cyan SVG when loading or recoloring fails.
    }
  }
  if (frame.isConnected && frame.dataset.gmfFramePalette === key) frame.style.setProperty("--gmf-frame-image", `url("${url}")`);
}

function observeGalaxyFrameTheme() {
  if (frameThemeObserver || typeof MutationObserver === "undefined") return;
  frameThemeObserver = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog")
      .forEach((frame: HTMLElement) => void applyGalaxyFramePalette(frame));
  });
  const settings = { attributes: true, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  frameThemeObserver.observe(document.documentElement, settings);
  if (document.body) frameThemeObserver.observe(document.body, settings);
}

function asElement(value: any): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (value?.[0] instanceof HTMLElement) return value[0];
  return null;
}

function windowFrame(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  return root.matches?.(".window-app, .application, .app")
    ? root
    : root.closest?.(".window-app, .application, .app");
}

export function activateGalaxyWindowChrome(app: any, value: any) {
  const root = asElement(value);
  const frame = windowFrame(root);
  if (frame) {
    observeGalaxyFrameTheme();
    void applyGalaxyFramePalette(frame);
  }
  const dragHandles = Array.from(root?.querySelectorAll?.("[data-gmf-window-drag]") ?? []) as HTMLElement[];
  if (!root || !frame || !dragHandles.length) return;

  root.querySelectorAll?.("[data-action='close-window']").forEach((button: HTMLElement) => {
    if (button.dataset.gmfCloseBound === "true") return;
    button.dataset.gmfCloseBound = "true";
    button.addEventListener("click", () => app.close?.());
  });

  for (const dragHandle of dragHandles) {
    if (dragHandle.dataset.gmfDragBound === "true") continue;
    dragHandle.dataset.gmfDragBound = "true";
    dragHandle.addEventListener("pointerdown", (event: PointerEvent) => {
    if (event.button !== 0) return;
    const target = event.target as Element | null;
    if (target?.closest?.("button, input, select, textarea, a, [data-action]")) return;
    const bounds = frame.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = bounds.left;
    const startTop = bounds.top;
    app.bringToTop?.();
    dragHandle.setPointerCapture?.(event.pointerId);
    dragHandle.classList.add("is-dragging");

    const move = (moveEvent: PointerEvent) => {
      const width = frame.getBoundingClientRect().width;
      const height = frame.getBoundingClientRect().height;
      const left = Math.max(0, Math.min(window.innerWidth - Math.min(width, 80), startLeft + moveEvent.clientX - startX));
      const top = Math.max(0, Math.min(window.innerHeight - Math.min(height, 48), startTop + moveEvent.clientY - startY));
      app.setPosition?.({ left, top });
    };
    const finish = () => {
      dragHandle.classList.remove("is-dragging");
      dragHandle.removeEventListener("pointermove", move);
      dragHandle.removeEventListener("pointerup", finish);
      dragHandle.removeEventListener("pointercancel", finish);
    };
    dragHandle.addEventListener("pointermove", move);
    dragHandle.addEventListener("pointerup", finish);
    dragHandle.addEventListener("pointercancel", finish);
    });
  }
}

export function activateGalaxyDialogChrome(app: any, value: any) {
  const root = asElement(value);
  const frame = windowFrame(root);
  const content = frame?.querySelector?.(":scope > .window-content") as HTMLElement | null;
  if (!root || !frame || !content || content.querySelector(":scope > .gmf-dialog-header")) return;

  const header = document.createElement("header");
  header.className = "gmf-dialog-header";
  header.dataset.gmfWindowDrag = "true";
  const identity = document.createElement("div");
  identity.className = "gmf-dialog-header__identity";
  identity.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const title = identity.querySelector("strong");
  if (title) title.textContent = app?.title || frame.querySelector(".window-title")?.textContent || "Galaxy Map";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "gmf-window-close";
  close.dataset.action = "close-window";
  close.title = "Close";
  close.setAttribute("aria-label", "Close window");
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  header.append(identity, close);
  content.prepend(header);
  activateGalaxyWindowChrome(app, frame);
}

export const GALAXY_DIALOG_OPTIONS = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
