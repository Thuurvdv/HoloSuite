import type { SecurityCamera } from "./camera-model";
import {
  DEFAULT_CAMERA,
  DEFAULT_CAMERA_REGION_HEIGHT,
  DEFAULT_CAMERA_REGION_WIDTH,
  normalizeNullableNumber,
  normalizePositiveNumber
} from "./camera-model";
import {
  clampCrop,
  getCameraCrop as getCameraCropRect,
  getCropForSceneImage as getSceneImageCropRect,
  getFullSourceCrop,
  getScaledOutputSize
} from "./frame-crop";
import {
  getTokenData,
  getTokenSceneBounds as getTokenDocumentBounds,
  intersectsBounds,
  projectBoundsToFrame
} from "./token-projection";

const LIVE_FRAME_INTERVAL_MS = 1250;
const LIVE_FRAME_MAX_WIDTH = 960;
const LIVE_FRAME_WEBP_QUALITY = 0.62;
const STATIC_FRAME_WEBP_QUALITY = 0.72;
const TOKEN_MARKER_MIN_SIZE = 18;

interface LiveFrameDependencies {
  applyLinkedRegionBounds(camera: SecurityCamera): SecurityCamera;
  broadcastLiveFrame?(camera: SecurityCamera, liveFrame: string): void;
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

  function isCameraLive(camera: any) {
    const normalized = dependencies.normalizeCamera(camera);
    return normalized.feedSource === "live" && normalized.status !== "offline" && normalized.status !== "restricted";
  }

