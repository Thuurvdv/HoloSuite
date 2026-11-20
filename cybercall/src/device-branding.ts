/** Branding is optional: released Core versions may not expose its API yet. */
export function normalizeEmblemImage(value: unknown) {
  if (typeof value !== "string") return "";
  const path = value.trim();
  if (!path || path.length > 2048 || /[\x00-\x1f<>"'\\]/.test(path) || path.startsWith("//")) return "";
  try {
    const url = new URL(path, "https://world.invalid/");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return "";
    return /\.(png|webp|svg|jpe?g|gif|avif)$/i.test(url.pathname) ? path : "";
  } catch { return ""; }
}

export function resolveDeviceEmblem(core: any, localImage: unknown) {
  for (const id of ["cybercall", "holosuite-core"]) {
    try {
      const brand = core?.getBranding?.(id) ?? {};
      const image = normalizeEmblemImage(brand.logo) || normalizeEmblemImage(brand.iconImage);
      if (image) return { image, icon: "" };
      if (typeof brand.icon === "string" && /^fa-[a-z0-9-]+$/.test(brand.icon)) return { image: "", icon: brand.icon };
    } catch { /* A missing or incompatible branding API must never stop CyberCall. */ }
  }
  return { image: normalizeEmblemImage(localImage), icon: "" };
}

export function refreshDeviceEmblems(scope: ParentNode) {
  let local = "";
  try { local = game.settings.get("cybercall", "deviceEmblem") ?? ""; } catch { /* Original emblem is the default. */ }
  const brand = resolveDeviceEmblem(game.modules?.get?.("holosuite-core")?.api, local);
  scope.querySelectorAll<HTMLElement>(".cybercall-hardware-emblem").forEach((emblem) => {
    const source = brand.image || brand.icon;
    if ((emblem.dataset.cybercallEmblem ?? "") === source) return;
    emblem.dataset.cybercallEmblem = source;
    emblem.replaceChildren();
    emblem.classList.toggle("cybercall-custom-emblem", Boolean(source));
    if (brand.image) {
      const image = document.createElement("img");
      image.alt = "";
      image.src = brand.image;
      image.addEventListener("error", () => {
        if (image.parentElement !== emblem) return;
        emblem.replaceChildren();
        emblem.classList.remove("cybercall-custom-emblem");
      }, { once: true });
      emblem.append(image);
    } else if (brand.icon) {
      const icon = document.createElement("i");
      icon.className = `fa-solid ${brand.icon}`;
      emblem.append(icon);
    }
  });
}
