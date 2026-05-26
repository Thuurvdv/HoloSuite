// @ts-nocheck
const MODULE_ID = "security-cameras";
const SOCKET_NAME = `module.${MODULE_ID}`;
const MONITOR_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/monitor.hbs`;
const FEED_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/feed.hbs`;

const CAMERA_STATUSES = new Set(["online", "offline", "corrupted", "restricted"]);
const FEED_SOURCES = new Set(["live", "image"]);
const DISPLAY_MODES = new Set(["window", "picture-in-picture"]);
const LIVE_FRAME_INTERVAL_MS = 1250;
const LIVE_FRAME_MAX_WIDTH = 960;
const DEFAULT_CAMERA_REGION_WIDTH = 1200;
const DEFAULT_CAMERA_REGION_HEIGHT = 675;

const STATUS_CHOICES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
];

const DISPLAY_MODE_CHOICES = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
];

const FEED_SOURCE_CHOICES = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
];

const DEFAULT_CAMERA = {
  id: "",
  name: "Unnamed Camera",
  sceneId: "",
  location: "Unknown Location",
  image: "",
  feedSource: "image",
  status: "online",
  displayMode: "window",
  regionId: "",
  regionX: null,
  regionY: null,
  regionWidth: DEFAULT_CAMERA_REGION_WIDTH,
  regionHeight: DEFAULT_CAMERA_REGION_HEIGHT,
  notes: ""
};

let activeMonitor = null;
let activeFeed = null;
let selectedCameraId = "";
let editingCameraId = "";
const imageCache = new Map();

