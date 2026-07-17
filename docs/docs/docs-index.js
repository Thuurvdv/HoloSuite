(async () => {
  const docs = await loadDocs();
  if (!docs) return;

  const input = document.querySelector("[data-doc-search]");
  renderNav(docs.modules);
  renderResults(docs.modules, "");

  input?.addEventListener("input", () => {
    renderResults(docs.modules, input.value);
  });
})();

async function loadDocs() {
  try {
    const response = await fetch("docs-data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Unable to load docs-data.json: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function renderNav(modules) {
  const nav = document.querySelector("[data-doc-nav]");
  if (!nav) return;
  nav.innerHTML = `<div class="doc-nav-list">${modules.map((module) => `
    <a href="module.html?id=${encodeURIComponent(module.id)}">${escapeHtml(module.name)}</a>
  `).join("")}</div>`;
}

function renderResults(modules, query) {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? modules.filter((module) => searchableText(module).includes(normalized))
    : modules;

  const count = document.querySelector("[data-doc-count]");
  const grid = document.querySelector("[data-doc-results]");
  if (count) count.textContent = `${results.length} module${results.length === 1 ? "" : "s"} found`;
  if (!grid) return;

  grid.innerHTML = results.map((module) => `
    <a class="docs-card" href="module.html?id=${encodeURIComponent(module.id)}">
      <img src="../${escapeAttribute(module.image)}" alt="${escapeAttribute(module.name)} preview" loading="lazy">
      <div class="docs-card-body">
        <div class="module-meta">
          <span class="pill ${module.tier === "premium" ? "premium" : ""}">${escapeHtml(module.tier)}</span>
          <span class="pill">${escapeHtml(module.category)}</span>
          <span class="pill">${escapeHtml(module.compatibility)}</span>
        </div>
        <h2>${escapeHtml(module.name)}</h2>
        <p>${escapeHtml(module.summary)}</p>
      </div>
    </a>
  `).join("");
}

function searchableText(module) {
  return [
    module.name,
    module.category,
    module.summary,
    ...(module.features || []),
    ...(module.installation || []),
    ...(module.configuration || []),
    ...(module.examples || [])
  ].join(" ").toLowerCase();
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
