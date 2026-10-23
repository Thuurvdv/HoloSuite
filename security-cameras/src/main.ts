import { canUserAccessCamera, cameraRevision } from "./camera-access";
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
import { applyCameraEffects, cameraPerformance, registerCameraSettings } from "./settings";
import { FEED_TEMPLATE_PATH, MODULE_ID, MONITOR_TEMPLATE_PATH, SOCKET_NAME } from "./constants";
import { createCameraId, escapeHTML, getDeepClone } from "./utils";

const moduleSocket = createHoloSuiteSocket(MODULE_ID, {
  socketName: SOCKET_NAME,
  title: "Security Cameras"
});

let activeMonitor = null;
let activeFeed = null;
let selectedCameraId = "";
let editingCameraId = "";
let broadcastCameraId = "";
let broadcastGeneration = 0;
let feedGeneration = 0;
let editorDirty = false;
let editorDraft: any = null;
const REMOTE_LEASE_INTERVAL_MS = 10000;
const remoteViewers = new Map<string, {
  userId: string; cameraId: string; revision: string; expires: number; timer: number; lastFrame: string; needsAck: boolean;
}>();

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
  return String(scene?.background?.src ?? scene?.img ?? "").trim();
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
  const isOnline = camera.status === "online" || camera.status === "clean";
  const isOffline = camera.status === "offline";
  const isCorrupted = camera.status === "corrupted";
  const isRestricted = camera.status === "restricted";
  const isLive = camera.feedSource === "live";

  return {
    ...camera,
    sceneName: getSceneName(camera.sceneId),
    regionName: getRegionDocument(camera.regionId, camera.sceneId)?.name || (camera.regionId ? "Region unavailable" : "No region"),
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
  const previous = getDeepClone(getCameraStore());
  await game.settings.set(MODULE_ID, "cameras", cameras);
  liveFrameController.invalidateFrames();
  for (const id of Object.keys(previous)) {
    if (JSON.stringify(previous[id]) === JSON.stringify(cameras[id])) continue;
    removeCameraViewers(id);
    emitSocketMessage({ action: "cameraChanged", gmUserId: game.user.id, cameraId: id,
      camera: cameras[id] ? normalizeCamera(cameras[id]) : null });
    if (activeFeed?.camera?.id === id) {
      if (cameras[id]) await openLocalFeed(cameras[id]);
      else await closeLocalFeed();
    }
    if (broadcastCameraId === id) {
      broadcastGeneration++;
      liveFrameController.stopBroadcastLiveRefresh();
      if (!cameras[id]) broadcastCameraId = "";
    }
  }
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
      sceneId: form.elements.sceneId.value,
      location: formData.get("location"),
      image: formData.get("image"),
      feedSource: formData.get("feedSource"),
      status: formData.get("status"),
      displayMode: formData.get("displayMode"),
      regionId: form.elements.regionId.value,
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

  if (!form?.reportValidity()) return null;
  const { originalId, camera } = readCameraForm(form);
  const validation = validateCameraData(camera);
  if (!validation.ok) {
    ui.notifications?.error?.(validation.errors.join(" "));
    return null;
  }

  const savedCamera = applyLinkedRegionBounds(validation.camera);
  const cameras = getDeepClone(getCameraStore());
  if (originalId !== savedCamera.id && Object.hasOwn(cameras, savedCamera.id)) {
    ui.notifications?.warn?.("That camera ID is already in use. Choose a unique ID.");
    return null;
  }
  if (originalId && originalId !== savedCamera.id) delete cameras[originalId];
  editorDirty = false;
  editorDraft = null;
  cameras[savedCamera.id] = savedCamera;
  selectedCameraId = savedCamera.id;
  editingCameraId = savedCamera.id;
  await saveCameraStore(cameras);
  ui.notifications?.info?.("Security camera saved.");
  return savedCamera;
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
  const editorCamera = editorDraft ?? (editingCameraId === ""
    ? createEmptyCameraDraft()
    : getCamera(editingCameraId) ?? createEmptyCameraDraft());

  const preparedEditorCamera = prepareCamera(editorCamera);

  return {
    cameras: cameras.map((camera) => ({
      ...prepareCamera(camera),
      isSelected: camera.id === selectedCameraId
    })),
    selectedCamera: selectedCamera ? prepareCamera(selectedCamera) : null,
    editorCamera: preparedEditorCamera,
    originalEditorId: editorDraft?.originalId ?? editorCamera.id,
    sceneChoices: getSceneChoices(editorCamera.sceneId),
    regionChoices: getRegionChoices(editorCamera.sceneId, editorCamera.regionId),
    feedSourceChoices: prepareChoices(FEED_SOURCE_CHOICES, editorCamera.feedSource),
    statusChoices: prepareChoices(STATUS_CHOICES, editorCamera.status),
    displayModeChoices: prepareChoices(DISPLAY_MODE_CHOICES, editorCamera.displayMode),
    showStaticImageField: editorCamera.feedSource === "image",
    hasCameras: cameras.length > 0,
    isNewCamera: !editorCamera.id,
    editorDirty,
  };
}

