type EscapeHTML = (value: unknown) => string;

export function renderFallbackMonitor(data: any, escapeHTML: EscapeHTML) {
  const items = data.cameras.map((camera: any) => `
    <button type="button" class="security-camera-list-item ${camera.isSelected ? "active" : ""}" data-security-camera-id="${escapeHTML(camera.id)}">
      <span>${escapeHTML(camera.name)}</span>
      <small>${escapeHTML(camera.location)}</small>
      <i>${escapeHTML(camera.status)}</i>
    </button>
  `).join("");

  const camera = data.selectedCamera;
  const preview = camera ? `
    <section class="security-camera-monitor-preview ${escapeHTML(camera.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${escapeHTML(camera.name)}</h3>
        </div>
        <strong>${escapeHTML(camera.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-preview-frame">
        ${camera.canDisplayImage ? `<img src="${escapeHTML(camera.image)}" alt="${escapeHTML(camera.name)}">` : `<div class="security-camera-placeholder">${escapeHTML(camera.isLive ? "LIVE CANVAS FEED" : camera.signalLabel)}</div>`}
      </div>
      <dl>
        <dt>Location</dt><dd>${escapeHTML(camera.location)}</dd>
        <dt>Scene</dt><dd>${escapeHTML(camera.sceneName)}</dd>
        <dt>Source</dt><dd>${escapeHTML(camera.feedSource)}</dd>
        <dt>Region</dt><dd>${camera.hasRegion ? `${Math.round(camera.regionX)}, ${Math.round(camera.regionY)} / ${Math.round(camera.regionWidth)}x${Math.round(camera.regionHeight)}` : "No region"}</dd>
        <dt>Mode</dt><dd>${escapeHTML(camera.displayMode)}</dd>
        <dt>Notes</dt><dd>${escapeHTML(camera.notes || "No notes recorded.")}</dd>
      </dl>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>';

  const editor = data.editorCamera;
  const sceneOptions = data.sceneChoices.map((scene: any) => `<option value="${escapeHTML(scene.id)}" ${scene.selected ? "selected" : ""}>${escapeHTML(scene.name)}</option>`).join("");
  const regionOptions = data.regionChoices.map((region: any) => `<option value="${escapeHTML(region.id)}" ${region.selected ? "selected" : ""}>${escapeHTML(region.name)}</option>`).join("");
  const sourceOptions = data.feedSourceChoices.map((source: any) => `<option value="${escapeHTML(source.value)}" ${source.selected ? "selected" : ""}>${escapeHTML(source.label)}</option>`).join("");
  const statusOptions = data.statusChoices.map((status: any) => `<option value="${escapeHTML(status.value)}" ${status.selected ? "selected" : ""}>${escapeHTML(status.label)}</option>`).join("");
  const displayOptions = data.displayModeChoices.map((mode: any) => `<option value="${escapeHTML(mode.value)}" ${mode.selected ? "selected" : ""}>${escapeHTML(mode.label)}</option>`).join("");
  const imageField = `<label data-security-camera-static-image-field ${data.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${escapeHTML(editor.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;

  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><span class="security-camera-kicker">Network</span><h2>Cameras</h2></header>
        <div class="security-camera-list">${items || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
        <div class="security-camera-list-actions">
          <button type="button" data-security-camera-action="new">New</button>
          <button type="button" data-security-camera-action="duplicate">Duplicate</button>
          <button type="button" data-security-camera-action="delete">Delete</button>
        </div>
      </aside>
      ${preview}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${data.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${escapeHTML(editor.id)}">
        <label>ID <input type="text" name="id" value="${escapeHTML(editor.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${escapeHTML(editor.name)}" required></label>
        <label>Scene <select name="sceneId">${sceneOptions}</select></label>
        <label>Scene Region <select name="regionId">${regionOptions}</select></label>
        <label>Location <input type="text" name="location" value="${escapeHTML(editor.location)}"></label>
        <label>Feed Source <select name="feedSource">${sourceOptions}</select></label>
        ${imageField}
        <label>Status <select name="status">${statusOptions}</select></label>
        <label>Display Mode <select name="displayMode">${displayOptions}</select></label>
        <input type="hidden" name="regionX" value="${escapeHTML(editor.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${escapeHTML(editor.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${escapeHTML(editor.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${escapeHTML(editor.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${escapeHTML(editor.notes)}</textarea></label>
        <div class="security-camera-editor-actions">
          <button type="submit">Save Camera</button>
          <button type="button" data-security-camera-action="pan-region">Pan to Region</button>
          <button type="button" data-security-camera-action="show">Show to Players</button>
          <button type="button" data-security-camera-action="close-feed">Close Feeds</button>
        </div>
      </form>
    </section>
  `;
}

export function renderFallbackFeed(camera: any, escapeHTML: EscapeHTML) {
  const canShowLiveFrame = camera.isLive && !camera.isOffline && !camera.isRestricted;
  const frameMarkup = canShowLiveFrame
    ? `<img src="${escapeHTML(camera.liveFrame || camera.image || "")}" alt="${escapeHTML(camera.name)}" data-security-camera-live-frame ${camera.liveFrame || camera.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${camera.liveFrame || camera.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>`
    : camera.canDisplayImage
      ? `<img src="${escapeHTML(camera.image)}" alt="${escapeHTML(camera.name)}">`
      : `<div class="security-camera-feed-warning">${escapeHTML(camera.signalLabel)}</div>`;

  return `
    <section class="security-camera-feed ${escapeHTML(camera.statusClass)} ${escapeHTML(camera.sourceClass)} ${escapeHTML(camera.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <header class="security-camera-feed-header">
        <div>
          <span class="security-camera-rec"><i></i> REC</span>
          <h2>${escapeHTML(camera.name)}</h2>
          <p>${escapeHTML(camera.location)}</p>
        </div>
        <div class="security-camera-signal">
          <strong>${escapeHTML(camera.signalLabel)}</strong>
          <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </header>
      <main class="security-camera-feed-frame" style="--security-camera-region-aspect: ${escapeHTML(camera.regionAspect ?? "16 / 9")};">
        ${frameMarkup}
      </main>
      <footer class="security-camera-feed-footer">
        <span>ID ${escapeHTML(camera.id)}</span>
      </footer>
    </section>
  `;
}
