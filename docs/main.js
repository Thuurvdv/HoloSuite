(async () => {
  const data = await loadSiteData();
  if (!data) return;

  renderExperiences(data.experiences || [], data.modules || []);
  renderModules(data.modules || []);
  renderStats(data.stats || []);
  renderCommunity(data.community || []);
  bindFilters(data.modules || []);
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

function renderExperiences(experiences, modules) {
  const grid = document.querySelector("[data-experience-grid]");
  if (!grid) return;

  const moduleMap = new Map(modules.map((module) => [module.id, module]));
  grid.innerHTML = experiences.map((experience) => {
    const module = moduleMap.get(experience.moduleId);
    const href = module ? `#module-${module.id}` : "#modules";
    return `
      <a class="experience-card" href="${escapeAttribute(href)}">
        <span class="experience-icon">${escapeHtml(experience.icon)}</span>
        <strong>${escapeHtml(experience.title)}</strong>
        <span>${escapeHtml(experience.description)}</span>
      </a>
    `;
  }).join("");
}

function renderModules(modules) {
  const grid = document.querySelector("[data-module-grid]");
  if (!grid) return;
  grid.innerHTML = moduleCards(modules);
}

function moduleCards(modules) {
  return modules.map((module) => {
    const isPremium = module.tier === "premium";
    const features = (module.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
    const patreonButton = module.patreonUrl
      ? `<a href="${escapeAttribute(module.patreonUrl)}" rel="noopener">Patreon</a>`
      : "";

    return `
      <article class="module-card" id="module-${escapeAttribute(module.id)}" data-tier="${escapeAttribute(module.tier)}">
        <img src="${escapeAttribute(module.image)}" alt="${escapeAttribute(module.name)} preview" loading="lazy">
        <div class="module-body">
          <div class="module-meta">
            <span class="pill ${isPremium ? "premium" : ""}">${escapeHtml(module.tier)}</span>
            <span class="pill">${escapeHtml(module.category)}</span>
            <span class="pill">${escapeHtml(module.compatibility)}</span>
          </div>
          <h3>${escapeHtml(module.name)}</h3>
          <p>${escapeHtml(module.pitch)}</p>
          <ul>${features}</ul>
          <div class="module-actions">
            <a class="primary-link" href="${escapeAttribute(module.docsUrl)}" rel="noopener">Documentation</a>
            <a href="${escapeAttribute(module.moduleUrl)}" rel="noopener">${isPremium ? "Details" : "GitHub"}</a>
            ${patreonButton}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderStats(stats) {
  const grid = document.querySelector("[data-stats-grid]");
  if (!grid) return;

  grid.innerHTML = stats.map((stat) => `
    <article class="stat-card">
      <strong
        data-counter
        data-value="${escapeAttribute(String(stat.value))}"
        data-prefix="${escapeAttribute(stat.prefix || "")}"
        data-suffix="${escapeAttribute(stat.suffix || "")}"
        data-format="${escapeAttribute(stat.format || "number")}"
      >${escapeHtml(`${stat.prefix || ""}0${stat.suffix || ""}`)}</strong>
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

function bindFilters(modules) {
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const grid = document.querySelector("[data-module-grid]");
  if (!buttons.length || !grid) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      const filtered = filter === "all" ? modules : modules.filter((module) => module.tier === filter);
      grid.innerHTML = moduleCards(filtered);
    });
  });
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
