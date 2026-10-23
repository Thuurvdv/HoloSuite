type EscapeHTML = (value: unknown) => string;

export function renderFallbackMonitor(data: any, escapeHTML: EscapeHTML) {
  const items = data.cameras.map((camera: any) => `
    <button type="button" class="security-camera-list-item ${escapeHTML(camera.statusClass)} ${camera.isSelected ? "active" : ""}" aria-pressed="${Boolean(camera.isSelected)}" data-security-camera-id="${escapeHTML(camera.id)}">
      <i class="fa-solid fa-video security-camera-device-icon" aria-hidden="true"></i>
      <span class="security-camera-device-name" title="${escapeHTML(camera.name)}">${escapeHTML(camera.name)}</span>
      <small title="${escapeHTML(camera.location)}">${escapeHTML(camera.location)}</small>
      <span class="security-camera-device-status">${escapeHTML(camera.status)}</span>
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
      <div class="security-camera-monitor-display">
      <div class="security-camera-preview-frame">
        ${camera.canDisplayImage ? `<img src="${escapeHTML(camera.image)}" alt="${escapeHTML(camera.name)}">` : `<div class="security-camera-placeholder">${escapeHTML(camera.signalLabel)}</div>`}
      </div>
      <div class="security-camera-monitor-readout"><span>${escapeHTML(camera.id)}</span><span>${escapeHTML(camera.feedSource)}</span></div>
      </div>
      <dl>
        <dt>Location</dt><dd>${escapeHTML(camera.location)}</dd>
        <dt>Scene</dt><dd>${escapeHTML(camera.sceneName)}</dd>
        <dt>Source</dt><dd>${escapeHTML(camera.feedSource)}</dd>
        <dt>Region</dt><dd>${escapeHTML(camera.regionName)}</dd>
        <dt>Mode</dt><dd>${escapeHTML(camera.displayMode)}</dd>
        <dt>Notes</dt><dd>${escapeHTML(camera.notes || "No notes.")}</dd>
      </dl>
      <div class="security-camera-preview-actions">
        <button type="button" data-security-camera-action="show"><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i> Show Saved Feed</button>
        <button type="button" data-security-camera-action="close-feed"><i class="fa-solid fa-stop" aria-hidden="true"></i> Close Feeds</button>
      </div>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>';

  const editor = data.editorCamera;
  const sceneOptions = data.sceneChoices.map((scene: any) => `<option value="${escapeHTML(scene.id)}" ${scene.selected ? "selected" : ""}>${escapeHTML(scene.name)}</option>`).join("");
  const regionOptions = data.regionChoices.map((region: any) => `<option value="${escapeHTML(region.id)}" ${region.selected ? "selected" : ""}>${escapeHTML(region.name)}</option>`).join("");
  const sourceOptions = data.feedSourceChoices.map((source: any) => `<option value="${escapeHTML(source.value)}" ${source.selected ? "selected" : ""}>${escapeHTML(source.label)}</option>`).join("");
  const statusOptions = data.statusChoices.map((status: any) => `<option value="${escapeHTML(status.value)}" ${status.selected ? "selected" : ""}>${escapeHTML(status.label)}</option>`).join("");
  const displayOptions = data.displayModeChoices.map((mode: any) => `<option value="${escapeHTML(mode.value)}" ${mode.selected ? "selected" : ""}>${escapeHTML(mode.label)}</option>`).join("");
  const imageField = `<label data-security-camera-static-image-field ${data.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${escapeHTML(editor.image)}"><button type="button" data-security-camera-action="browse-image"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse</button></span></label>`;

  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><h2><span class="security-camera-network-icon" aria-hidden="true"></span> Camera Network</h2><span class="security-camera-count" aria-label="Registered cameras">${data.cameras.length}</span></header>
        <div class="security-camera-list">${items || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
        <div class="security-camera-list-actions">
          <button type="button" data-security-camera-action="new"><i class="fa-solid fa-plus" aria-hidden="true"></i> New</button>
          <button type="button" data-security-camera-action="duplicate"><i class="fa-solid fa-copy" aria-hidden="true"></i> Duplicate</button>
          <button type="button" data-security-camera-action="delete"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Delete</button>
        </div>
      </aside>
      ${preview}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Configuration</span><h2>${data.isNewCamera ? "Add Camera" : "Edit Camera"}</h2></header>
        <div class="security-camera-editor-scroll">
        <fieldset class="security-camera-field-group"><legend>Camera identity</legend>
        <p class="security-camera-dirty" data-camera-dirty ${data.editorDirty ? "" : "hidden"}>Unsaved changes</p>
        <input type="hidden" name="originalId" value="${escapeHTML(data.originalEditorId)}">
        <label>ID <input type="text" name="id" value="${escapeHTML(editor.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${escapeHTML(editor.name)}" required></label>
        <label>Location <input type="text" name="location" value="${escapeHTML(editor.location)}"></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Scene connection</legend>
        <label>Scene <select name="sceneId" ${editor.isLive ? "" : "disabled"}>${sceneOptions}</select></label>
        <label>Scene Region <select name="regionId" ${editor.isLive ? "" : "disabled"}>${regionOptions}</select></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Feed settings</legend>
        <label>Feed Source <select name="feedSource">${sourceOptions}</select></label>
        ${imageField}
        <label>Status <select name="status">${statusOptions}</select></label>
        <label>Display Mode <select name="displayMode">${displayOptions}</select></label>
        <input type="hidden" name="regionX" value="${escapeHTML(editor.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${escapeHTML(editor.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${escapeHTML(editor.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${escapeHTML(editor.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="3">${escapeHTML(editor.notes)}</textarea></label>
        </fieldset>
        </div>
        <div class="security-camera-editor-actions">
          <button type="submit" class="security-camera-primary"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save Camera</button>
          <button type="button" data-security-camera-action="pan-region"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Pan to Region</button>
          <button type="button" data-security-camera-action="save-show"><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i> Save &amp; Show</button>
          <button type="button" data-security-camera-action="close-feed"><i class="fa-solid fa-stop" aria-hidden="true"></i> Close Feeds</button>
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
      <button type="button" class="security-camera-feed-drag" data-security-camera-drag aria-label="Move camera feed" title="Drag to move; use arrow keys when focused"><span aria-hidden="true"></span></button>
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
        <button type="button" class="security-camera-feed-close" data-security-camera-close aria-label="Close camera feed" title="Close camera feed"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </footer>
    </section>
  `;
}
