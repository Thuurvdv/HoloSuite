import { createFrameCache } from "./frame-cache";
import { createMediaCache } from "./media-cache";
import { createFrameScheduler } from "./frame-scheduler";
import { CAMERA_QUALITY, type CameraPerformance } from "./performance";
import { drawSceneTile, getSceneDrawOrder, getTileGeometry, sceneDocuments } from "./scene-compositor";
import type { SecurityCamera } from "./camera-model";
import {
  DEFAULT_CAMERA_REGION_HEIGHT,
  DEFAULT_CAMERA_REGION_WIDTH,
  normalizeNullableNumber,
  normalizePositiveNumber
} from "./camera-model";
import {
  getBoundsIntersection,
  getTokenData,
  getTokenSceneBounds as getTokenDocumentBounds,
  projectBoundsToFrame
} from "./token-projection";

const TOKEN_MARKER_MIN_SIZE = 18;

interface LiveFrameDependencies {
  applyLinkedRegionBounds(camera: SecurityCamera): SecurityCamera;
  broadcastLiveFrame?(camera: SecurityCamera, liveFrame: string): void;
  getRegionDocument?(regionId?: string, sceneId?: string): any;
  getSceneBackgroundPath(sceneId?: string): string;
  getSceneById(sceneId?: string): any;
  isFrameProducer(): boolean;
  getPerformance?(): CameraPerformance;
  moduleId: string;
  normalizeCamera(camera: any): SecurityCamera;
}

interface CaptureLiveFrameOptions {
  preferDataUrl?: boolean;
}