  function canCaptureLiveCamera(camera: any) {
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
      console.warn(`${dependencies.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, error);
    }

    return renderer?.view ?? canvas?.app?.view ?? null;
  }

  function getCameraCrop(sourceCanvas: any, camera: any) {
    const cameraWithRegion = dependencies.applyLinkedRegionBounds(dependencies.normalizeCamera(camera));
    const sceneWidth = canvas.dimensions?.width ?? canvas.scene?.width ?? 0;
    const sceneHeight = canvas.dimensions?.height ?? canvas.scene?.height ?? 0;
    const sceneSize = sceneWidth && sceneHeight ? { width: sceneWidth, height: sceneHeight } : null;

    return getCameraCropRect(sourceCanvas, cameraWithRegion, sceneSize, () => {
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
      return null;
    });
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

  function getCropForSceneImage(image: any, camera: any) {
    const cameraWithRegion = dependencies.applyLinkedRegionBounds(dependencies.normalizeCamera(camera));
    if (!Number.isFinite(cameraWithRegion.regionX) || !Number.isFinite(cameraWithRegion.regionY)) {
      return getFullSourceCrop({ width: image.naturalWidth, height: image.naturalHeight });
    }

    const sceneDimensions = getSceneDimensions(cameraWithRegion.sceneId);
    return getSceneImageCropRect({ width: image.naturalWidth, height: image.naturalHeight }, cameraWithRegion, sceneDimensions);
  }

  function loadImage(path: string) {
    if (!path) return Promise.resolve(null);
    if (imageCache.has(path)) return imageCache.get(path)!;

    const promise = new Promise((resolve) => {
      const finish = (image: any) => resolve(image);
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
    const sceneBackground = dependencies.getSceneBackgroundPath(camera.sceneId);
    const imagePath = sceneBackground || camera.image;
    const image = await loadImage(imagePath);
    if (!image?.naturalWidth || !image?.naturalHeight) return "";

    const crop = clampCrop(getCropForSceneImage(image, camera), {
      width: image.naturalWidth,
      height: image.naturalHeight
    });
    const { width, height } = getScaledOutputSize(crop, LIVE_FRAME_MAX_WIDTH);
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const context = output.getContext("2d");
    context?.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
    await drawTokensOnFrame(context, camera, width, height);

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
    if (scene.id && canvas?.scene?.id === scene.id) {
      return (canvas.tokens?.placeables ?? [])
        .map((token: any) => token?.document)
        .filter(Boolean);
    }

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

  async function drawTokensOnFrame(context: CanvasRenderingContext2D | null, camera: any, frameWidth: number, frameHeight: number) {
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
    for (const tokenDocument of getSceneTokenDocuments(scene)) {
      if (!shouldDrawToken(tokenDocument)) continue;
      const bounds = getTokenDocumentBounds(tokenDocument, gridSize);
      const visibleBounds = getVisibleTokenBounds(bounds, region, sceneDimensions);
      if (!visibleBounds) continue;

      const imagePath = getTokenImagePath(tokenDocument);
      const image = await loadImage(imagePath);
      const { dx, dy, dw, dh } = projectBoundsToFrame(visibleBounds, region, { width: frameWidth, height: frameHeight });

      context.save();
      context.globalAlpha = normalizeNullableNumber(tokenDocument.alpha) ?? normalizeNullableNumber(getTokenData(tokenDocument)?.alpha) ?? 1;
      if (image?.naturalWidth && image?.naturalHeight) {
        context.drawImage(image, dx, dy, dw, dh);
      } else {
        drawTokenMarker(context, tokenDocument, dx, dy, dw, dh);
      }
      context.restore();
    }
  }

  function getVisibleTokenBounds(bounds: any, region: any, sceneDimensions: any) {
    if (!bounds) return null;
    if (intersectsBounds(bounds, region)) return bounds;

    const offsetX = normalizeNullableNumber(sceneDimensions?.x) ?? 0;
    const offsetY = normalizeNullableNumber(sceneDimensions?.y) ?? 0;
    if (!offsetX && !offsetY) return null;

    const withoutOffset = {
      ...bounds,
      x: bounds.x - offsetX,
      y: bounds.y - offsetY
    };
    if (intersectsBounds(withoutOffset, region)) return withoutOffset;

    const withOffset = {
      ...bounds,
      x: bounds.x + offsetX,
      y: bounds.y + offsetY
    };
    return intersectsBounds(withOffset, region) ? withOffset : null;
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

  function isMostlyBlackCanvas(sourceCanvas: HTMLCanvasElement) {
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

  async function captureCanvasFrame(camera = {}, options: CaptureLiveFrameOptions = {}) {
    const sourceCanvas = getRenderedCanvasSnapshot();
    if (!sourceCanvas?.width || !sourceCanvas?.height) return "";

    const crop = clampCrop(getCameraCrop(sourceCanvas, camera), sourceCanvas);
    const { width, height } = getScaledOutputSize(crop, LIVE_FRAME_MAX_WIDTH);
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const context = output.getContext("2d");
    context?.drawImage(sourceCanvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);

    if (isMostlyBlackCanvas(output)) return "";

    return canvasToFrameUrl(output, "image/webp", LIVE_FRAME_WEBP_QUALITY, options);
  }

  async function captureLiveFrame(camera: any = {}, options: CaptureLiveFrameOptions = {}) {
    let frame = await captureSceneBackgroundFrame(camera, options);
    if (!frame && canCaptureLiveCamera(camera)) frame = await captureCanvasFrame(camera, options);
    return frame;
  }

  async function updateLocalLiveFrame(app: any) {
    if (!isCameraLive(app?.camera)) return;
    const frame = await captureLiveFrame(app.camera, {
      preferDataUrl: Boolean(dependencies.broadcastLiveFrame)
    });
    if (!frame) return;
    if (!canRefreshVisibleFrame(app)) return;
    await app.updateLiveFrame?.(frame);
    dependencies.broadcastLiveFrame?.(dependencies.normalizeCamera(app.camera), frame);
  }

  function canRefreshVisibleFrame(app: any) {
    if (document.visibilityState === "hidden") return false;
    if (app?.rendered === false) return false;
    return true;
  }

  function queueLocalLiveFrameUpdate(app: any) {
    if (!canRefreshVisibleFrame(app) || app?.liveFrameRefreshPending) return;
    app.liveFrameRefreshPending = true;
    updateLocalLiveFrame(app).finally(() => {
      app.liveFrameRefreshPending = false;
    });
  }

  function stopLocalLiveRefresh(app: any) {
    if (!app) return;
    if (app.liveFrameTimer) window.clearInterval(app.liveFrameTimer);
    if (app.liveFrameVisibilityHandler) document.removeEventListener("visibilitychange", app.liveFrameVisibilityHandler);
    app.liveFrameTimer = null;
    app.liveFrameVisibilityHandler = null;
    app.liveFrameRefreshPending = false;
  }

  function startLocalLiveRefresh(app: any) {
    stopLocalLiveRefresh(app);
    if (!isCameraLive(app?.camera)) return;
    if (!dependencies.isFrameProducer()) return;

    app.liveFrameVisibilityHandler = () => queueLocalLiveFrameUpdate(app);
    document.addEventListener("visibilitychange", app.liveFrameVisibilityHandler);
    queueLocalLiveFrameUpdate(app);
    app.liveFrameTimer = window.setInterval(() => {
      queueLocalLiveFrameUpdate(app);
    }, LIVE_FRAME_INTERVAL_MS);
  }

  return {
    captureLiveFrame,
    startLocalLiveRefresh,
    stopLocalLiveRefresh
  };
}