function createCameraId() {
  if (foundry?.utils?.randomID) return foundry.utils.randomID();
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDeepClone(value) {
  if (foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  return JSON.parse(JSON.stringify(value));
}

function escapeHTML(value) {
  if (foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value));
  const element = document.createElement("div");
  element.innerText = String(value);
  return element.innerHTML;
}

function normalizeChoice(value, allowed, fallback) {
  const normalized = String(value ?? "").trim();
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizePositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function normalizeCamera(cameraData = {}, options = {}) {
  const preserveId = options.preserveId === true;
  const rawId = String(cameraData.id ?? "").trim();
  const id = preserveId ? rawId : rawId || createCameraId();
  const feedSource = normalizeChoice(cameraData.feedSource, FEED_SOURCES, DEFAULT_CAMERA.feedSource);
  const status = normalizeChoice(cameraData.status, CAMERA_STATUSES, DEFAULT_CAMERA.status);
  const displayMode = normalizeChoice(cameraData.displayMode, DISPLAY_MODES, DEFAULT_CAMERA.displayMode);

  return {
    ...DEFAULT_CAMERA,
    id,
    name: String(cameraData.name ?? DEFAULT_CAMERA.name).trim() || DEFAULT_CAMERA.name,
    sceneId: String(cameraData.sceneId ?? "").trim(),
    location: String(cameraData.location ?? DEFAULT_CAMERA.location).trim() || DEFAULT_CAMERA.location,
    image: String(cameraData.image ?? "").trim(),
    feedSource,
    status,
    displayMode,
    regionId: String(cameraData.regionId ?? "").trim(),
    regionX: normalizeNullableNumber(cameraData.regionX),
    regionY: normalizeNullableNumber(cameraData.regionY),
    regionWidth: normalizePositiveNumber(cameraData.regionWidth, DEFAULT_CAMERA_REGION_WIDTH),
    regionHeight: normalizePositiveNumber(cameraData.regionHeight, DEFAULT_CAMERA_REGION_HEIGHT),
    notes: String(cameraData.notes ?? "").trim()
  };
}

function validateCameraData(cameraData = {}, options = {}) {
  const camera = normalizeCamera(cameraData, { preserveId: options.requireId === true });
  const errors = [];
  const rawFeedSource = String(cameraData.feedSource ?? DEFAULT_CAMERA.feedSource).trim();
  const rawStatus = String(cameraData.status ?? DEFAULT_CAMERA.status).trim();
  const rawDisplayMode = String(cameraData.displayMode ?? DEFAULT_CAMERA.displayMode).trim();

  if (options.requireId && !camera.id) errors.push("Camera id is required.");
  if (typeof cameraData.name === "string" && !cameraData.name.trim()) errors.push("Camera name is required.");
  if (!FEED_SOURCES.has(rawFeedSource)) errors.push(`Invalid feed source: ${rawFeedSource}`);
  if (!CAMERA_STATUSES.has(rawStatus)) errors.push(`Invalid status: ${rawStatus}`);
  if (!DISPLAY_MODES.has(rawDisplayMode)) errors.push(`Invalid display mode: ${rawDisplayMode}`);

  return {
    ok: errors.length === 0,
    camera: normalizeCamera(camera),
    errors
  };
}

function getSceneName(sceneId) {
  if (!sceneId) return "Unassigned Scene";
  return game.scenes?.get(sceneId)?.name ?? "Unknown Scene";
}

function getSceneBackgroundPath(sceneId = "") {
  const scene = getSceneById(sceneId);
  return String(scene?.background?.src ?? scene?.img ?? scene?.thumb ?? "").trim();
}

function getSceneChoices(selectedSceneId = "") {
  const scenes = (game.scenes?.contents ?? [])
    .map((scene) => ({
      id: scene.id,
      name: scene.name,
      selected: scene.id === selectedSceneId
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [
    { id: "", name: "Unassigned Scene", selected: !selectedSceneId },
    ...scenes
  ];
}

function getSceneById(sceneId = "") {
  if (!sceneId) return canvas?.scene ?? null;
  return game.scenes?.get(sceneId) ?? null;
}

function getSceneRegions(sceneId = "") {
  const scene = getSceneById(sceneId);
  const regions = scene?.regions?.contents ?? [];
  return regions
    .map((region) => ({
      id: region.id,
      name: region.name || `Region ${region.id}`,
      region
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getRegionChoices(sceneId = "", selectedRegionId = "") {
  return [
    { id: "", name: "No Linked Region", selected: !selectedRegionId },
    ...getSceneRegions(sceneId).map((entry) => ({
      id: entry.id,
      name: entry.name,
      selected: entry.id === selectedRegionId
    }))
  ];
}

function getRegionDocument(regionId = "", sceneId = "") {
  if (!regionId) return null;
  const scene = getSceneById(sceneId);
  return scene?.regions?.get?.(regionId) ?? null;
}

function getSelectedRegionDocument() {
  return canvas?.regions?.controlled?.[0]?.document ?? null;
}

function getShapeBounds(shape = {}) {
  const points = Array.isArray(shape.points) ? shape.points : [];
  if (points.length >= 4) {
    const xs = [];
    const ys = [];
    for (let index = 0; index < points.length; index += 2) {
      xs.push(Number(points[index]));
      ys.push(Number(points[index + 1]));
    }

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    if ([minX, minY, maxX, maxY].every(Number.isFinite)) {
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
  }

  const x = normalizeNullableNumber(shape.x) ?? 0;
  const y = normalizeNullableNumber(shape.y) ?? 0;
  const width = normalizePositiveNumber(shape.width ?? shape.radiusX ?? shape.radius, 0);
  const height = normalizePositiveNumber(shape.height ?? shape.radiusY ?? shape.radius, 0);
  if (!width || !height) return null;

  return { x, y, width, height };
}

function combineBounds(bounds) {
  const valid = bounds.filter(Boolean);
  if (!valid.length) return null;
  const minX = Math.min(...valid.map((bound) => bound.x));
  const minY = Math.min(...valid.map((bound) => bound.y));
  const maxX = Math.max(...valid.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...valid.map((bound) => bound.y + bound.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function getRegionBounds(region) {
  const regionObject = region?.object ?? canvas?.regions?.placeables?.find?.((placeable) => placeable.document?.id === region?.id);
  const objectBounds = regionObject?.bounds;
  if (objectBounds?.width && objectBounds?.height) {
    return {
      regionX: normalizeNullableNumber(objectBounds.x) ?? 0,
      regionY: normalizeNullableNumber(objectBounds.y) ?? 0,
      regionWidth: normalizePositiveNumber(objectBounds.width, DEFAULT_CAMERA_REGION_WIDTH),
      regionHeight: normalizePositiveNumber(objectBounds.height, DEFAULT_CAMERA_REGION_HEIGHT)
    };
  }

  const directBounds = region?.bounds;
  if (directBounds?.width && directBounds?.height) {
    return {
      regionX: normalizeNullableNumber(directBounds.x) ?? 0,
      regionY: normalizeNullableNumber(directBounds.y) ?? 0,
      regionWidth: normalizePositiveNumber(directBounds.width, DEFAULT_CAMERA_REGION_WIDTH),
      regionHeight: normalizePositiveNumber(directBounds.height, DEFAULT_CAMERA_REGION_HEIGHT)
    };
  }

  const source = region?.toObject?.() ?? region;
  const shapes = Array.isArray(region?.shapes) ? region.shapes : Array.isArray(source?.shapes) ? source.shapes : [];
  const shapeBounds = combineBounds(shapes.map(getShapeBounds));
  if (!shapeBounds) return null;

  const width = normalizePositiveNumber(shapeBounds.width, DEFAULT_CAMERA_REGION_WIDTH);
  const height = normalizePositiveNumber(shapeBounds.height, DEFAULT_CAMERA_REGION_HEIGHT);
  return {
    regionX: normalizeNullableNumber(shapeBounds.x) ?? 0,
    regionY: normalizeNullableNumber(shapeBounds.y) ?? 0,
    regionWidth: width,
    regionHeight: height
  };
}

function applyLinkedRegionBounds(camera) {
  const region = getRegionDocument(camera.regionId, camera.sceneId);
  const bounds = getRegionBounds(region);
  if (!bounds) return camera;
  return {
    ...camera,
    ...bounds
  };
}

function createEmptyCameraDraft() {
  const activeScene = canvas?.scene;
  return normalizeCamera({
    id: "",
    name: "",
    sceneId: activeScene?.id ?? "",
    location: "",
    image: "",
    feedSource: "live",
    status: "online",
    displayMode: "window",
    notes: ""
  }, { preserveId: true });
}

function prepareChoices(choices, selectedValue) {
  return choices.map((choice) => ({
    ...choice,
    selected: choice.value === selectedValue
  }));
}

function prepareCamera(cameraData = {}) {
  const camera = normalizeCamera(cameraData);
  const timestamp = new Date().toLocaleString();
  const isOnline = camera.status === "online";
  const isOffline = camera.status === "offline";
  const isCorrupted = camera.status === "corrupted";
  const isRestricted = camera.status === "restricted";
  const isLive = camera.feedSource === "live";

  return {
    ...camera,
    sceneName: getSceneName(camera.sceneId),
    sceneBackground: getSceneBackgroundPath(camera.sceneId),
    regionAspect: camera.regionWidth && camera.regionHeight ? `${camera.regionWidth} / ${camera.regionHeight}` : "16 / 9",
    timestamp,
    signalLabel: isOnline ? "SIGNAL LOCK" : isCorrupted ? "SIGNAL CORRUPTED" : isRestricted ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline,
    isOffline,
    isCorrupted,
    isRestricted,
    isLive,
    isImage: !isLive,
    hasRegion: Number.isFinite(camera.regionX) && Number.isFinite(camera.regionY),
    canDisplayImage: Boolean(camera.image && !isLive && !isOffline && !isRestricted),
    canUseImageFallback: Boolean(camera.image && isLive && !isOffline && !isRestricted),
    statusClass: `security-camera-status-${camera.status}`,
    sourceClass: `security-camera-source-${camera.feedSource}`,
    displayClass: `security-camera-display-${camera.displayMode}`
  };
}

function getCameraStore() {
  const cameras = game.settings.get(MODULE_ID, "cameras");
  if (!cameras || typeof cameras !== "object" || Array.isArray(cameras)) return {};
  return cameras;
}

function getCameras() {
  return Object.values(getCameraStore())
    .map(normalizeCamera)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getCamera(cameraId) {
  const id = String(cameraId ?? "");
  if (!id) return null;
  const camera = getCameraStore()[id];
  return camera ? normalizeCamera(camera) : null;
}

async function saveCameraStore(cameras) {
  await game.settings.set(MODULE_ID, "cameras", cameras);
  await refreshMonitor();
}

function requireGM(action = "manage security cameras") {
  if (game.user?.isGM) return true;
  ui.notifications?.warn?.(`Only the GM can ${action}.`);
  return false;
}

function emitSocketMessage(message) {
  if (!game.socket?.emit) {
    console.warn(`${MODULE_ID} | Foundry socket is unavailable.`, message);
    return false;
  }
  game.socket.emit(SOCKET_NAME, message);
  return true;
}

async function registerCamera(cameraData = {}) {
  if (!requireGM("register security cameras")) return null;

  const validation = validateCameraData(cameraData);
  if (!validation.ok) {
    ui.notifications?.error?.(validation.errors.join(" "));
    return null;
  }

  const camera = applyLinkedRegionBounds(validation.camera);
  const cameras = getDeepClone(getCameraStore());
  cameras[camera.id] = camera;
  selectedCameraId = camera.id;
  editingCameraId = camera.id;
  await saveCameraStore(cameras);
  return camera;
}

async function deleteCamera(cameraId) {
  if (!requireGM("delete security cameras")) return false;
  const id = String(cameraId ?? selectedCameraId ?? "");
  if (!id || !getCamera(id)) {
    ui.notifications?.warn?.("Select a camera to delete.");
    return false;
  }

  const camera = getCamera(id);
  const confirmed = typeof Dialog !== "undefined"
    ? await Dialog.confirm({
      title: "Delete Security Camera",
      content: `<p>Delete camera <strong>${escapeHTML(camera.name)}</strong>?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    })
    : window.confirm(`Delete camera "${camera.name}"?`);
  if (!confirmed) return false;

  const cameras = getDeepClone(getCameraStore());
  delete cameras[id];
  const remaining = Object.keys(cameras);
  selectedCameraId = remaining[0] ?? "";
  editingCameraId = selectedCameraId;
  await saveCameraStore(cameras);
  return true;
}

async function duplicateCamera(cameraId) {
  if (!requireGM("duplicate security cameras")) return null;
  const source = getCamera(cameraId || selectedCameraId);
  if (!source) {
    ui.notifications?.warn?.("Select a camera to duplicate.");
    return null;
  }

  const duplicate = normalizeCamera({
    ...source,
    id: createCameraId(),
    name: `${source.name} Copy`
  });
  const cameras = getDeepClone(getCameraStore());
  cameras[duplicate.id] = duplicate;
  selectedCameraId = duplicate.id;
  editingCameraId = duplicate.id;
  await saveCameraStore(cameras);
  return duplicate;
}

async function createNewCamera() {
  if (!requireGM("create security cameras")) return null;
  const camera = normalizeCamera({
    ...createEmptyCameraDraft(),
    id: createCameraId(),
    name: "New Camera",
    location: "Unlabeled Location"
  });
  const cameras = getDeepClone(getCameraStore());
  cameras[camera.id] = applyLinkedRegionBounds(camera);
  selectedCameraId = camera.id;
  editingCameraId = camera.id;
  await saveCameraStore(cameras);
  ui.notifications?.info?.("New security camera created.");
  return camera;
}

function readCameraForm(form) {
  const formData = new FormData(form);
  const originalId = String(formData.get("originalId") ?? "").trim();
  const id = String(formData.get("id") ?? "").trim() || originalId || createCameraId();

  return {
    originalId,
    camera: normalizeCamera({
      id,
      name: formData.get("name"),
      sceneId: formData.get("sceneId"),
      location: formData.get("location"),
      image: formData.get("image"),
      feedSource: formData.get("feedSource"),
      status: formData.get("status"),
      displayMode: formData.get("displayMode"),
      regionId: formData.get("regionId"),
      regionX: formData.get("regionX"),
      regionY: formData.get("regionY"),
      regionWidth: formData.get("regionWidth"),
      regionHeight: formData.get("regionHeight"),
      notes: formData.get("notes")
    })
  };
}

async function saveCameraFromForm(form) {
  if (!requireGM("save security cameras")) return null;

  const { originalId, camera } = readCameraForm(form);
  const validation = validateCameraData(camera);
  if (!validation.ok) {
    ui.notifications?.error?.(validation.errors.join(" "));
    return null;
  }

  const savedCamera = applyLinkedRegionBounds(validation.camera);
  const cameras = getDeepClone(getCameraStore());
  if (originalId && originalId !== savedCamera.id) delete cameras[originalId];
  cameras[savedCamera.id] = savedCamera;
  selectedCameraId = savedCamera.id;
  editingCameraId = savedCamera.id;
  await saveCameraStore(cameras);
  ui.notifications?.info?.("Security camera saved.");
  return savedCamera;
}

async function useSelectedSceneRegion(form) {
  if (!requireGM("assign camera regions")) return null;
  if (!canvas?.ready || !canvas?.scene) {
    ui.notifications?.warn?.("Open the target scene before assigning a camera region.");
    return null;
  }

  const region = getSelectedRegionDocument();
  if (!region) {
    ui.notifications?.warn?.("Select one Foundry Scene Region to use as the camera region.");
    return null;
  }

  const bounds = getRegionBounds(region);
  if (!bounds) {
    ui.notifications?.warn?.("The selected Scene Region does not have readable bounds.");
    return null;
  }

  const { originalId, camera } = readCameraForm(form);
  const cameraWithRegion = normalizeCamera({
    ...camera,
    ...bounds,
    id: camera.id || originalId || createCameraId(),
    sceneId: canvas.scene.id,
    regionId: region.id
  });
  const cameras = getDeepClone(getCameraStore());
  if (originalId && originalId !== cameraWithRegion.id) delete cameras[originalId];
  cameras[cameraWithRegion.id] = cameraWithRegion;
  selectedCameraId = cameraWithRegion.id;
  editingCameraId = cameraWithRegion.id;
  await saveCameraStore(cameras);
  ui.notifications?.info?.("Security camera linked to the selected Scene Region.");
  return cameraWithRegion;
}

function panToCameraRegion(cameraId = selectedCameraId) {
  const camera = getCamera(cameraId);
  if (!Number.isFinite(camera?.regionX) || !Number.isFinite(camera?.regionY)) {
    ui.notifications?.warn?.("This camera does not have a region yet.");
    return;
  }

  if (camera.sceneId && canvas.scene?.id !== camera.sceneId) {
    ui.notifications?.warn?.("Activate the camera's scene before panning to its region.");
    return;
  }

  canvas.animatePan?.({
    x: camera.regionX + camera.regionWidth / 2,
    y: camera.regionY + camera.regionHeight / 2,
    scale: canvas.stage?.scale?.x ?? 1,
    duration: 500
  });
}

function getElement(app, html) {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app.element?.[0]) return app.element[0];
  return app.element ?? null;
}

function getMonitorContext() {
  const cameras = getCameras();
  if (!selectedCameraId && cameras.length) selectedCameraId = cameras[0].id;
  if (editingCameraId === null) editingCameraId = selectedCameraId;

  const selectedCamera = getCamera(selectedCameraId);
  const editorCamera = editingCameraId === ""
    ? createEmptyCameraDraft()
    : getCamera(editingCameraId) ?? createEmptyCameraDraft();

  const preparedEditorCamera = prepareCamera(editorCamera);

  return {
    cameras: cameras.map((camera) => ({
      ...prepareCamera(camera),
      isSelected: camera.id === selectedCameraId
    })),
    selectedCamera: selectedCamera ? prepareCamera(selectedCamera) : null,
    editorCamera: preparedEditorCamera,
    sceneChoices: getSceneChoices(editorCamera.sceneId),
    regionChoices: getRegionChoices(editorCamera.sceneId, editorCamera.regionId),
    feedSourceChoices: prepareChoices(FEED_SOURCE_CHOICES, editorCamera.feedSource),
    statusChoices: prepareChoices(STATUS_CHOICES, editorCamera.status),
    displayModeChoices: prepareChoices(DISPLAY_MODE_CHOICES, editorCamera.displayMode),
    showStaticImageField: editorCamera.feedSource === "image",
    hasCameras: cameras.length > 0,
    isNewCamera: !editorCamera.id,
  };
}

function renderFallbackMonitor(data) {
  const items = data.cameras.map((camera) => `
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
  const sceneOptions = data.sceneChoices.map((scene) => `<option value="${escapeHTML(scene.id)}" ${scene.selected ? "selected" : ""}>${escapeHTML(scene.name)}</option>`).join("");
  const regionOptions = data.regionChoices.map((region) => `<option value="${escapeHTML(region.id)}" ${region.selected ? "selected" : ""}>${escapeHTML(region.name)}</option>`).join("");
  const sourceOptions = data.feedSourceChoices.map((source) => `<option value="${escapeHTML(source.value)}" ${source.selected ? "selected" : ""}>${escapeHTML(source.label)}</option>`).join("");
  const statusOptions = data.statusChoices.map((status) => `<option value="${escapeHTML(status.value)}" ${status.selected ? "selected" : ""}>${escapeHTML(status.label)}</option>`).join("");
  const displayOptions = data.displayModeChoices.map((mode) => `<option value="${escapeHTML(mode.value)}" ${mode.selected ? "selected" : ""}>${escapeHTML(mode.label)}</option>`).join("");
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
        <header><span class="security-camera-kicker">Manager</span><h2>${data.isNewCamera ? "Create Camera" : "Edit Camera"}</h2></header>
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

function renderFallbackFeed(camera) {
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
        <span>${escapeHTML(camera.timestamp)}</span>
        <span>ID ${escapeHTML(camera.id)}</span>
      </footer>
    </section>
  `;
}

function browseForImage(form) {
  if (typeof FilePicker === "undefined") {
    ui.notifications?.warn?.("Foundry FilePicker is not available.");
    return;
  }
  const input = form?.elements?.image;
  const picker = new FilePicker({
    type: "image",
    current: input?.value ?? "",
    callback: (path) => {
      if (input) input.value = path;
    }
  });
  picker.browse();
}

function bindMonitorControls(app, html) {
  const element = getElement(app, html);
  if (!element) return;
  const form = element.querySelector("[data-security-camera-form]");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCameraFromForm(form);
  });

  form?.elements?.feedSource?.addEventListener("change", () => {
    const imageField = form.querySelector("[data-security-camera-static-image-field]");
    if (imageField) imageField.hidden = form.elements.feedSource.value !== "image";
  });

  element.querySelectorAll("[data-security-camera-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      selectedCameraId = event.currentTarget.dataset.securityCameraId;
      editingCameraId = selectedCameraId;
      await app.render(true);
    });
  });

  element.querySelectorAll("[data-security-camera-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.securityCameraAction;
      if (action === "new") {
        await createNewCamera();
        return;
      }

      if (action === "duplicate") {
        await duplicateCamera(selectedCameraId);
        return;
      }

      if (action === "delete") {
        await deleteCamera(selectedCameraId);
        return;
      }

      if (action === "browse-image") {
        browseForImage(form);
        return;
      }

      if (action === "pan-region") {
        panToCameraRegion(selectedCameraId);
        return;
      }

      if (action === "show") {
        await showFeed(selectedCameraId);
        return;
      }

      if (action === "close-feed") {
        closeFeedForEveryone();
        return;
      }

    });
  });
}

function applyFeedDisplayMode(app) {
  const camera = app?.camera ?? {};
  const mode = normalizeChoice(camera.displayMode, DISPLAY_MODES, DEFAULT_CAMERA.displayMode);
  const element = getElement(app);

  element?.classList.toggle("security-camera-feed-display-window", mode === "window");
  element?.classList.toggle("security-camera-feed-display-pip", mode === "picture-in-picture");

  if (mode === "picture-in-picture") {
    const aspect = Number(camera.regionWidth) && Number(camera.regionHeight)
      ? Number(camera.regionWidth) / Number(camera.regionHeight)
      : 16 / 9;
    const maxWidth = Math.min(620, Math.max(360, window.innerWidth * 0.42));
    const maxHeight = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let width = maxWidth;
    let contentHeight = width / aspect;
    if (contentHeight > maxHeight) {
      contentHeight = maxHeight;
      width = contentHeight * aspect;
    }
    const height = Math.round(contentHeight + 112);
    app.setPosition?.({
      left: Math.max(12, window.innerWidth - width - 24),
      top: Math.max(12, window.innerHeight - height - 84),
      width: Math.round(width),
      height
    });
    return;
  }

  app.setPosition?.({
    width: 720,
    height: "auto"
  });
}

function bindFeedControls(app, html) {
  const element = getElement(app, html);
  if (!element) return;
  applyFeedDisplayMode(app);
  startLocalLiveRefresh(app);
}

function isCameraLive(camera) {
  const normalized = normalizeCamera(camera);
  return normalized.feedSource === "live" && normalized.status !== "offline" && normalized.status !== "restricted";
}

function canCaptureLiveCamera(camera) {
  if (!canvas?.ready || !canvas?.app?.renderer) return false;
  if (camera.sceneId && canvas.scene?.id !== camera.sceneId) return false;
  return true;
}

function getRenderedCanvasSnapshot() {
  const renderer = canvas?.app?.renderer;
  const targets = [
    canvas?.app?.stage,
    canvas?.stage
  ].filter(Boolean);

  try {
    for (const target of targets) {
      const extracted = renderer?.extract?.canvas?.(target);
      if (extracted?.width && extracted?.height) return extracted;
    }
  } catch (error) {
    console.warn(`${MODULE_ID} | PIXI canvas extraction failed, using renderer view fallback.`, error);
  }

  return renderer?.view ?? canvas?.app?.view ?? null;
}

function getCameraCrop(sourceCanvas, camera) {
  const cameraWithRegion = applyLinkedRegionBounds(normalizeCamera(camera));
  const hasRegion = Number.isFinite(cameraWithRegion.regionX) && Number.isFinite(cameraWithRegion.regionY);
  if (!hasRegion) {
    return {
      sx: 0,
      sy: 0,
      sw: sourceCanvas.width,
      sh: sourceCanvas.height
    };
  }

  const sceneWidth = canvas.dimensions?.width ?? canvas.scene?.width ?? 0;
  const sceneHeight = canvas.dimensions?.height ?? canvas.scene?.height ?? 0;

  if (sceneWidth && sceneHeight && sourceCanvas.width >= sceneWidth * 0.75 && sourceCanvas.height >= sceneHeight * 0.75) {
    const scaleX = sourceCanvas.width / sceneWidth;
    const scaleY = sourceCanvas.height / sceneHeight;
    return {
      sx: cameraWithRegion.regionX * scaleX,
      sy: cameraWithRegion.regionY * scaleY,
      sw: cameraWithRegion.regionWidth * scaleX,
      sh: cameraWithRegion.regionHeight * scaleY
    };
  }

  if (canvas.stage?.worldTransform?.apply && typeof PIXI !== "undefined") {
    const topLeft = canvas.stage.worldTransform.apply(new PIXI.Point(cameraWithRegion.regionX, cameraWithRegion.regionY));
    const bottomRight = canvas.stage.worldTransform.apply(new PIXI.Point(cameraWithRegion.regionX + cameraWithRegion.regionWidth, cameraWithRegion.regionY + cameraWithRegion.regionHeight));
    return {
      sx: topLeft.x,
      sy: topLeft.y,
      sw: bottomRight.x - topLeft.x,
      sh: bottomRight.y - topLeft.y
    };
  }

  return {
    sx: 0,
    sy: 0,
    sw: sourceCanvas.width,
    sh: sourceCanvas.height
  };
}

function clampCrop(crop, sourceCanvas) {
  const sx = Math.max(0, Math.min(sourceCanvas.width - 1, Math.round(crop.sx)));
  const sy = Math.max(0, Math.min(sourceCanvas.height - 1, Math.round(crop.sy)));
  const sw = Math.max(1, Math.min(sourceCanvas.width - sx, Math.round(crop.sw)));
  const sh = Math.max(1, Math.min(sourceCanvas.height - sy, Math.round(crop.sh)));
  return { sx, sy, sw, sh };
}

function getSceneDimensions(sceneId = "") {
  const scene = getSceneById(sceneId);
  const isActiveScene = scene?.id && canvas?.scene?.id === scene.id;
  const dimensions = isActiveScene ? canvas.dimensions : null;
  return {
    x: normalizeNullableNumber(dimensions?.sceneX ?? dimensions?.sceneRect?.x) ?? 0,
    y: normalizeNullableNumber(dimensions?.sceneY ?? dimensions?.sceneRect?.y) ?? 0,
    width: normalizePositiveNumber(dimensions?.sceneWidth ?? dimensions?.sceneRect?.width ?? scene?.width, DEFAULT_CAMERA_REGION_WIDTH),
    height: normalizePositiveNumber(dimensions?.sceneHeight ?? dimensions?.sceneRect?.height ?? scene?.height, DEFAULT_CAMERA_REGION_HEIGHT)
  };
}

function getCropForSceneImage(image, camera) {
  const cameraWithRegion = applyLinkedRegionBounds(normalizeCamera(camera));
  const hasRegion = Number.isFinite(cameraWithRegion.regionX) && Number.isFinite(cameraWithRegion.regionY);
  if (!hasRegion) {
    return {
      sx: 0,
      sy: 0,
      sw: image.naturalWidth,
      sh: image.naturalHeight
    };
  }

  const sceneDimensions = getSceneDimensions(cameraWithRegion.sceneId);
  const scaleX = image.naturalWidth / sceneDimensions.width;
  const scaleY = image.naturalHeight / sceneDimensions.height;

  return {
    sx: (cameraWithRegion.regionX - sceneDimensions.x) * scaleX,
    sy: (cameraWithRegion.regionY - sceneDimensions.y) * scaleY,
    sw: cameraWithRegion.regionWidth * scaleX,
    sh: cameraWithRegion.regionHeight * scaleY
  };
}

function loadImage(path) {
  if (!path) return Promise.resolve(null);
  if (imageCache.has(path)) return imageCache.get(path);

  const promise = new Promise((resolve) => {
    const finish = (image) => resolve(image);
    const fallback = () => {
      const image = new Image();
      image.onload = () => finish(image);
      image.onerror = () => finish(null);
      image.src = path;
    };

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => finish(image);
    image.onerror = fallback;
    image.src = path;
  });

  imageCache.set(path, promise);
  return promise;
}

async function captureSceneBackgroundFrame(camera = {}) {
  const sceneBackground = getSceneBackgroundPath(camera.sceneId);
  const imagePath = sceneBackground || camera.image;
  const image = await loadImage(imagePath);
  if (!image?.naturalWidth || !image?.naturalHeight) return "";

  const crop = clampCrop(getCropForSceneImage(image, camera), {
    width: image.naturalWidth,
    height: image.naturalHeight
  });
  const scale = Math.min(1, LIVE_FRAME_MAX_WIDTH / crop.sw);
  const width = Math.max(1, Math.round(crop.sw * scale));
  const height = Math.max(1, Math.round(crop.sh * scale));
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const context = output.getContext("2d");
  context.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
  await drawTokensOnFrame(context, camera, crop, width, height);

  try {
    return output.toDataURL("image/webp", 0.72);
  } catch (error) {
    console.warn(`${MODULE_ID} | Scene background crop failed.`, error);
    return "";
  }
}

function getTokenSceneBounds(token) {
  const document = token?.document;
  if (!document) return null;
  const gridSize = canvas?.dimensions?.size ?? canvas?.grid?.size ?? 100;
  const x = normalizeNullableNumber(document.x);
  const y = normalizeNullableNumber(document.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return {
    x,
    y,
    width: normalizePositiveNumber(document.width, 1) * gridSize,
    height: normalizePositiveNumber(document.height, 1) * gridSize
  };
}

function intersectsBounds(a, b) {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

function shouldDrawToken(token) {
  if (!token?.document) return false;
  if (token.document.hidden && !game.user?.isGM) return false;
  if (token.visible === false || token.renderable === false) return false;
  if (token.isVisible === false) return false;
  return true;
}

function getTokenImagePath(token) {
  return String(token?.document?.texture?.src ?? token?.document?.actor?.img ?? token?.actor?.img ?? "").trim();
}

async function drawTokensOnFrame(context, camera, crop, frameWidth, frameHeight) {
  if (!canvas?.ready || canvas.scene?.id !== camera.sceneId) return;

  const cameraWithRegion = applyLinkedRegionBounds(normalizeCamera(camera));
  const region = {
    x: cameraWithRegion.regionX,
    y: cameraWithRegion.regionY,
    width: cameraWithRegion.regionWidth,
    height: cameraWithRegion.regionHeight
  };
  if (![region.x, region.y, region.width, region.height].every(Number.isFinite)) return;

  for (const token of canvas.tokens?.placeables ?? []) {
    if (!shouldDrawToken(token)) continue;
    const bounds = getTokenSceneBounds(token);
    if (!bounds || !intersectsBounds(bounds, region)) continue;

    const imagePath = getTokenImagePath(token);
    const image = await loadImage(imagePath);
    if (!image?.naturalWidth || !image?.naturalHeight) continue;

    const dx = ((bounds.x - region.x) / region.width) * frameWidth;
    const dy = ((bounds.y - region.y) / region.height) * frameHeight;
    const dw = (bounds.width / region.width) * frameWidth;
    const dh = (bounds.height / region.height) * frameHeight;

    context.save();
    context.globalAlpha = token.document.alpha ?? 1;
    context.drawImage(image, dx, dy, dw, dh);
    context.restore();
  }
}

function isMostlyBlackCanvas(sourceCanvas) {
  const context = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) return false;

  const sampleWidth = Math.min(48, sourceCanvas.width);
  const sampleHeight = Math.min(48, sourceCanvas.height);
  const imageData = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  let total = 0;
  const pixels = imageData.length / 4;

  for (let index = 0; index < imageData.length; index += 4) {
    total += imageData[index] + imageData[index + 1] + imageData[index + 2];
  }

  return total / (pixels * 3) < 3;
}

function captureCanvasFrame(camera = {}) {
  const sourceCanvas = getRenderedCanvasSnapshot();
  if (!sourceCanvas?.width || !sourceCanvas?.height) return "";

  const crop = clampCrop(getCameraCrop(sourceCanvas, camera), sourceCanvas);
  const scale = Math.min(1, LIVE_FRAME_MAX_WIDTH / crop.sw);
  const width = Math.max(1, Math.round(crop.sw * scale));
  const height = Math.max(1, Math.round(crop.sh * scale));
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const context = output.getContext("2d");
  context.drawImage(sourceCanvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);

  if (isMostlyBlackCanvas(output)) return "";

  try {
    return output.toDataURL("image/webp", 0.62);
  } catch (error) {
    console.warn(`${MODULE_ID} | WebP canvas capture failed, using PNG fallback.`, error);
    return output.toDataURL("image/png");
  }
}

async function updateLocalLiveFrame(app) {
  if (!isCameraLive(app?.camera)) return;
  let frame = "";
  if (canCaptureLiveCamera(app.camera)) frame = captureCanvasFrame(app.camera);
  if (!frame) frame = await captureSceneBackgroundFrame(app.camera);
  if (!frame) return;
  await app.updateLiveFrame?.(frame);
}

function stopLocalLiveRefresh(app) {
  if (!app?.liveFrameTimer) return;
  window.clearInterval(app.liveFrameTimer);
  app.liveFrameTimer = null;
}

function startLocalLiveRefresh(app) {
  stopLocalLiveRefresh(app);
  if (!isCameraLive(app?.camera)) return;

  updateLocalLiveFrame(app);
  app.liveFrameTimer = window.setInterval(() => {
    updateLocalLiveFrame(app);
  }, LIVE_FRAME_INTERVAL_MS);
}

const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;
const HandlebarsApplicationMixin = foundry?.applications?.api?.HandlebarsApplicationMixin;

class SecurityMonitorV1 extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-monitor",
      title: "Security Camera Manager",
      template: MONITOR_TEMPLATE_PATH,
      classes: ["security-camera-window"],
      popOut: true,
      resizable: true,
      width: 1060,
      height: "auto"
    });
  }

  getData() {
    return getMonitorContext();
  }

  async _renderInner(data) {
    try {
      return await super._renderInner(data);
    } catch (error) {
      console.warn(`${MODULE_ID} | Monitor template render failed, using inline fallback.`, error);
      return $(renderFallbackMonitor(data));
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindMonitorControls(this, html);
  }

  async close(options) {
    if (activeMonitor === this) activeMonitor = null;
    return super.close(options);
  }
}

class CameraFeedV1 extends Application {
  constructor(cameraData, options = {}) {
    super(options);
    this.camera = prepareCamera(cameraData);
    this.liveFrame = options.liveFrame ?? "";
    this.liveFrameTimer = null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-feed",
      title: "Camera Feed",
      template: FEED_TEMPLATE_PATH,
      classes: ["security-camera-feed-window"],
      popOut: true,
      resizable: true,
      width: 720,
      height: "auto"
    });
  }

  getData() {
    this.camera = prepareCamera(this.camera);
    return {
      camera: {
        ...this.camera,
        liveFrame: this.liveFrame,
        hasLiveFrame: Boolean(this.liveFrame)
      }
    };
  }

  async _renderInner(data) {
    try {
      return await super._renderInner(data);
    } catch (error) {
      console.warn(`${MODULE_ID} | Feed template render failed, using inline fallback.`, error);
      return $(renderFallbackFeed({
        ...this.camera,
        liveFrame: this.liveFrame
      }));
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindFeedControls(this, html);
  }

  async updateLiveFrame(frame) {
    this.liveFrame = frame;
    const element = getElement(this);
    const image = element?.querySelector?.("[data-security-camera-live-frame]");
    const waiting = element?.querySelector?.("[data-security-camera-live-waiting]");

    if (image) {
      image.src = frame;
      image.hidden = false;
      if (waiting) waiting.hidden = true;
      return;
    }

    await this.render(true);
  }

  async close(options) {
    stopLocalLiveRefresh(this);
    if (activeFeed === this) activeFeed = null;
    return super.close(options);
  }
}

function createSecurityMonitorV2Class() {
  if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

  return class SecurityMonitorV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "security-camera-monitor",
      tag: "section",
      classes: ["security-camera-window"],
      window: {
        title: "Security Camera Manager",
        resizable: true
      },
      position: {
        width: 1060,
        height: "auto"
      }
    };

    static PARTS = {
      main: {
        template: MONITOR_TEMPLATE_PATH
      }
    };

    async _prepareContext(options) {
      return {
        ...(await super._prepareContext(options)),
        ...getMonitorContext()
      };
    }

    async _renderHTML(context, options) {
      try {
        return await super._renderHTML(context, options);
      } catch (error) {
        console.warn(`${MODULE_ID} | Monitor template render failed, using inline fallback.`, error);
        const wrapper = document.createElement("template");
        wrapper.innerHTML = renderFallbackMonitor(context).trim();
        return wrapper.content;
      }
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      bindMonitorControls(this);
    }

    async close(options) {
      if (activeMonitor === this) activeMonitor = null;
      return super.close(options);
    }
  };
}

function createCameraFeedV2Class() {
  if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

  return class CameraFeedV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "security-camera-feed",
      tag: "section",
      classes: ["security-camera-feed-window"],
      window: {
        title: "Camera Feed",
        resizable: true
      },
      position: {
        width: 720,
        height: "auto"
      }
    };

    static PARTS = {
      main: {
        template: FEED_TEMPLATE_PATH
      }
    };

    constructor(cameraData, options = {}) {
      super(options);
      this.camera = prepareCamera(cameraData);
      this.liveFrame = options.liveFrame ?? "";
      this.liveFrameTimer = null;
    }

    async _prepareContext(options) {
      this.camera = prepareCamera(this.camera);
      return {
        ...(await super._prepareContext(options)),
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: Boolean(this.liveFrame)
        }
      };
    }

    async _renderHTML(context, options) {
      try {
        return await super._renderHTML(context, options);
      } catch (error) {
        console.warn(`${MODULE_ID} | Feed template render failed, using inline fallback.`, error);
        const wrapper = document.createElement("template");
        wrapper.innerHTML = renderFallbackFeed({
          ...this.camera,
          liveFrame: this.liveFrame
        }).trim();
        return wrapper.content;
      }
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      bindFeedControls(this);
    }

    async updateLiveFrame(frame) {
      this.liveFrame = frame;
      const element = getElement(this);
      const image = element?.querySelector?.("[data-security-camera-live-frame]");
      const waiting = element?.querySelector?.("[data-security-camera-live-waiting]");

      if (image) {
        image.src = frame;
        image.hidden = false;
        if (waiting) waiting.hidden = true;
        return;
      }

      await this.render(true);
    }

    async close(options) {
      stopLocalLiveRefresh(this);
      if (activeFeed === this) activeFeed = null;
      return super.close(options);
    }
  };
}

const SecurityMonitor = createSecurityMonitorV2Class() ?? SecurityMonitorV1;
const CameraFeed = createCameraFeedV2Class() ?? CameraFeedV1;

async function openMonitor() {
  if (!requireGM("open the Security Camera Manager")) return null;

  if (activeMonitor) {
    activeMonitor.bringToFront?.();
    return activeMonitor;
  }

  activeMonitor = new SecurityMonitor();
  await activeMonitor.render(true);
  return activeMonitor;
}

async function closeMonitor() {
  if (!activeMonitor) return;
  const monitor = activeMonitor;
  activeMonitor = null;
  await monitor.close();
}

async function openLocalFeed(cameraData, options = {}) {
  const camera = normalizeCamera(cameraData);
  await closeLocalFeed();
  activeFeed = new CameraFeed(camera, {
    liveFrame: options.liveFrame ?? ""
  });
  await activeFeed.render(true);
  applyFeedDisplayMode(activeFeed);
  return activeFeed;
}

async function closeLocalFeed() {
  if (!activeFeed) return;
  const feed = activeFeed;
  activeFeed = null;
  await feed.close();
}

async function showFeed(cameraId) {
  if (!requireGM("broadcast camera feeds")) return null;
  const camera = getCamera(cameraId);
  if (!camera) {
    ui.notifications?.warn?.("Security camera not found.");
    return null;
  }

  emitSocketMessage({
    action: "showFeed",
    gmUserId: game.user.id,
    camera
  });

  return openLocalFeed(camera);
}

function closeFeedForEveryone() {
  if (!requireGM("close player camera feeds")) return;
  emitSocketMessage({
    action: "closeFeed",
    gmUserId: game.user.id
  });
  closeLocalFeed();
}

async function refreshMonitor() {
  if (!activeMonitor) return;
  await activeMonitor.render(true);
}

async function handleSocketMessage(message) {
  if (!message || typeof message !== "object") return;
  const sender = game.users?.get(message.gmUserId);
  const isGMSent = Boolean(sender?.isGM);

  if (message.action === "showFeed") {
    if (game.user?.isGM) return;
    if (!isGMSent) {
      console.warn(`${MODULE_ID} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const validation = validateCameraData(message.camera);
    if (!validation.ok) {
      console.warn(`${MODULE_ID} | Ignoring invalid socket camera payload.`, validation.errors);
      return;
    }
    await openLocalFeed(validation.camera);
    return;
  }

  if (message.action === "closeFeed") {
    if (game.user?.isGM) return;
    if (!isGMSent) return;
    await closeLocalFeed();
  }
}

function registerSettings() {
  game.settings.register(MODULE_ID, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
}

function registerApi() {
  const api = {
    openMonitor,
    closeMonitor,
    showFeed,
    registerCamera,
    createNewCamera,
    deleteCamera,
    duplicateCamera,
    getCameras,
    closeFeed: closeFeedForEveryone,
    get activeMonitor() {
      return activeMonitor;
    },
    get activeFeed() {
      return activeFeed;
    }
  };

  game.securityCameras = api;
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
}

function registerWithHoloSuite() {
  const holosuite = game.modules.get("holosuite-core");
  const api = holosuite?.active ? holosuite.api : null;
  if (!api?.registerApp) return false;

  api.registerApp({
    id: MODULE_ID,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: false,
    featureId: MODULE_ID,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => openMonitor()
  });
  return true;
}

function addSceneControlButton(controls) {
  if (!game.user?.isGM) return;

  const openCameraManager = () => openMonitor();
  const tool = {
    name: "security-cameras",
    title: "Security Camera Manager",
    icon: "fas fa-video",
    button: true,
    visible: true,
    onClick: openCameraManager,
    onChange: openCameraManager
  };

  if (!Array.isArray(controls)) {
    const tokenControls = controls.tokens ?? controls.token;
    if (!tokenControls?.tools) return;

    if (Array.isArray(tokenControls.tools)) {
      tokenControls.tools.push(tool);
      return;
    }

    const order = Object.keys(tokenControls.tools).length;
    tokenControls.tools["security-cameras"] = { ...tool, order };
    return;
  }

  const tokenControls = controls.find((control) => control.name === "token");
  if (!tokenControls?.tools) return;
  tokenControls.tools.push(tool);
}

Hooks.once("init", () => {
  registerSettings();
});

// HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

Hooks.once("ready", () => {
  registerApi();
  registerWithHoloSuite();
  game.socket?.on?.(SOCKET_NAME, handleSocketMessage);
  console.log(`${MODULE_ID} | Ready. Use game.securityCameras.openMonitor()`);
});