export function createLiveFrameController(dependencies: LiveFrameDependencies) {
  const mediaCache = createMediaCache();
  const frameCache = createFrameCache(1000, 16);
  const animatedCameras = new Set<string>();
  const canvasPool: HTMLCanvasElement[] = [];
  const remoteKeys = new Set<string>();
  let activeCameraIds = new Set<string>();
  const performanceOptions = () => dependencies.getPerformance?.() ?? { ...CAMERA_QUALITY.high, animateVideo: true };
  let epoch = 0;
  const sceneEpochs = new Map<string, number>();
  const captureVersion = (sceneId: string) => `${epoch}:${sceneEpochs.get(sceneId) ?? 0}`;

  function isCameraLive(camera: any) {
    const normalized = dependencies.normalizeCamera(camera);
    return normalized.feedSource === "live" && normalized.status !== "offline" && normalized.status !== "restricted";
  }

  function getSceneDimensions(sceneId = "") {
    const scene = dependencies.getSceneById(sceneId);
    const isActiveScene = scene?.id && canvas?.scene?.id === scene.id;
    const dimensions = isActiveScene ? canvas.dimensions : scene?.dimensions;
    return {
      x: normalizeNullableNumber(dimensions?.sceneX ?? dimensions?.sceneRect?.x) ?? 0,
      y: normalizeNullableNumber(dimensions?.sceneY ?? dimensions?.sceneRect?.y) ?? 0,
      width: normalizePositiveNumber(
        dimensions?.sceneWidth
        ?? dimensions?.sceneRect?.width
        ?? dimensions?.width
        ?? scene?.width,
        DEFAULT_CAMERA_REGION_WIDTH
      ),
      height: normalizePositiveNumber(
        dimensions?.sceneHeight
        ?? dimensions?.sceneRect?.height
        ?? dimensions?.height
        ?? scene?.height,
        DEFAULT_CAMERA_REGION_HEIGHT
      )
    };
  }

  async function canvasToFrame(canvas: HTMLCanvasElement, quality: number): Promise<string> {
    // Older embedded browsers may lack toBlob; supported Foundry browsers use the async path.
    if (!canvas.toBlob) return canvas.toDataURL("image/webp", quality);
    const encode = (type: string) => new Promise<Blob | null>((resolve, reject) => {
      try { canvas.toBlob(resolve, type, quality); } catch (error) { reject(error); }
    });
    const blob = await encode("image/webp") ?? await encode("image/png");
    if (!blob) throw new Error("Could not encode the camera frame.");
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error("Could not read the camera frame."));
      reader.readAsDataURL(blob);
    });
  }

  async function captureSceneBackgroundFrame(camera: any, cacheKey: string, captureEpoch: string) {
    const scene = dependencies.getSceneById(camera.sceneId);
    if (!scene) return "";
    const dimensions = getSceneDimensions(camera.sceneId);
    const region = Number.isFinite(camera.regionX) && Number.isFinite(camera.regionY)
      ? { x: camera.regionX, y: camera.regionY, width: camera.regionWidth, height: camera.regionHeight }
      : dimensions;
    // Keep the requested scene rectangle intact, including padding outside the background.
    const settings = performanceOptions();
    const generation = Number((globalThis as any).game?.release?.generation ?? 13);
    const scale = Math.min(1, settings.maxDimension / region.width, settings.maxDimension / region.height);
    const width = Math.max(1, Math.round(region.width * scale));
    const height = Math.max(1, Math.round(region.height * scale));
    const output = canvasPool.pop() ?? document.createElement("canvas");
    output.width = width;
    output.height = height;
    const context = output.getContext("2d");
    if (!context) return "";
    const media = mediaCache.beginFrame(activeCameraIds.has(camera.id) ? camera.id : undefined);
    let animated = false;
    const loadImage = async (path: string, autoplay = true) => {
      const image = await media.load(path);
      if (image?.tagName === "VIDEO") {
        if (settings.animateVideo && autoplay && (document.visibilityState !== "hidden" || remoteKeys.size > 0)) {
          animated = true;
          image.play().catch(() => {});
        } else image.pause();
      } else if (image && mediaCache.isAnimated(image)) animated = true;
      return image;
    };
    try {
      context.fillStyle = String(scene.backgroundColor ?? "#010505");
      context.fillRect(0, 0, width, height);
      const imagePath = dependencies.getSceneBackgroundPath(camera.sceneId) || camera.image;
      const image = await loadImage(imagePath);
      if (imagePath && !image) throw new Error("Camera background could not be loaded.");
      const tiles = sceneDocuments(scene.tiles ?? scene._source?.tiles);
      const foregroundOffset = generation >= 14 ? .5 : 0;
      if (typeof scene.foreground === "string" && scene.foreground) tiles.push({
        x: dimensions.x + dimensions.width * foregroundOffset,
        y: dimensions.y + dimensions.height * foregroundOffset, width: dimensions.width, height: dimensions.height,
        elevation: scene.foregroundElevation ?? Number.MAX_SAFE_INTEGER, sort: -Number.MAX_SAFE_INTEGER,
        texture: { src: scene.foreground }
      });
      const entries = getSceneDrawOrder(tiles, getCameraTokenDocuments(scene, camera));
      const gridSize = getSceneGridSize(scene);
      const sceneTransform = () => context.setTransform(width / region.width, 0, 0, height / region.height,
        -region.x * width / region.width, -region.y * height / region.height);
      sceneTransform();
      if (image) context.drawImage(image, dimensions.x, dimensions.y, dimensions.width, dimensions.height);
      for (const entry of entries) {
        if (entry.kind === "token") {
          context.setTransform(1, 0, 0, 1, 0, 0);
          await drawTokenOnFrame(context, entry.document, entry.data, region, gridSize, width, height, loadImage);
          continue;
        }
        const data: any = entry.data;
        const initialGeometry = getTileGeometry(data, undefined, generation);
        if (!initialGeometry || !initialGeometry.alpha) continue;
        if ((!data.texture?.fit || data.texture.fit === "fill") && !getBoundsIntersection(initialGeometry.bounds, region)) continue;
        const path = String(data.texture?.src ?? data.img ?? "");
        if (!path) continue;
        const media = await loadImage(path, data.video?.autoplay !== false);
        if (!media) throw new Error("A camera tile could not be loaded. Check its media path and access.");
        if (media.tagName === "VIDEO") {
          media.loop = data.video?.loop !== false;
        }
        const geometry = getTileGeometry(data, media, generation)!;
        if (!getBoundsIntersection(geometry.bounds, region)) continue;
        sceneTransform();
        drawSceneTile(context, media, geometry);
      }
      const frame = await canvasToFrame(output, settings.quality);
      if (captureEpoch === captureVersion(camera.sceneId)) {
        if (animated) animatedCameras.add(cacheKey);
        else animatedCameras.delete(cacheKey);
      }
      return frame;
    } finally {
      media.finish();
      if (canvasPool.length < 2) canvasPool.push(output);
    }
  }

  function getSceneGridSize(scene: any) {
    const isActiveScene = scene?.id && canvas?.scene?.id === scene.id;
    return normalizePositiveNumber(
      isActiveScene
        ? canvas?.dimensions?.size ?? canvas?.grid?.size ?? scene?.grid?.size
        : scene?.dimensions?.size ?? scene?.grid?.size,
      100
    );
  }

  function getSceneTokenDocuments(scene: any) {
    if (!scene) return [];
    const candidates = [
      () => getEmbeddedDocumentCollection(scene, "Token"),
      () => scene.tokens,
      () => scene.getEmbeddedDocuments?.("Token"),
      () => scene._source?.tokens,
      () => scene.toObject?.().tokens
    ];
    for (const candidate of candidates) {
      const collection = candidate();
      if (collection != null) return normalizeTokenCollection(collection);
    }

    return [];
  }

  function getEmbeddedDocumentCollection(scene: any, name: string) {
    try {
      return scene?.getEmbeddedCollection?.(name);
    } catch (error) {
      console.warn(`${dependencies.moduleId} | Could not read ${name} collection for inactive scene.`, error);
      return null;
    }
  }

  function normalizeTokenCollection(collection: any): any[] {
    if (!collection) return [];

    const source = Array.isArray(collection?.contents)
      ? collection.contents
      : Array.isArray(collection)
        ? collection
        : typeof collection.values === "function"
          ? Array.from(collection.values())
          : Array.from(collection ?? []);

    return source
      .map((entry: any) => Array.isArray(entry) ? entry[1] : entry)
      .map((entry: any) => entry?.document ?? entry)
      .filter(Boolean);
  }

  async function drawTokenOnFrame(context: CanvasRenderingContext2D, token: any, data: any, region: any,
    gridSize: number, frameWidth: number, frameHeight: number, loadImage: (path: string) => Promise<any>) {
    const bounds = getTokenDocumentBounds(data, gridSize);
    if (!bounds) return;
    const visibleBounds = getBoundsIntersection(bounds, region);
    if (!visibleBounds) return;
    const imagePath = String(token.getTextureSrc?.() ?? data.texture?.src ?? data.img
      ?? token.actor?.img ?? token.baseActor?.img ?? token.actor?.prototypeToken?.texture?.src ?? "").trim();
    const image = await loadImage(imagePath);
    const { dx, dy, dw, dh } = projectBoundsToFrame(visibleBounds, region, { width: frameWidth, height: frameHeight });
    context.save();
    try {
      context.globalAlpha = normalizeNullableNumber(data.alpha) ?? 1;
      if (image?.naturalWidth && image?.naturalHeight) {
        const crop = getTokenImageCrop(image, bounds, visibleBounds);
        context.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, dx, dy, dw, dh);
      } else drawTokenMarker(context, data, dx, dy, dw, dh);
    } finally { context.restore(); }
  }

  function getCameraTokenDocuments(scene: any, camera: SecurityCamera) {
    const region = dependencies.getRegionDocument?.(camera.regionId, camera.sceneId);
    if (region && canvas?.scene?.id === scene.id && "tokens" in Object(region)) return normalizeTokenCollection(region.tokens);
    return getSceneTokenDocuments(scene);
  }

  function getTokenImageCrop(image: any, bounds: any, visibleBounds: any) {
    const scaleX = image.naturalWidth / bounds.width;
    const scaleY = image.naturalHeight / bounds.height;
    return {
      sx: Math.max(0, (visibleBounds.x - bounds.x) * scaleX),
      sy: Math.max(0, (visibleBounds.y - bounds.y) * scaleY),
      sw: Math.min(image.naturalWidth, visibleBounds.width * scaleX),
      sh: Math.min(image.naturalHeight, visibleBounds.height * scaleY)
    };
  }

  function drawTokenMarker(context: CanvasRenderingContext2D, tokenDocument: any, dx: number, dy: number, dw: number, dh: number) {
    const data: any = getTokenData(tokenDocument);
    const width = Math.max(TOKEN_MARKER_MIN_SIZE, dw);
    const height = Math.max(TOKEN_MARKER_MIN_SIZE, dh);
    const x = dx + (dw - width) / 2;
    const y = dy + (dh - height) / 2;
    const radius = Math.min(width, height) / 2;
    const cx = x + width / 2;
    const cy = y + height / 2;

    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(10, 18, 24, 0.82)";
    context.fill();
    context.lineWidth = Math.max(2, Math.min(width, height) * 0.08);
    context.strokeStyle = "rgba(72, 220, 255, 0.95)";
    context.stroke();

    const label = String(data?.name ?? tokenDocument?.name ?? "").trim().slice(0, 2).toUpperCase();
    if (!label) return;
    context.font = `700 ${Math.max(10, Math.round(radius * 0.72))}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "rgba(224, 252, 255, 0.96)";
    context.fillText(label, cx, cy + 0.5);
  }

  async function captureLiveFrame(camera: any = {}, _options: CaptureLiveFrameOptions = {}) {
    const normalized = dependencies.applyLinkedRegionBounds(dependencies.normalizeCamera(camera));
    if (!isCameraLive(normalized)) return "";
    const scene = dependencies.getSceneById(normalized.sceneId);
    const resolved = { ...normalized, sceneId: scene?.id ?? normalized.sceneId };
    const settings = performanceOptions();
    const key = JSON.stringify([resolved.sceneId, resolved, settings]);
    const captureEpoch = captureVersion(resolved.sceneId);
    const maxAge = animatedCameras.has(key) ? settings.interval * .8 : Infinity;
    const frame = await frameCache.get(key, () => captureSceneBackgroundFrame(resolved, key, captureEpoch), maxAge);
    return captureEpoch === captureVersion(resolved.sceneId) ? frame : "";
  }

  const scheduler = createFrameScheduler({
    capture: captureLiveFrame,
    interval: () => performanceOptions().interval,
    idle: () => mediaCache.pauseVideos(),
    active(ids) { activeCameraIds = ids; mediaCache.retainOwners(ids); },
    error: error => console.warn(`${dependencies.moduleId} | Camera refresh failed; retrying.`, error)
  });
  const broadcastKey = {};

  function stopLocalLiveRefresh(app: any) { scheduler.unsubscribe(app); }

  function startLocalLiveRefresh(app: any) {
    stopLocalLiveRefresh(app);
    if (!isCameraLive(app?.camera) || !dependencies.isFrameProducer()) return;
    scheduler.subscribe(app.camera, app, frame => app.updateLiveFrame?.(frame), () => {
      const element = app.element?.[0] ?? app.element;
      return app.rendered !== false && !app.minimized && !app._minimized
        && (!element || (!element.hidden && element.style?.display !== "none"));
    });
  }

  function startBroadcastLiveRefresh(camera: any) {
    scheduler.unsubscribe(broadcastKey);
    if (!isCameraLive(camera) || !dependencies.isFrameProducer()) return;
    scheduler.subscribe(camera, broadcastKey, frame => dependencies.broadcastLiveFrame?.(dependencies.normalizeCamera(camera), frame));
  }

  function invalidateFrames(sceneId?: string) {
    if (sceneId) {
      sceneEpochs.set(sceneId, (sceneEpochs.get(sceneId) ?? 0) + 1);
      const prefix = `[${JSON.stringify(sceneId)},`;
      frameCache.invalidate(key => key.startsWith(prefix));
      for (const key of animatedCameras) if (key.startsWith(prefix)) animatedCameras.delete(key);
    } else {
      epoch++;
      sceneEpochs.clear();
      frameCache.clear();
      animatedCameras.clear();
    }
    scheduler.invalidate(sceneId);
  }

  return {
    captureLiveFrame,
    invalidateFrames,
    reconfigure() { mediaCache.pauseVideos(); invalidateFrames(); scheduler.reconfigure(); },
    wake: scheduler.wake,
    startBroadcastLiveRefresh,
    stopBroadcastLiveRefresh: () => scheduler.unsubscribe(broadcastKey),
    startLocalLiveRefresh,
    stopLocalLiveRefresh,
    subscribeRemote(camera: any, key: string, deliver: (frame: string) => void, active: () => boolean) {
      if (!isCameraLive(camera) || !dependencies.isFrameProducer()) return;
      remoteKeys.add(key);
      scheduler.subscribe(camera, key, deliver, active, true);
    },
    unsubscribeRemote(key: string) { remoteKeys.delete(key); scheduler.unsubscribe(key); },
    clearRemoteViewers() {
      for (const key of remoteKeys) scheduler.unsubscribe(key);
      remoteKeys.clear();
    }
  };
}
