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

  const visual = document.querySelector("[data-module-visual]");
  if (visual) {
    visual.innerHTML = moduleVisual(module, "../");
  }

  const actions = document.querySelector("[data-module-actions]");
  if (actions) {
    const patreon = module.patreonUrl
      ? `<a class="button secondary" href="${escapeAttribute(module.patreonUrl)}" rel="noopener">Patreon</a>`
      : "";
    actions.innerHTML = `
      <a class="button primary" href="${escapeAttribute(module.moduleUrl)}" rel="noopener">${escapeHtml(module.moduleActionLabel || (module.tier === "premium" ? "Module Details" : "Open Module"))}</a>
      <a class="button secondary" href="./">All Docs</a>
      ${patreon}
    `;
  }

  const content = document.querySelector("[data-module-content]");
  if (!content) return;
  if (module.tutorial) {
    renderTutorial(module, content);
    return;
  }

  const defaultSections = [
    { id: "overview", title: "Overview", body: paragraphs([module.overview]) },
    { id: "videos", title: "Video", body: videos(module.videos, module.name) },
    { id: "features", title: "Features", body: list(module.features) },
    { id: "installation", title: "Installation", body: orderedList(module.installation) },
    { id: "configuration", title: "Configuration", body: list(module.configuration) },
    { id: "faq", title: "FAQ", body: faqList(module.faq) },
    { id: "examples", title: "Examples", body: list(module.examples) }
  ];
  renderSections(content, defaultSections);
}

function renderTutorial(module, content) {
  const tutorial = module.tutorial;
  const tutorialSections = (tutorial.sections || []).map((item) => ({
    id: item.id,
    title: item.title,
    body: tutorialSectionBody(item)
  }));
  const pageSections = [
    {
      id: "overview",
      title: "Overview",
      body: paragraphs([module.overview, tutorial.intro].filter(Boolean))
        + callout("Who can configure HoloDock?", tutorial.audience, "info")
    },
    {
      id: "quick-start",
      title: tutorial.quickStart?.title || "Quick start",
      body: paragraphs(tutorial.quickStart?.paragraphs || [])
        + orderedList(tutorial.quickStart?.steps || [])
        + renderCallouts(tutorial.quickStart?.callouts)
    },
    ...tutorialSections,
    {
      id: "configuration-reference",
      title: tutorial.reference?.title || "Configuration reference",
      body: paragraphs(tutorial.reference?.paragraphs || [])
        + renderTables(tutorial.reference?.tables)
        + renderCallouts(tutorial.reference?.callouts)
    },
    { id: "videos", title: "Video", body: videos(module.videos, module.name) },
    { id: "faq", title: "Troubleshooting and FAQ", body: faqList(module.faq) },
    { id: "examples", title: "Campaign ideas", body: list(module.examples) }
  ].filter((item) => item.body);

  renderSections(content, pageSections);
}

function renderSections(content, items) {
  content.innerHTML = items.map((item) => section(item.id, item.title, item.body)).join("");
  const toc = document.querySelector("[data-module-toc]");
  if (toc) {
    toc.innerHTML = items
      .map((item) => `<a href="#${escapeAttribute(item.id)}">${escapeHtml(item.title)}</a>`)
      .join("");
  }
}

function tutorialSectionBody(item) {
  return paragraphs(item.paragraphs || [])
    + (item.steps?.length ? orderedList(item.steps) : "")
    + (item.bullets?.length ? list(item.bullets) : "")
    + (item.subsections || []).map(tutorialSubsection).join("")
    + renderTables(item.tables)
    + renderCallouts(item.callouts);
}

function tutorialSubsection(item) {
  return `
    <section class="doc-subsection">
      <h3>${escapeHtml(item.title)}</h3>
      ${paragraphs(item.paragraphs || [])}
      ${item.steps?.length ? orderedList(item.steps) : ""}
      ${item.bullets?.length ? list(item.bullets) : ""}
      ${renderTables(item.tables)}
      ${renderCallouts(item.callouts)}
    </section>
  `;
}

function renderCallouts(items) {
  if (!items?.length) return "";
  return items.map((item) => callout(item.title, item.text, item.tone)).join("");
}

function callout(title, text, tone = "info") {
  if (!text) return "";
  return `
    <aside class="doc-callout doc-callout--${escapeAttribute(tone)}">
      ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
      <p>${escapeHtml(text)}</p>
    </aside>
  `;
}

function renderTables(items) {
  if (!items?.length) return "";
  return items.map((table) => `
    <div class="doc-table-wrap">
      ${table.title ? `<h3>${escapeHtml(table.title)}</h3>` : ""}
      ${table.description ? `<p>${escapeHtml(table.description)}</p>` : ""}
      <table>
        <thead><tr>${table.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
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
  if (!items?.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function orderedList(items) {
  if (!items?.length) return "";
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function faqSection(items) {
  return section("faq", "FAQ", faqList(items));
}

function faqList(items) {
  if (!items?.length) return "";
  return `
    <div class="faq-list">
      ${items.map((item) => `
        <details>
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>
      `).join("")}
    </div>
  `;
}

function videos(items, moduleName) {
  if (!items?.length) {
    return `<div class="video-placeholder">Demo videos are planned for this module. Current documentation uses screenshots and workflow examples until short loops are available.</div>`;
  }
  return `<div class="doc-video-list">${items.map((item) => {
    const video = typeof item === "string" ? { src: item } : item;
    const title = video.title || `${moduleName} demonstration`;
    const src = /^https?:\/\//i.test(video.src) ? video.src : `../${video.src}`;
    return `
      <figure class="doc-video">
        <video controls playsinline preload="metadata" aria-label="${escapeAttribute(title)}">
          <source src="${escapeAttribute(src)}" type="video/mp4">
          Your browser does not support embedded video.
        </video>
        <figcaption>${escapeHtml(title)}</figcaption>
      </figure>
    `;
  }).join("")}</div>`;
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