function browseForImage(form) {
  if (typeof FilePicker === "undefined") {
    ui.notifications?.warn?.("The file browser is unavailable.");
    return;
  }
  const input = form?.elements?.image;
  const picker = new FilePicker({
    type: "image",
    current: input?.value ?? "",
    callback: (path) => {
      if (input) { input.value = path; input.dispatchEvent(new Event("input", { bubbles: true })); }
    }
  });
  picker.browse();
}

function allowDiscardCameraChanges() {
  if (!editorDirty) return true;
  if (!window.confirm("Discard unsaved camera changes?")) return false;
  editorDirty = false;
  editorDraft = null;
  return true;
}

function stopMonitorPreview(app: any) {
  liveFrameController.stopLocalLiveRefresh(app);
}

function bindMonitorControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;
  const form = element.querySelector("[data-security-camera-form]");
  stopMonitorPreview(app);
  app.camera = getCamera(selectedCameraId);
  app.lastFrameAt = null;
  app.frameError = false;
  const preview = element.querySelector(".security-camera-preview-frame");
  if (app.camera?.feedSource === "live" && !["offline", "restricted"].includes(app.camera.status) && preview) {
    preview.replaceChildren();
    const image = document.createElement("img");
    image.alt = app.camera.name;
    image.hidden = true;
    preview.append(image);
    const waiting = document.createElement("div");
    waiting.className = "security-camera-placeholder";
    waiting.textContent = "Waiting for first frame";
    preview.append(waiting);
    app.updateLiveFrame = async (frame: string) => {
      if (image.getAttribute("src") !== frame) image.src = frame;
      image.hidden = false;
      waiting.hidden = true;
      app.lastFrameAt = Date.now();
      app.frameError = false;
    };
    liveFrameController.startLocalLiveRefresh(app);
  }
  const markDirty = () => {
    editorDirty = true;
    const draft = readCameraForm(form);
    editorDraft = { ...draft.camera, originalId: draft.originalId };
    const indicator = element.querySelector("[data-camera-dirty]");
    if (indicator) indicator.hidden = false;
  };
  form?.addEventListener("input", markDirty);
  form?.addEventListener("change", markDirty);
  form?.elements?.sceneId?.addEventListener("change", () => {
    const select = form.elements.regionId;
    select.replaceChildren(...getRegionChoices(form.elements.sceneId.value).map(choice => new Option(choice.name, choice.id)));
    for (const name of ["regionX", "regionY"]) form.elements[name].value = "";
    form.elements.regionWidth.value = DEFAULT_CAMERA_REGION_WIDTH;
    form.elements.regionHeight.value = DEFAULT_CAMERA_REGION_HEIGHT;
    markDirty();
  });
  form?.elements?.regionId?.addEventListener("change", () => {
    if (!form.elements.regionId.value) {
      for (const name of ["regionX", "regionY"]) form.elements[name].value = "";
    }
    markDirty();
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCameraFromForm(form);
  });

  const updateFeedSourceFields = () => {
    const isLive = form.elements.feedSource.value === "live";
    form.elements.sceneId.disabled = !isLive;
    form.elements.regionId.disabled = !isLive;
    const imageField = form.querySelector("[data-security-camera-static-image-field]");
    if (imageField) imageField.hidden = form.elements.feedSource.value !== "image";
  };
  updateFeedSourceFields();
  form?.elements?.feedSource?.addEventListener("change", updateFeedSourceFields);

  element.querySelectorAll("[data-security-camera-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      if (!allowDiscardCameraChanges()) return;
      selectedCameraId = event.currentTarget.dataset.securityCameraId;
      editingCameraId = selectedCameraId;
      await app.render(true);
    });
  });

  element.querySelectorAll("[data-security-camera-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.securityCameraAction;
      if (["new", "duplicate", "delete"].includes(action) && !allowDiscardCameraChanges()) return;
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

      if (action === "show" || action === "save-show") {
        if (action === "save-show") {
          const saved = await saveCameraFromForm(form);
          if (!saved) return;
          await showFeed(saved.id);
          return;
        }
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
    const height = Math.round(contentHeight + 190);
    width += 48;
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
    height: 520
  });
}

function bindFeedControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;
  applyFeedDisplayMode(app);
  liveFrameController.startLocalLiveRefresh(app);
  startRemoteLiveRefresh(app);
  if (app.liveFrame && !app.lastFrameAt) app.lastFrameAt = Date.now();
  const handle = element.querySelector("[data-security-camera-drag]") as HTMLElement | null;
  app.feedDragController?.abort();
  handle?.addEventListener("pointerdown", (event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    app.bringToFront?.();
    const bounds = element.getBoundingClientRect();
    app.feedDragController?.abort();
    const controller = app.feedDragController = new AbortController();
    const drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top };
    document.addEventListener("pointermove", (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return;
      move(drag.left + moveEvent.clientX - drag.x, drag.top + moveEvent.clientY - drag.y);
    }, { signal: controller.signal });
    const endDrag = (endEvent: PointerEvent) => {
      if (endEvent.pointerId === drag.pointerId) controller.abort();
    };
    document.addEventListener("pointerup", endDrag, { signal: controller.signal });
    document.addEventListener("pointercancel", endDrag, { signal: controller.signal });
  });
  const move = (left: number, top: number) => app.setPosition?.({
    left: Math.max(0, Math.min(window.innerWidth - 80, left)),
    top: Math.max(0, Math.min(window.innerHeight - 40, top))
  });
  handle?.addEventListener("keydown", (event: KeyboardEvent) => {
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    const bounds = element.getBoundingClientRect();
    const step = event.shiftKey ? 40 : 10;
    move(bounds.left + direction[0] * step, bounds.top + direction[1] * step);
  });
  element.querySelector("[data-security-camera-close]")?.addEventListener("click", () => app.close());
}

