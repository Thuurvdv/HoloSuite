(async () => {
  const data = await loadSiteData();
  if (!data) return;

  renderFeaturedModules(data.featuredModules || [], data.modules || []);
  renderStats(data.stats || []);
  renderCommunity(data.community || []);
  bindFilters(data.modules || [], data.featuredModules || []);
  // Fragment scrolling must wait until the async catalogue and fonts set its height.
  await document.fonts.ready;
  bindModuleCatalog();
  startCounterObserver();
})();

async function loadSiteData() {
  try {
    const response = await fetch("site-data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Failed to load site-data.json: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}


function renderStats(stats) {
  const grid = document.querySelector("[data-stats-grid]");
  if (!grid) return;

  grid.innerHTML = stats.map((stat) => `
    <article class="platform-stat">
      <strong
        data-counter
        data-value="${escapeAttribute(String(stat.value))}"
        data-prefix="${escapeAttribute(stat.prefix || "")}"
        data-suffix="${escapeAttribute(stat.suffix || "")}"
        data-format="${escapeAttribute(stat.format || "number")}"
      >${escapeHtml(`${stat.prefix || ""}0${stat.suffix || ""}`)}</strong>
      <img class="platform-stat__art" src="assets/featured-modules/value-platform.svg" alt="" aria-hidden="true" width="150" height="50">
      <span>${escapeHtml(stat.label)}</span>
    </article>
  `).join("");
}

function renderCommunity(items) {
  const grid = document.querySelector("[data-community-grid]");
  if (!grid) return;

  grid.innerHTML = items.map((item) => {
    const body = `
      <span class="community-icon">${escapeHtml(item.icon)}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.description)}</p>
    `;
    return item.url
      ? `<a class="community-card" href="${escapeAttribute(item.url)}" rel="noopener">${body}</a>`
      : `<article class="community-card muted-card">${body}</article>`;
  }).join("");
}

function bindFilters(modules, presentation) {
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const grid = document.querySelector("[data-featured-grid]");
  if (!buttons.length || !grid) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      const filtered = filter === "all" ? modules : modules.filter((module) => module.tier === filter);
      renderFeaturedModules(presentation, filtered);
      updateHomeNavigation(filter === "premium" ? "#premium" : "#modules");
    });
  });
}

function updateHomeNavigation(hash = window.location.hash) {
  const selected = hash === "#premium" ? "#premium" : hash === "#community" ? "#community" : hash.startsWith("#module") ? "#modules" : "#top";
  document.querySelectorAll('.site-header nav a[href^="#"]').forEach(link => {
    if (link.getAttribute("href") === selected) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function bindModuleCatalog() {
  const catalog = document.querySelector("#modules");
  if (!catalog) return;
  const revealModule = () => {
    updateHomeNavigation();
    // Keep existing Premium navigation links useful after removing the promo band.
    if (window.location.hash === "#premium") {
      catalog.querySelector('[data-filter="premium"]')?.click();
      catalog.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    if (["#community", "#modules", "#top"].includes(window.location.hash)) {
      document.querySelector(window.location.hash)?.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    if (!window.location.hash.startsWith("#module-")) return;
    // Restore All before revealing a card hidden by a previous filter.
    catalog.querySelector('[data-filter="all"]')?.click();
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target || !catalog.contains(target)) return;
    target.scrollIntoView({ block: "start", behavior: "instant" });
  };
  window.addEventListener("hashchange", revealModule);
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      if (window.location.hash === link.getAttribute("href")) revealModule();
    });
  });
  revealModule();
}

function startCounterObserver() {
  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  if (!counters.length) return;

  const animate = (counter) => {
    const target = Number(counter.dataset.value || 0);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const format = counter.dataset.format || "number";
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      const formatted = format === "plain" ? String(value) : value.toLocaleString();
      counter.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  counters.forEach((counter) => observer.observe(counter));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
