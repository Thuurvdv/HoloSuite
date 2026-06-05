import { createHoloSuiteSocket } from "../../shared/src/index";
import {
  DEFAULT_CAMERA,
  DEFAULT_CAMERA_REGION_HEIGHT,
  DEFAULT_CAMERA_REGION_WIDTH,
  DISPLAY_MODE_CHOICES,
  DISPLAY_MODES,
  FEED_SOURCE_CHOICES,
  STATUS_CHOICES,
  normalizeCamera as normalizeCameraModel,
  normalizeChoice,
  validateCameraData as validateCameraDataModel
} from "./camera-model";
import {
  getShapesRegionBounds,
  toCameraRegionBounds
} from "./region-geometry";
import { createSecurityCameraAppClasses } from "./apps";
import { createLiveFrameController } from "./live-frame";

const MODULE_ID = "security-cameras";
const SOCKET_NAME = `module.${MODULE_ID}`;
const moduleSocket = createHoloSuiteSocket(MODULE_ID, {
  socketName: SOCKET_NAME,
  title: "Security Cameras"
});
const MONITOR_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/monitor.hbs`;
const FEED_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/feed.hbs`;

let activeMonitor = null;
let activeFeed = null;
let selectedCameraId = "";
let editingCameraId = "";

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

function normalizeCamera(cameraData = {}, options = {}) {
  return normalizeCameraModel(cameraData, { ...options, createId: createCameraId });
}

function validateCameraData(cameraData = {}, options = {}) {
  return validateCameraDataModel(cameraData, { ...options, createId: createCameraId });
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

function getRegionBounds(region) {
  const regionObject = region?.object ?? canvas?.regions?.placeables?.find?.((placeable) => placeable.document?.id === region?.id);
  const objectBounds = regionObject?.bounds;
  if (objectBounds?.width && objectBounds?.height) {
    return toCameraRegionBounds(objectBounds);
  }

  const directBounds = region?.bounds;
  if (directBounds?.width && directBounds?.height) {
    return toCameraRegionBounds(directBounds);
  }

  const source = region?.toObject?.() ?? region;
  const shapes = Array.isArray(region?.shapes) ? region.shapes : Array.isArray(source?.shapes) ? source.shapes : [];
  return getShapesRegionBounds(shapes);
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
  return moduleSocket.emit(message);
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

function getElement(app: any, html: any = null) {
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

function bindMonitorControls(app: any, html: any = null) {
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

function applyFeedDisplayMode(app: any) {
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

function bindFeedControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;
  applyFeedDisplayMode(app);
  liveFrameController.startLocalLiveRefresh(app);
}

const liveFrameController = createLiveFrameController({
  applyLinkedRegionBounds,
  broadcastLiveFrame: (camera, liveFrame) => {
    if (!game.user?.isGM || !camera?.id || !liveFrame) return;
    emitSocketMessage({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: camera.id,
      liveFrame
    });
  },
  getSceneBackgroundPath,
  getSceneById,
  isFrameProducer: () => Boolean(game.user?.isGM),
  moduleId: MODULE_ID,
  normalizeCamera
});

const { SecurityMonitor, CameraFeed } = createSecurityCameraAppClasses({
  moduleId: MODULE_ID,
  monitorTemplatePath: MONITOR_TEMPLATE_PATH,
  feedTemplatePath: FEED_TEMPLATE_PATH,
  escapeHTML,
  getMonitorContext,
  prepareCamera,
  bindMonitorControls,
  bindFeedControls,
  getElement,
  liveFrameController,
  clearActiveMonitor: (app) => {
    if (activeMonitor === app) activeMonitor = null;
  },
  clearActiveFeed: (app) => {
    if (activeFeed === app) activeFeed = null;
  }
});

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

async function openLocalFeed(cameraData: any, options: any = {}) {
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

  const liveFrame = await liveFrameController.captureLiveFrame(camera, {
    preferDataUrl: true
  });

  emitSocketMessage({
    action: "showFeed",
    gmUserId: game.user.id,
    camera,
    liveFrame
  });

  return openLocalFeed(camera, { liveFrame });
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
  const isGMSent = moduleSocket.isGMSender(message.gmUserId);

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
    await openLocalFeed(validation.camera, {
      liveFrame: typeof message.liveFrame === "string" ? message.liveFrame : ""
    });
    return;
  }

  if (message.action === "updateFeedFrame") {
    if (game.user?.isGM) return;
    if (!isGMSent) return;
    const cameraId = String(message.cameraId ?? "");
    if (!cameraId || activeFeed?.camera?.id !== cameraId) return;
    if (typeof message.liveFrame !== "string" || !message.liveFrame) return;
    await activeFeed.updateLiveFrame?.(message.liveFrame);
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
    playerVisible: false,
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
