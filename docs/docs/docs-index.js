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
    const [docsResponse, tutorialsResponse] = await Promise.all([
      fetch("docs-data.json", { cache: "no-cache" }),
      fetch("tutorials-data.json", { cache: "no-cache" })
    ]);
    if (!docsResponse.ok) throw new Error(`Unable to load docs-data.json: ${docsResponse.status}`);
    if (!tutorialsResponse.ok) throw new Error(`Unable to load tutorials-data.json: ${tutorialsResponse.status}`);
    const docs = await docsResponse.json();
    const tutorials = await tutorialsResponse.json();
    const additions = tutorials.modules || {};
    docs.modules = docs.modules.map((module) => ({ ...module, ...(additions[module.id] || {}) }));
    return docs;
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
      ${moduleVisual(module, "../")}
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

function moduleVisual(module, pathPrefix = "") {
  if (module.visual === "terminal-interface") {
    return `
      <div class="terminal-interface-visual" role="img" aria-label="Stylized HoloSuite Terminal interface">
        <div class="terminal-interface-bar">
          <span>HoloSuite Terminal</span>
          <span class="terminal-interface-status">Online</span>
        </div>
        <div class="terminal-interface-apps" aria-hidden="true">
          <span><b>MAIL</b><small>03 unread</small></span>
          <span><b>FILES</b><small>secure vault</small></span>
          <span><b>CAM</b><small>feeds linked</small></span>
          <span><b>UTIL</b><small>systems ready</small></span>
        </div>
        <div class="terminal-interface-footer">AUTH LEVEL: USER // SECURE SESSION</div>
      </div>
    `;
  }

  return `<img src="${escapeAttribute(`${pathPrefix}${module.image}`)}" alt="${escapeAttribute(module.name)} preview" loading="lazy">`;
}

function searchableText(module) {
  return collectSearchText(module).join(" ").toLowerCase();
}

function collectSearchText(value) {
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(collectSearchText);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectSearchText);
  return [];
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
