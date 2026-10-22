import { getTokenData } from "./token-projection.js";

const number = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function sceneDocuments(collection: any): any[] {
  if (!collection) return [];
  const source = collection.contents ?? (typeof collection.values === "function" ? Array.from(collection.values()) : collection);
  return Array.isArray(source) ? source.map(item => item?.document ?? item).filter(Boolean) : [];
}

/** A camera has no selected token: roofs retain their document opacity, not GM hover occlusion. */
export function getSceneDrawOrder(tiles: any[], tokens: any[]) {
  return [
    ...tiles.map(document => ({ kind: "tile" as const, document })),
    ...tokens.map(document => ({ kind: "token" as const, document }))
  ].filter(entry => !getTokenData(entry.document)?.hidden).sort((a, b) => {
    const left: any = getTokenData(a.document);
    const right: any = getTokenData(b.document);
    return number(left.elevation, left.overhead ? 1 : 0) - number(right.elevation, right.overhead ? 1 : 0)
      || (a.kind === "tile" ? 0 : 1) - (b.kind === "tile" ? 0 : 1)
      || number(left.sort) - number(right.sort);
  });
}

export function getTileGeometry(document: any, media?: any) {
  const tile: any = getTokenData(document);
  if (!tile || tile.hidden || !(tile.width > 0) || !(tile.height > 0)) return null;
  let width = number(tile.width), height = number(tile.height);
  const nativeWidth = media?.naturalWidth || media?.videoWidth || width;
  const nativeHeight = media?.naturalHeight || media?.videoHeight || height;
  const fit = tile.texture?.fit ?? "fill";
  const ratio = fit === "cover" ? Math.max(width / nativeWidth, height / nativeHeight)
    : fit === "contain" ? Math.min(width / nativeWidth, height / nativeHeight)
    : fit === "width" ? width / nativeWidth : fit === "height" ? height / nativeHeight : null;
  if (ratio !== null) { width = nativeWidth * ratio; height = nativeHeight * ratio; }
  const anchorX = number(tile.texture?.anchorX, 0.5), anchorY = number(tile.texture?.anchorY, 0.5);
  const scaleX = number(tile.texture?.scaleX, 1), scaleY = number(tile.texture?.scaleY, 1);
  const rotation = number(tile.rotation) * Math.PI / 180;
  const cx = number(tile.x) + number(tile.width) * number(tile.anchorX, 0.5),
    cy = number(tile.y) + number(tile.height) * number(tile.anchorY, 0.5);
  const corners = [[-width * anchorX, -height * anchorY], [width * (1 - anchorX), -height * anchorY],
    [width * (1 - anchorX), height * (1 - anchorY)], [-width * anchorX, height * (1 - anchorY)]]
    .map(([x, y]) => ({ x: cx + x * scaleX * Math.cos(rotation) - y * scaleY * Math.sin(rotation),
      y: cy + x * scaleX * Math.sin(rotation) + y * scaleY * Math.cos(rotation) }));
  const minX = Math.min(...corners.map(p => p.x)), minY = Math.min(...corners.map(p => p.y));
  return { width, height, anchorX, anchorY, scaleX, scaleY, rotation, cx, cy,
    alpha: Math.max(0, Math.min(1, number(tile.alpha, 1))),
    bounds: { x: minX, y: minY, width: Math.max(...corners.map(p => p.x)) - minX,
      height: Math.max(...corners.map(p => p.y)) - minY } };
}

export function drawSceneTile(context: CanvasRenderingContext2D, media: CanvasImageSource, geometry: NonNullable<ReturnType<typeof getTileGeometry>>) {
  context.save();
  try {
    context.globalAlpha = geometry.alpha;
    context.translate(geometry.cx, geometry.cy);
    context.rotate(geometry.rotation);
    context.scale(geometry.scaleX, geometry.scaleY);
    context.drawImage(media, -geometry.width * geometry.anchorX, -geometry.height * geometry.anchorY, geometry.width, geometry.height);
  } finally { context.restore(); }
}
