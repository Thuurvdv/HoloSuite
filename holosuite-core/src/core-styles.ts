export const CORE_STYLESHEET_PATHS = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
] as const;

export const CORE_STYLESHEET_ATTRIBUTE = "data-holosuite-core-stylesheet";

function stylesheetHref(path: string, moduleVersion: string): string {
  const version = String(moduleVersion ?? "").trim();
  return version ? `${path}?v=${encodeURIComponent(version)}` : path;
}

/**
 * Load or remove Core's styles without touching Foundry's combined /game
 * stylesheet. Keeping these links module-owned makes the debugging switch a
 * true CSS-off test even when Foundry bundles every manifest stylesheet.
 */
export function setCoreStylesEnabled(
  enabled: boolean,
  documentRef: Document = document,
  moduleVersion = ""
): void {
  const managedLinks = Array.from(
    documentRef.querySelectorAll<HTMLLinkElement>(`link[${CORE_STYLESHEET_ATTRIBUTE}]`)
  );

  if (!enabled) {
    for (const link of managedLinks) link.remove();
    return;
  }

  const head = documentRef.head;
  if (!head) return;

  const expectedPaths = new Set<string>(CORE_STYLESHEET_PATHS);
  const existingPaths = new Set<string>();

  for (const link of managedLinks) {
    const path = link.getAttribute(CORE_STYLESHEET_ATTRIBUTE) ?? "";
    if (!expectedPaths.has(path) || existingPaths.has(path)) {
      link.remove();
      continue;
    }
    existingPaths.add(path);
  }

  for (const path of CORE_STYLESHEET_PATHS) {
    if (existingPaths.has(path)) continue;
    const link = documentRef.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheetHref(path, moduleVersion);
    link.setAttribute(CORE_STYLESHEET_ATTRIBUTE, path);
    head.append(link);
  }
}
