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
  getTokenSceneBounds as getTokenDocumentBounds,
  intersectsBounds,
  projectBoundsToFrame
} from "./token-projection";

const LIVE_FRAME_INTERVAL_MS = 1250;
const LIVE_FRAME_MAX_WIDTH = 960;

interface LiveFrameDependencies {
  applyLinkedRegionBounds(camera: SecurityCamera): SecurityCamera;
  getSceneBackgroundPath(sceneId?: string): string;
  getSceneById(sceneId?: string): any;
  moduleId: string;
  normalizeCamera(camera: any): SecurityCamera;
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
    const dimensions = isActiveScene ? canvas.dimensions : null;
    return {
      x: normalizeNullableNumber(dimensions?.sceneX ?? dimensions?.sceneRect?.x) ?? 0,
      y: normalizeNullableNumber(dimensions?.sceneY ?? dimensions?.sceneRect?.y) ?? 0,
      width: normalizePositiveNumber(dimensions?.sceneWidth ?? dimensions?.sceneRect?.width ?? scene?.width, DEFAULT_CAMERA_REGION_WIDTH),
      height: normalizePositiveNumber(dimensions?.sceneHeight ?? dimensions?.sceneRect?.height ?? scene?.height, DEFAULT_CAMERA_REGION_HEIGHT)
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

  async function captureSceneBackgroundFrame(camera: any = {}) {
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

    try {
      return output.toDataURL("image/webp", 0.72);
    } catch (error) {
      console.warn(`${dependencies.moduleId} | Scene background crop failed.`, error);
      return "";
    }
  }

  function getSceneGridSize(scene: any) {
    const isActiveScene = scene?.id && canvas?.scene?.id === scene.id;
    return normalizePositiveNumber(
      isActiveScene
        ? canvas?.dimensions?.size ?? canvas?.grid?.size ?? scene?.grid?.size
        : scene?.grid?.size,
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

    const tokenCollection = scene.tokens;
    if (Array.isArray(tokenCollection)) return tokenCollection;
    if (Array.isArray(tokenCollection?.contents)) return tokenCollection.contents;
    return Array.from(tokenCollection ?? []);
  }

  function shouldDrawToken(tokenDocument: any) {
    if (!tokenDocument) return false;
    if (tokenDocument.hidden) return false;
    return true;
  }

  function getTokenImagePath(tokenDocument: any) {
    return String(tokenDocument?.texture?.src ?? tokenDocument?.actor?.img ?? tokenDocument?.baseActor?.img ?? "").trim();
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
    for (const tokenDocument of getSceneTokenDocuments(scene)) {
      if (!shouldDrawToken(tokenDocument)) continue;
      const bounds = getTokenDocumentBounds(tokenDocument, gridSize);
      if (!bounds || !intersectsBounds(bounds, region)) continue;

      const imagePath = getTokenImagePath(tokenDocument);
      const image = await loadImage(imagePath);
      if (!image?.naturalWidth || !image?.naturalHeight) continue;

      const { dx, dy, dw, dh } = projectBoundsToFrame(bounds, region, { width: frameWidth, height: frameHeight });

      context.save();
      context.globalAlpha = tokenDocument.alpha ?? 1;
      context.drawImage(image, dx, dy, dw, dh);
      context.restore();
    }
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

  function captureCanvasFrame(camera = {}) {
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

    try {
      return output.toDataURL("image/webp", 0.62);
    } catch (error) {
      console.warn(`${dependencies.moduleId} | WebP canvas capture failed, using PNG fallback.`, error);
      return output.toDataURL("image/png");
    }
  }

  async function updateLocalLiveFrame(app: any) {
    if (!isCameraLive(app?.camera)) return;
    let frame = "";
    frame = await captureSceneBackgroundFrame(app.camera);
    if (!frame && canCaptureLiveCamera(app.camera)) frame = captureCanvasFrame(app.camera);
    if (!frame) return;
    await app.updateLiveFrame?.(frame);
  }

  function stopLocalLiveRefresh(app: any) {
    if (!app?.liveFrameTimer) return;
    window.clearInterval(app.liveFrameTimer);
    app.liveFrameTimer = null;
  }

  function startLocalLiveRefresh(app: any) {
    stopLocalLiveRefresh(app);
    if (!isCameraLive(app?.camera)) return;

    updateLocalLiveFrame(app);
    app.liveFrameTimer = window.setInterval(() => {
      updateLocalLiveFrame(app);
    }, LIVE_FRAME_INTERVAL_MS);
  }

  return {
    startLocalLiveRefresh,
    stopLocalLiveRefresh
  };
}
