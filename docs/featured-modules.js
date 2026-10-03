// Presentation metadata references the existing module records in site-data.json.
const FEATURED_ASSET_PATH = "assets/featured-modules/";
const FEATURED_VARIANTS = new Set(["navigation", "industrial", "scanner", "surveillance", "contracts", "organic"]);
const MODULE_BADGES = {
  free: { label: "Free", asset: "badge-free.svg" },
  premium: { label: "Premium", asset: "badge-premium.svg" },
  updated: { label: "Updated", asset: "badge-status.svg" },
  new: { label: "New", asset: "badge-status.svg" },
  beta: { label: "Beta", asset: "badge-status.svg" }
};

function moduleBadge(type) {
  if (!Object.hasOwn(MODULE_BADGES, type)) return "";
  const badge = MODULE_BADGES[type];
  if (type === "free" || type === "premium") {
    return `<span class="module-sticker module-sticker--${type}">
      <img src="${FEATURED_ASSET_PATH}${badge.asset}" alt="${badge.label}" width="160" height="60">
    </span>`;
  }
  return `<span class="module-sticker module-sticker--${type}">
    <img src="${FEATURED_ASSET_PATH}${badge.asset}" alt="" aria-hidden="true" width="160" height="60">
    <span>${badge.label}</span>
  </span>`;
}

function featuredModulePreview(module, featured) {
  const src = featured.preview ? `${FEATURED_ASSET_PATH}${featured.preview}` : module.image;
  if (!src) return "";
  const isPlaceholder = featured.preview && !featured.previewIsFinal;
  const alt = isPlaceholder
    ? `${module.name}: temporary wireframe preview`
    : `${module.name} interface in Foundry VTT`;
  return `<div class="featured-card__preview">
    <img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" width="800" height="500" loading="lazy">
    ${isPlaceholder ? '<span class="featured-card__placeholder">Temporary preview</span>' : ""}
  </div>`;
}

function featuredModuleCard(module, featured) {
  const variant = FEATURED_VARIANTS.has(featured.variant) ? featured.variant : "industrial";
  return `<article class="featured-card featured-card--${variant} featured-card--${module.tier === "premium" ? "premium" : "free"}" id="module-${escapeAttribute(module.id)}" data-tier="${escapeAttribute(module.tier)}" data-featured-id="${escapeAttribute(module.id)}">
    <div class="featured-card__frame" aria-hidden="true"></div>
    <a class="featured-card__link" href="${escapeAttribute(module.docsUrl)}" aria-labelledby="featured-title-${escapeAttribute(module.id)}">
      <div class="featured-card__heading">
        ${featured.icon ? `<img class="featured-card__icon" src="${FEATURED_ASSET_PATH}${escapeAttribute(featured.icon)}" alt="" aria-hidden="true" width="30" height="30">` : ""}
        <div>
          <h3 id="featured-title-${escapeAttribute(module.id)}">${escapeHtml(module.name)}</h3>
        </div>
      </div>
      ${featuredModulePreview(module, featured)}
      <p class="featured-card__description">${escapeHtml(module.pitch)}</p>
      <div class="featured-card__footer">
        <span class="featured-card__cta">View module <span class="featured-card__arrow" aria-hidden="true">↗</span></span>
        <span class="featured-card__stickers">${moduleBadge(module.tier)}${moduleBadge(featured.status)}</span>
      </div>
    </a>
    <div class="featured-card__resources">
      <span>${escapeHtml(module.compatibility)}</span>
      <a href="${escapeAttribute(module.moduleUrl)}" rel="noopener">${module.tier === "premium" ? "Get on Patreon" : "GitHub"} <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function renderFeaturedModules(featured, modules) {
  const grid = document.querySelector("[data-featured-grid]");
  if (!grid) return;
  const presentation = new Map(featured.map(item => [item.id, item]));
  grid.innerHTML = modules.map(module => featuredModuleCard(module, presentation.get(module.id) || {})).join("");
}
