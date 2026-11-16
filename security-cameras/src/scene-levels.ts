import { sceneDocuments } from "./scene-compositor";

export function isOnSceneLevel(document: any, levelId: string): boolean {
  const levels = document?.levels ?? document?._source?.levels;
  if (Array.isArray(levels)) return !levels.length || levels.includes(levelId);
  return !levels?.size || levels.has(levelId);
}

export function getCameraSceneLevel(scene: any, levelId = "", region?: any) {
  if (!scene?.levels) return null;
  const levels = sceneDocuments(scene.levels);
  if (levelId) return levels.find(level => level.id === levelId) ?? null;

  const initial = scene.initialLevel ?? levels[0];
  if (initial && isOnSceneLevel(region, initial.id)) return initial;
  return levels.find(level => isOnSceneLevel(region, level.id)) ?? null;
}
