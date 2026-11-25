import type { HoloSuiteBranding } from "../../shared/src/index";

const ROOT = "[data-holosuite-branding]";
const DEFAULT = "data-holosuite-branding-default";
const OVERRIDE = "data-holosuite-branding-override";

// Keep the original nodes so reset can restore native artwork and labels.
function showOverride(target: Element, replacement?: HTMLElement): void {
  target.querySelector(`:scope > [${OVERRIDE}]`)?.remove();
  let original = target.querySelector<HTMLElement>(`:scope > [${DEFAULT}]`);
  if (!replacement) {
    if (original) original.replaceWith(...original.childNodes);
    return;
  }
  if (!original) {
    original = document.createElement("span");
    original.setAttribute(DEFAULT, "");
    original.style.display = "none";
    original.append(...target.childNodes);
    target.append(original);
  }
  replacement.setAttribute(OVERRIDE, "");
  target.append(replacement);
}

function nameOverride(name?: string): HTMLElement | undefined {
  if (!name) return;
  const label = document.createElement("span");
  label.textContent = name;
  return label;
}

function iconOverride({ logo, iconImage, icon }: HoloSuiteBranding): HTMLElement | undefined {
  const source = logo || iconImage;
  if (!source && !icon) return;
  const mark = document.createElement("span");
  mark.className = "holosuite-module-brand-icon";
  mark.setAttribute("aria-hidden", "true");
  if (source) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    const showFallback = () => {
      if (!mark.parentElement) return;
      const fallback = iconOverride({ icon });
      if (fallback) mark.replaceChildren(...fallback.childNodes);
      else showOverride(mark.parentElement);
    };
    mark.append(image);
    image.addEventListener("error", showFallback, { once: true });
    if (image.complete && !image.naturalWidth) queueMicrotask(showFallback);
  } else {
    const glyph = document.createElement("i");
    glyph.className = `fa-solid ${icon}`;
    mark.append(glyph);
  }
  return mark;
}

export function refreshModuleBranding(
  scope: Document | HTMLElement, getBranding: (id: string) => HoloSuiteBranding
): void {
  const roots = [...scope.querySelectorAll<HTMLElement>(ROOT)];
  if (scope instanceof HTMLElement && scope.matches(ROOT)) roots.unshift(scope);
  for (const root of roots) {
    const brand = getBranding(root.dataset.holosuiteBranding!);
    for (const label of root.querySelectorAll("[data-holosuite-brand-name]")) {
      showOverride(label, nameOverride(brand.name));
    }
    for (const label of root.querySelectorAll<HTMLElement>("[data-holosuite-brand-text]")) {
      const key = label.dataset.holosuiteBrandText!;
      const fallback = label.hasAttribute("data-holosuite-brand-fallback-name") ? brand.name : undefined;
      showOverride(label, nameOverride((key === "tagline" ? brand.tagline : brand.text?.[key]) || fallback));
    }
    for (const icon of root.querySelectorAll("[data-holosuite-brand-icon]")) {
      showOverride(icon, iconOverride(brand));
    }
    const header = root.closest(".app, .application")?.querySelector(":scope > .window-header");
    const title = header?.querySelector(".window-title");
    if (title) {
      const nativeTitle = title.querySelector(`:scope > [${DEFAULT}]`)?.textContent ?? title.textContent;
      const name = brand.name && root.hasAttribute("data-holosuite-brand-title-prefix") && nativeTitle
        ? `${brand.name} · ${nativeTitle}`
        : brand.name;
      showOverride(title, nameOverride(name));
    }
  }
}