const liveFrameController = createLiveFrameController({
  applyLinkedRegionBounds,
  getRegionDocument,
  getSceneBackgroundPath,
  getSceneById,
  isFrameProducer: () => Boolean(game.user?.isGM),
  getPerformance: cameraPerformance,
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
  allowDiscardCameraChanges,
  clearActiveMonitor: (app) => {
    stopMonitorPreview(app);
    if (activeMonitor === app) activeMonitor = null;
  },
  clearActiveFeed: (app) => {
    app.feedDragController?.abort();
    stopRemoteLiveRefresh(app);
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
  await monitor.close();
}

async function openLocalFeed(cameraData: any, options: any = {}) {
  const camera = normalizeCamera(cameraData);
  const previous = activeFeed;
  const generation = ++feedGeneration;
  activeFeed = null;
  if (previous) await previous.close();
  if (generation !== feedGeneration) return null;
  const feed = new CameraFeed(camera, { liveFrame: options.liveFrame ?? "" });
  activeFeed = feed;
  await feed.render(true);
  if (generation !== feedGeneration) { await feed.close({}); return null; }
  applyFeedDisplayMode(feed);
  return feed;
}

async function closeLocalFeed() {
  feedGeneration++;
  if (!activeFeed) return;
  const feed = activeFeed;
  activeFeed = null;
  stopRemoteLiveRefresh(feed);
  await feed.close();
}

async function showFeed(cameraId) {
  if (!requireGM("broadcast camera feeds")) return null;
  const camera = getCamera(cameraId);
  if (!camera) {
    ui.notifications?.warn?.("Security camera not found.");
    return null;
  }

  const generation = ++broadcastGeneration;
  liveFrameController.stopBroadcastLiveRefresh();
  broadcastCameraId = camera.id;
  let liveFrame = "";
  try { liveFrame = await liveFrameController.captureLiveFrame(camera, { preferDataUrl: true }); }
  catch (error) { console.warn(`${MODULE_ID} | Initial frame unavailable.`, error); }
  if (generation !== broadcastGeneration || cameraRevision(getCamera(camera.id)) !== cameraRevision(camera)) return null;

  emitSocketMessage({
    action: "showFeed",
    gmUserId: game.user.id,
    camera,
    liveFrame
  });

  return openLocalFeed(camera, { liveFrame });
}

async function openCameraFeed(cameraId, options: any = {}) {
  const camera = getCamera(cameraId);
  if (!camera) {
    ui.notifications?.warn?.("Security camera not found.");
    return null;
  }
  if (!hasCameraAccess(game.user?.id, cameraId)) {
    ui.notifications?.warn?.("You do not have access to this camera feed.");
    return null;
  }

  let liveFrame = String(options.liveFrame ?? "");
  if (game.user?.isGM && !liveFrame) {
    try { liveFrame = await liveFrameController.captureLiveFrame(camera, { preferDataUrl: true }); }
    catch (error) { console.warn(`${MODULE_ID} | Initial frame unavailable.`, error); }
  }
  return openLocalFeed(camera, { liveFrame });
}

function requestRemoteLiveFrame(cameraId) {
  emitSocketMessage({
    action: "requestLiveFrame",
    userId: game.user?.id,
    cameraId,
    hasFrame: Boolean(activeFeed?.camera?.id === cameraId && activeFeed.liveFrame)
  });
}

function isRemoteLiveCamera(camera) {
  return !game.user?.isGM && camera?.feedSource === "live" && camera.status !== "offline" && camera.status !== "restricted";
}

function startRemoteLiveRefresh(app) {
  stopRemoteLiveRefresh(app);
  if (!isRemoteLiveCamera(app?.camera)) return;
  let subscribed = false;
  const renew = () => {
    const visible = document.visibilityState !== "hidden" && !app.minimized && !app._minimized;
    if (visible) { requestRemoteLiveFrame(app.camera.id); subscribed = true; }
    else if (subscribed) {
      emitSocketMessage({ action: "unsubscribeFeed", userId: game.user.id, cameraId: app.camera.id });
      subscribed = false;
    }
  };
  app.remoteLiveFrameTimer = window.setInterval(renew, REMOTE_LEASE_INTERVAL_MS);
  app.remoteVisibilityHandler = renew;
  document.addEventListener("visibilitychange", renew);
  renew();
}

function stopRemoteLiveRefresh(app) {
  if (!app) return;
  if (app.remoteLiveFrameTimer) {
    window.clearInterval(app.remoteLiveFrameTimer);
    emitSocketMessage({ action: "unsubscribeFeed", userId: game.user?.id, cameraId: app.camera?.id });
  }
  if (app.remoteVisibilityHandler) document.removeEventListener("visibilitychange", app.remoteVisibilityHandler);
  app.remoteVisibilityHandler = null;
  app.remoteLiveFrameTimer = null;
}

function removeRemoteViewer(key: string) {
  const viewer = remoteViewers.get(key);
  if (viewer) window.clearTimeout(viewer.timer);
  remoteViewers.delete(key);
  liveFrameController.unsubscribeRemote(key);
}

function removeCameraViewers(cameraId: string) {
  for (const [key, viewer] of [...remoteViewers]) if (viewer.cameraId === cameraId) removeRemoteViewer(key);
}

function clearRemoteViewers() {
  for (const key of [...remoteViewers.keys()]) removeRemoteViewer(key);
}

function hasCameraAccess(userId, cameraId) {
  const camera = getCamera(cameraId);
  return canUserAccessCamera(game.users?.get?.(userId), camera);
}

function closeFeedForEveryone() {
  if (!requireGM("close player camera feeds")) return;
  emitSocketMessage({
    action: "closeFeed",
    gmUserId: game.user.id
  });
  broadcastGeneration++;
  broadcastCameraId = "";
  clearRemoteViewers();
  liveFrameController.stopBroadcastLiveRefresh();
  closeLocalFeed();
}

async function refreshMonitor() {
  if (!activeMonitor) return;
  await activeMonitor.render(true);
}

function deliverRemoteFrame(cameraId: string, revision: string, liveFrame: string) {
  const camera = getCamera(cameraId);
  if (!camera || cameraRevision(camera) !== revision) return;
  const viewers = [...remoteViewers.values()].filter(viewer => viewer.cameraId === cameraId && viewer.revision === revision
    && Date.now() < viewer.expires && game.users?.get?.(viewer.userId)?.active
    && canUserAccessCamera(game.users.get(viewer.userId), camera));
  const send = (recipients: typeof viewers, payload: any) => {
    if (!recipients.length) return;
    const ids = recipients.map(viewer => viewer.userId);
    emitSocketMessage({ action: "updateFeedFrame", gmUserId: game.user.id, cameraId, revision,
      ...(ids.length === 1 ? { recipientUserId: ids[0] } : { recipientUserIds: ids }), ...payload });
    for (const viewer of recipients) { viewer.lastFrame = liveFrame; viewer.needsAck = false; }
  };
  send(viewers.filter(viewer => viewer.lastFrame !== liveFrame), { liveFrame });
  send(viewers.filter(viewer => viewer.needsAck), { frameUnchanged: true });
}

async function handleSocketMessage(message) {
  if (!message || typeof message !== "object") return;
  const isGMSent = moduleSocket.isGMSender(message.gmUserId);

  if (message.action === "unsubscribeFeed") {
    if (game.user?.isGM) removeRemoteViewer(`${String(message.userId ?? "")}:${String(message.cameraId ?? "")}`);
    return;
  }

  if (message.action === "requestLiveFrame") {
    if (!game.user?.isGM) return;
    const producer = (game.users?.contents ?? []).filter(user => user.isGM && user.active).sort((a, b) => a.id.localeCompare(b.id))[0];
    if (producer && producer.id !== game.user.id) return;
    const cameraId = String(message.cameraId ?? "");
    const userId = String(message.userId ?? "");
    const camera = getCamera(cameraId);
    const key = `${userId}:${cameraId}`;
    if (!camera || !game.users?.get?.(userId)?.active || camera.feedSource !== "live" || !hasCameraAccess(userId, cameraId)) {
      removeRemoteViewer(key);
      return;
    }
    const previous = remoteViewers.get(key);
    if (previous) window.clearTimeout(previous.timer);
    const revision = cameraRevision(camera);
    const viewer = { userId, cameraId, revision, expires: Date.now() + 30000, needsAck: true,
      lastFrame: message.hasFrame === true ? previous?.lastFrame ?? "" : "",
      timer: window.setTimeout(() => removeRemoteViewer(key), 30000) };
    remoteViewers.set(key, viewer);
    liveFrameController.subscribeRemote(camera, key, liveFrame => {
      if (remoteViewers.get(key) !== viewer) return;
      deliverRemoteFrame(cameraId, revision, liveFrame);
    }, () => remoteViewers.get(key) === viewer && Date.now() < viewer.expires && Boolean(game.users?.get?.(userId)?.active));
    return;
  }

  if (message.action === "cameraChanged") {
    if (!isGMSent || (game.user?.isGM && message.gmUserId === game.user.id)) return;
    const validation = message.camera ? validateCameraData(message.camera, { requireId: true }) : null;
    if (message.camera && (!validation?.ok || validation.camera.id !== message.cameraId)) return;
    removeCameraViewers(message.cameraId);
    liveFrameController.invalidateFrames();
    if (broadcastCameraId === message.cameraId) {
      broadcastGeneration++;
      liveFrameController.stopBroadcastLiveRefresh();
      if (!validation) broadcastCameraId = "";
    }
    if (activeFeed?.camera?.id === message.cameraId) {
      if (validation) await openLocalFeed(validation.camera);
      else await closeLocalFeed();
    }
    return;
  }

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
    if (Array.isArray(message.recipientUserIds) && !message.recipientUserIds.includes(game.user?.id)) return;
    const recipientUserId = String(message.recipientUserId ?? "");
    if (recipientUserId && recipientUserId !== game.user?.id) return;
    const cameraId = String(message.cameraId ?? "");
    if (!cameraId || activeFeed?.camera?.id !== cameraId) return;
    if (message.revision !== cameraRevision(normalizeCamera(activeFeed.camera))) return;
    if (["offline", "restricted"].includes(activeFeed.camera.status)) return;
    if (message.frameUnchanged === true) { activeFeed.lastFrameAt = Date.now(); return; }
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
    getCamera,
    openCameraFeed,
    hasCameraAccess,
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

Hooks.once("init", () => {
  registerCameraSettings(() => liveFrameController.reconfigure());
});

Hooks.once("ready", () => {
  applyCameraEffects();
  registerApi();
  registerWithHoloSuite();
  game.socket?.on?.(SOCKET_NAME, (message) => {
    handleSocketMessage(message).catch(error => console.warn(`${MODULE_ID} | Camera message failed.`, error));
  });
  console.log(`${MODULE_ID} | Ready. Use game.securityCameras.openMonitor()`);
});

// Scene edits invalidate still frames; animated media continues on the selected refresh interval.
for (const event of ["createToken", "updateToken", "deleteToken", "createTile", "updateTile", "deleteTile", "updateScene", "createRegion", "updateRegion", "deleteRegion"]) {
  Hooks.on(event, document => {
    const sceneId = event === "updateScene" ? document.id : document.parent?.id;
    liveFrameController.invalidateFrames(sceneId);
  });
}
Hooks.on("updateActor", (actor, changes) => {
  if (!Object.keys(changes).some(key => /^(img|name|prototypeToken)(\.|$)/.test(key))) return;
  for (const scene of game.scenes?.contents ?? []) {
    const tokens = scene.tokens?.contents ?? scene.tokens ?? [];
    if ([...tokens].some(token => token.actorId === actor.id)) liveFrameController.invalidateFrames(scene.id);
  }
});
Hooks.on("updateUser", () => {
  for (const key of [...remoteViewers.keys()]) {
    if (!game.users?.get?.(remoteViewers.get(key)?.userId)?.active) removeRemoteViewer(key);
  }
});
for (const event of ["minimizeApplication", "maximizeApplication", "minimizeApplicationV2", "maximizeApplicationV2"]) {
  Hooks.on(event, () => {
    activeFeed?.remoteVisibilityHandler?.();
    liveFrameController.wake();
  });
}
