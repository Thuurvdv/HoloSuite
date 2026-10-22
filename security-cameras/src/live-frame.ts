import { createFrameCache } from "./frame-cache";
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

const LIVE_FRAME_INTERVAL_MS = 1250;
const LIVE_FRAME_MAX_WIDTH = 960;
const STATIC_FRAME_WEBP_QUALITY = 0.72;
const TOKEN_MARKER_MIN_SIZE = 18;

interface LiveFrameDependencies {
  applyLinkedRegionBounds(camera: SecurityCamera): SecurityCamera;
  broadcastLiveFrame?(camera: SecurityCamera, liveFrame: string): void;
  getRegionDocument?(regionId?: string, sceneId?: string): any;
  getSceneBackgroundPath(sceneId?: string): string;
  getSceneById(sceneId?: string): any;
  isFrameProducer(): boolean;
  moduleId: string;
  normalizeCamera(camera: any): SecurityCamera;
}

interface CaptureLiveFrameOptions {
  preferDataUrl?: boolean;
}

export function createLiveFrameController(dependencies: LiveFrameDependencies) {
  const imageCache = new Map<string, Promise<any>>();
  const videoCache = new Map<string, HTMLVideoElement>();
  const frameCache = createFrameCache();
  const videoIdleTimers = new Map<string, number>();
  function touchVideo(path: string) {
    if (!videoCache.has(path)) return;
    window.clearTimeout(videoIdleTimers.get(path));
    videoIdleTimers.set(path, window.setTimeout(() => {
      const video = videoCache.get(path);
      if (video) { video.pause(); video.removeAttribute("src"); video.load(); }
      videoCache.delete(path);
      imageCache.delete(path);
      videoIdleTimers.delete(path);
    }, 10000));
  }
  let broadcastProducer: any = null;

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

  function loadImage(path: string): Promise<any> {
    if (!path) return Promise.resolve(null);
    const cached = imageCache.get(path);
    if (cached) { touchVideo(path); return cached; }
    const video = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(path);
    const promise = new Promise<any>((resolve) => {
      const media: any = video ? document.createElement("video") : new Image();
      let settled = false;
      const timeout = window.setTimeout(() => finish(null), 8000);
      const finish = (result: any) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        media.onload = media.onloadeddata = media.onerror = null;
        if (!result) {
          imageCache.delete(path);
          if (video) { media.pause(); media.removeAttribute("src"); media.load(); videoCache.delete(path); }
        }
        resolve(result);
      };
      media.crossOrigin = "anonymous";
      media.onerror = () => finish(null);
      if (video) {
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.preload = "auto";
        media.onloadeddata = () => {
          media.play().catch(() => { /* A paused video still supplies its decoded first frame. */ });
          touchVideo(path);
          finish(media);
        };
        videoCache.set(path, media);
      } else media.onload = () => finish(media);
      media.src = path;
    });
    imageCache.set(path, promise);
    // Bound image/video resources even when users cycle through many scenes.
    while (imageCache.size > 96) {
      const oldest = imageCache.keys().next().value!;
      imageCache.delete(oldest);
      const video = videoCache.get(oldest);
      if (video) { video.pause(); video.removeAttribute("src"); video.load(); videoCache.delete(oldest); }
    }
    return promise;
  }

  function canvasToDataUrl(canvas: HTMLCanvasElement, type: string, quality?: number) {
    try {
      return canvas.toDataURL(type, quality);
    } catch (error) {
      if (type !== "image/png") {
        console.warn(`${dependencies.moduleId} | ${type} canvas encode failed, using PNG fallback.`, error);
        try {
          return canvas.toDataURL("image/png");
        } catch (pngError) {
          console.warn(`${dependencies.moduleId} | PNG canvas encode failed.`, pngError);
          return "";
        }
      }
      console.warn(`${dependencies.moduleId} | PNG canvas encode failed.`, error);
      return "";
    }
  }

  function canvasToFrameUrl(canvas: HTMLCanvasElement, type: string, quality: number, options: CaptureLiveFrameOptions = {}) {
    if (options.preferDataUrl) return Promise.resolve(canvasToDataUrl(canvas, type, quality));

    if (!canvas.toBlob || typeof URL === "undefined" || !URL.createObjectURL) {
      return Promise.resolve(canvasToDataUrl(canvas, type, quality));
    }

    return new Promise<string>((resolve) => {
      try {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
            return;
          }
          resolve(canvasToDataUrl(canvas, type, quality));
        }, type, quality);
      } catch (error) {
        console.warn(`${dependencies.moduleId} | ${type} canvas blob encode failed, using data URL fallback.`, error);
        resolve(canvasToDataUrl(canvas, type, quality));
      }
    });
  }

  async function captureSceneBackgroundFrame(camera: any = {}, options: CaptureLiveFrameOptions = {}) {
    const scene = dependencies.getSceneById(camera.sceneId);
    if (!scene) return "";
    const dimensions = getSceneDimensions(camera.sceneId);
    const region = Number.isFinite(camera.regionX) && Number.isFinite(camera.regionY)
      ? { x: camera.regionX, y: camera.regionY, width: camera.regionWidth, height: camera.regionHeight }
      : dimensions;
    // Keep the requested scene rectangle intact, including padding outside the background.
    const scale = Math.min(1, LIVE_FRAME_MAX_WIDTH / region.width, LIVE_FRAME_MAX_WIDTH / region.height);
    const width = Math.max(1, Math.round(region.width * scale));
    const height = Math.max(1, Math.round(region.height * scale));
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const context = output.getContext("2d");
    if (!context) return "";
    context.fillStyle = String(scene.backgroundColor ?? "#010505");
    context.fillRect(0, 0, width, height);
    const imagePath = dependencies.getSceneBackgroundPath(camera.sceneId) || camera.image;
    const image = await loadImage(imagePath);
    if (imagePath && !image) throw new Error("Camera background could not be loaded.");
    const cameraWithRegion = { ...camera, regionX: region.x, regionY: region.y, regionWidth: region.width, regionHeight: region.height };
    const tiles = sceneDocuments(scene.tiles ?? scene._source?.tiles);
    if (typeof scene.foreground === "string" && scene.foreground) tiles.push({
      x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.height,
      elevation: scene.foregroundElevation ?? Number.MAX_SAFE_INTEGER, sort: -Number.MAX_SAFE_INTEGER,
      texture: { src: scene.foreground }
    });
    const entries = getSceneDrawOrder(tiles, getCameraTokenDocuments(scene, cameraWithRegion));
    const sceneTransform = () => context.setTransform(width / region.width, 0, 0, height / region.height,
      -region.x * width / region.width, -region.y * height / region.height);
    sceneTransform();
    if (image) context.drawImage(image, dimensions.x, dimensions.y, dimensions.width, dimensions.height);
    for (const entry of entries) {
      if (entry.kind === "token") {
        context.setTransform(1, 0, 0, 1, 0, 0);
        await drawTokensOnFrame(context, cameraWithRegion, width, height, [entry.document]);
        continue;
      }
      const data: any = getTokenData(entry.document);
      const initialGeometry = getTileGeometry(entry.document);
      if (!initialGeometry || !initialGeometry.alpha) continue;
      if ((!data.texture?.fit || data.texture.fit === "fill") && !getBoundsIntersection(initialGeometry.bounds, region)) continue;
      const path = String(data.texture?.src ?? data.img ?? "");
      if (!path) continue;
      const media = await loadImage(path);
      if (!media) throw new Error("A camera tile could not be loaded. Check its media path and access.");
      if (media.tagName === "VIDEO") {
        media.loop = data.video?.loop !== false;
        if (data.video?.autoplay === false) media.pause();
        else if (media.paused && !media.ended) media.play().catch(() => {});
      }
      const geometry = getTileGeometry(entry.document, media)!;
      if (!getBoundsIntersection(geometry.bounds, region)) continue;
      sceneTransform();
      drawSceneTile(context, media, geometry);
    }
    return canvasToFrameUrl(output, "image/webp", STATIC_FRAME_WEBP_QUALITY, options);
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
      getEmbeddedDocumentCollection(scene, "Token"),
      scene.tokens,
      scene.getEmbeddedDocuments?.("Token"),
      scene.toObject?.().tokens,
      scene._source?.tokens
    ];

    for (const candidate of candidates) {
      const documents = normalizeTokenCollection(candidate);
      if (documents.length) return documents;
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

  function shouldDrawToken(tokenDocument: any) {
    const data = getTokenData(tokenDocument);
    if (!data) return false;
    if (data.hidden) return false;
    return true;
  }

  function getTokenImagePath(tokenDocument: any) {
    const data: any = getTokenData(tokenDocument);
    return String(
      tokenDocument?.getTextureSrc?.()
      ?? data?.texture?.src
      ?? data?.img
      ?? tokenDocument?.texture?.src
      ?? tokenDocument?.actor?.img
      ?? tokenDocument?.baseActor?.img
      ?? tokenDocument?.actor?.prototypeToken?.texture?.src
      ?? ""
    ).trim();
  }

  async function drawTokensOnFrame(context: CanvasRenderingContext2D | null, camera: any, frameWidth: number, frameHeight: number, documents?: any[]) {
    if (!context) return;
    const scene = dependencies.getSceneById(camera.sceneId);
    if (!scene) return;

    const cameraWithRegion = dependencies.applyLinkedRegionBounds(dependencies.normalizeCamera(camera));
    const region = {
      x: cameraWithRegion.regionX,
      y: cameraWithRegion.regionY,
      width: cameraWithRegion.regionWidth,
      height: cameraWithRegion.regionHeight
    };
    if (![region.x, region.y, region.width, region.height].every(Number.isFinite)) return;

    const gridSize = getSceneGridSize(scene);
    const sceneDimensions = getSceneDimensions(cameraWithRegion.sceneId);
    for (const tokenDocument of documents ?? getCameraTokenDocuments(scene, cameraWithRegion)) {
      if (!shouldDrawToken(tokenDocument)) continue;
      const bounds = getTokenDocumentBounds(tokenDocument, gridSize);
      const tokenVisibility = getVisibleTokenBounds(bounds, region, sceneDimensions);
      if (!tokenVisibility) continue;
      const { sourceBounds, visibleBounds } = tokenVisibility;

      const imagePath = getTokenImagePath(tokenDocument);
      const image = await loadImage(imagePath);
      const { dx, dy, dw, dh } = projectBoundsToFrame(visibleBounds, region, { width: frameWidth, height: frameHeight });

      context.save();
      context.globalAlpha = normalizeNullableNumber(tokenDocument.alpha) ?? normalizeNullableNumber(getTokenData(tokenDocument)?.alpha) ?? 1;
      if (image?.naturalWidth && image?.naturalHeight) {
        const sourceCrop = getTokenImageCrop(image, sourceBounds, visibleBounds);
        context.drawImage(image, sourceCrop.sx, sourceCrop.sy, sourceCrop.sw, sourceCrop.sh, dx, dy, dw, dh);
      } else {
        drawTokenMarker(context, tokenDocument, dx, dy, dw, dh);
      }
      context.restore();
    }
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

  function getVisibleTokenBounds(bounds: any, region: any, _sceneDimensions: any) {
    if (!bounds) return null;
    const visibleBounds = getBoundsIntersection(bounds, region);
    return visibleBounds ? { sourceBounds: bounds, visibleBounds } : null;
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
    // Resolve an unassigned camera before caching, so scene switches cannot reuse the old frame.
    const resolved = { ...normalized, sceneId: scene?.id ?? normalized.sceneId };
    return frameCache.get(JSON.stringify(resolved), () => captureSceneBackgroundFrame(resolved, { preferDataUrl: true }));
  }

  async function updateLiveFrameTarget(target: any, options: { broadcast?: boolean; requireRendered?: boolean } = {}) {
    if (!isCameraLive(target?.camera)) return;
    const generation = target.liveFrameGeneration;
    const frame = await captureLiveFrame(target.camera, {
      preferDataUrl: Boolean(dependencies.broadcastLiveFrame)
    });
    if (generation !== target.liveFrameGeneration || !canRefreshTarget(target, options)) return;
    if (!frame) { target.onFrameError?.(); return; }
    await target.updateLiveFrame?.(frame);
    if (generation !== target.liveFrameGeneration || !canRefreshTarget(target, options)) return;
    if (options.broadcast !== false) {
      dependencies.broadcastLiveFrame?.(dependencies.normalizeCamera(target.camera), frame);
    }
  }

  function canRefreshTarget(target: any, options: { requireRendered?: boolean } = {}) {
    if (!target || target.liveFrameStopped || document.visibilityState === "hidden") return false;
    if (options.requireRendered && target?.rendered === false) return false;
    return true;
  }

  function queueLiveFrameUpdate(target: any, options: { broadcast?: boolean; requireRendered?: boolean } = {}) {
    if (!canRefreshTarget(target, options) || target?.liveFrameRefreshPending) return;
    target.liveFrameRefreshPending = true;
    const generation = target.liveFrameGeneration;
    updateLiveFrameTarget(target, options).catch(error => {
      if (generation !== target.liveFrameGeneration) return;
      target.onFrameError?.(error);
      console.warn(`${dependencies.moduleId} | Camera refresh failed; retrying on next tick.`, error);
    }).finally(() => {
      if (generation === target.liveFrameGeneration) target.liveFrameRefreshPending = false;
    });
  }

  function stopRefreshTarget(target: any) {
    if (!target) return;
    target.liveFrameStopped = true;
    target.liveFrameGeneration = (target.liveFrameGeneration ?? 0) + 1;
    if (target.liveFrameTimer) window.clearInterval(target.liveFrameTimer);
    if (target.liveFrameVisibilityHandler) document.removeEventListener("visibilitychange", target.liveFrameVisibilityHandler);
    target.liveFrameTimer = null;
    target.liveFrameVisibilityHandler = null;
    target.liveFrameRefreshPending = false;
  }

  function startLocalLiveRefresh(app: any) {
    stopLocalLiveRefresh(app);
    if (!isCameraLive(app?.camera)) return;
    if (!dependencies.isFrameProducer()) return;
    app.liveFrameStopped = false;

    app.liveFrameVisibilityHandler = () => queueLiveFrameUpdate(app, {
      broadcast: false,
      requireRendered: true
    });
    document.addEventListener("visibilitychange", app.liveFrameVisibilityHandler);
    queueLiveFrameUpdate(app, {
      broadcast: false,
      requireRendered: true
    });
    app.liveFrameTimer = window.setInterval(() => {
      queueLiveFrameUpdate(app, {
        broadcast: false,
        requireRendered: true
      });
    }, LIVE_FRAME_INTERVAL_MS);
  }

  function stopLocalLiveRefresh(app: any) {
    stopRefreshTarget(app);
  }

  function startBroadcastLiveRefresh(camera: any) {
    stopBroadcastLiveRefresh();
    if (!isCameraLive(camera)) return;
    if (!dependencies.isFrameProducer()) return;

    broadcastProducer = {
      camera: dependencies.normalizeCamera(camera),
      liveFrameStopped: false,
      liveFrameGeneration: 0,
      liveFrameRefreshPending: false,
      liveFrameTimer: null,
      liveFrameVisibilityHandler: null
    };
    const producer = broadcastProducer;
    producer.liveFrameVisibilityHandler = () => queueLiveFrameUpdate(producer);
    document.addEventListener("visibilitychange", broadcastProducer.liveFrameVisibilityHandler);
    queueLiveFrameUpdate(broadcastProducer);
    broadcastProducer.liveFrameTimer = window.setInterval(() => {
      queueLiveFrameUpdate(producer);
    }, LIVE_FRAME_INTERVAL_MS);
  }

  function stopBroadcastLiveRefresh() {
    stopRefreshTarget(broadcastProducer);
    broadcastProducer = null;
  }

  return {
    captureLiveFrame,
    invalidateFrames: () => frameCache.clear(),
    startBroadcastLiveRefresh,
    startLocalLiveRefresh,
    stopBroadcastLiveRefresh,
    stopLocalLiveRefresh
  };
}
