(async () => {
  const docs = await loadDocs();
  if (!docs) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || docs.modules[0]?.id;
  const module = docs.modules.find((item) => item.id === id);
  if (!module) {
    renderMissing();
    return;
  }

  renderModule(module);
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

function renderModule(module) {
  document.title = `${module.name} Documentation | HoloSuite`;
  document.querySelector("[data-doc-description]")?.setAttribute("content", module.summary);
  setText("[data-module-tier]", `${module.tier} module`);
  setText("[data-module-title]", module.name);
  setText("[data-module-summary]", module.summary);

  const image = document.querySelector("[data-module-image]");
  if (image) {
    image.src = `../${module.image}`;
    image.alt = `${module.name} preview`;
  }

  const actions = document.querySelector("[data-module-actions]");
  if (actions) {
    const patreon = module.patreonUrl
      ? `<a class="button secondary" href="${escapeAttribute(module.patreonUrl)}" rel="noopener">Patreon</a>`
      : "";
    actions.innerHTML = `
      <a class="button primary" href="${escapeAttribute(module.moduleUrl)}" rel="noopener">${module.tier === "premium" ? "Module Details" : "Open Module"}</a>
      <a class="button secondary" href="./">All Docs</a>
      ${patreon}
    `;
  }

  const content = document.querySelector("[data-module-content]");
  if (!content) return;
  content.innerHTML = `
    ${section("overview", "Overview", paragraphs([module.overview]))}
    ${section("features", "Features", list(module.features))}
    ${section("installation", "Installation", orderedList(module.installation))}
    ${section("configuration", "Configuration", list(module.configuration))}
    ${faqSection(module.faq)}
    ${section("videos", "Videos", videos(module.videos))}
    ${section("examples", "Examples", list(module.examples))}
  `;
}

function renderMissing() {
  setText("[data-module-title]", "Documentation not found");
  setText("[data-module-summary]", "The requested HoloSuite documentation page could not be found.");
}

function section(id, title, body) {
  return `
    <section class="doc-section" id="${escapeAttribute(id)}">
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function paragraphs(items) {
  return items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function orderedList(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function faqSection(items) {
  return section("faq", "FAQ", `
    <div class="faq-list">
      ${items.map((item) => `
        <details>
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>
      `).join("")}
    </div>
  `);
}

function videos(items) {
  if (!items?.length) {
    return `<div class="video-placeholder">Demo videos are planned for this module. Current documentation uses screenshots and workflow examples until short loops are available.</div>`;
  }
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
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
