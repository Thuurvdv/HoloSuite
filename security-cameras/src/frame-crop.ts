import type { SecurityCamera } from "./camera-model";
import type { Bounds } from "./region-geometry";

export interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface SceneDimensions extends Bounds {}

export type TransformRegionFallback = (camera: SecurityCamera) => CropRect | null;

function hasCameraRegion(camera: Pick<SecurityCamera, "regionX" | "regionY" | "regionWidth" | "regionHeight">): boolean {
  return Number.isFinite(camera.regionX) && Number.isFinite(camera.regionY);
}

export function getFullSourceCrop(source: Size): CropRect {
  return {
    sx: 0,
    sy: 0,
    sw: source.width,
    sh: source.height
  };
}

export function getCameraCrop(
  source: Size,
  camera: SecurityCamera,
  sceneSize: Size | null,
  transformFallback?: TransformRegionFallback
): CropRect {
  if (!hasCameraRegion(camera)) return getFullSourceCrop(source);

  if (
    sceneSize?.width
    && sceneSize.height
    && source.width >= sceneSize.width * 0.75
    && source.height >= sceneSize.height * 0.75
  ) {
    const scaleX = source.width / sceneSize.width;
    const scaleY = source.height / sceneSize.height;
    return {
      sx: (camera.regionX ?? 0) * scaleX,
      sy: (camera.regionY ?? 0) * scaleY,
      sw: camera.regionWidth * scaleX,
      sh: camera.regionHeight * scaleY
    };
  }

  return transformFallback?.(camera) ?? getFullSourceCrop(source);
}

export function clampCrop(crop: CropRect, source: Size): CropRect {
  const sx = Math.max(0, Math.min(source.width - 1, Math.round(crop.sx)));
  const sy = Math.max(0, Math.min(source.height - 1, Math.round(crop.sy)));
  const sw = Math.max(1, Math.min(source.width - sx, Math.round(crop.sw)));
  const sh = Math.max(1, Math.min(source.height - sy, Math.round(crop.sh)));
  return { sx, sy, sw, sh };
}

export function getCropForSceneImage(image: Size, camera: SecurityCamera, sceneDimensions: SceneDimensions): CropRect {
  if (!hasCameraRegion(camera)) return getFullSourceCrop(image);

  const scaleX = image.width / sceneDimensions.width;
  const scaleY = image.height / sceneDimensions.height;

  return {
    sx: ((camera.regionX ?? 0) - sceneDimensions.x) * scaleX,
    sy: ((camera.regionY ?? 0) - sceneDimensions.y) * scaleY,
    sw: camera.regionWidth * scaleX,
    sh: camera.regionHeight * scaleY
  };
}

export function getScaledOutputSize(crop: CropRect, maxWidth: number): Size {
  const scale = Math.min(1, maxWidth / crop.sw);
  return {
    width: Math.max(1, Math.round(crop.sw * scale)),
    height: Math.max(1, Math.round(crop.sh * scale))
  };
}
