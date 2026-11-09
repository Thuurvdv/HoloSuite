import { MODULE_ID, BUILD_VERSION, actorKey } from "./model.mjs";
declare const game: any;
declare const canvas: any;

export function authority() {
  return game.users.contents.filter((user: any) => user.active && user.isGM
    && user.getFlag?.(MODULE_ID, "transportVersion") === BUILD_VERSION)
    .sort((a: any, b: any) => a.id.localeCompare(b.id))[0];
}
export const isAuthority = () => authority()?.id === game.user.id;

export const LOOT_RANGE_SETTING = "lootRange";
export const DEFAULT_LOOT_RANGE = 15;
export function lootRange() {
  const value = game.settings.get(MODULE_ID, LOOT_RANGE_SETTING);
  return Number.isFinite(value) ? Math.max(0, value) : DEFAULT_LOOT_RANGE;
}

function tokenCenter(token: any, grid: any, position: { x: number; y: number }) {
  return token.getCenterPoint?.(position) ?? token.object?.getCenterPoint?.(position) ?? {
    x: position.x + token.width * (grid.sizeX ?? grid.size) / 2,
    y: position.y + token.height * (grid.sizeY ?? grid.size) / 2
  };
}

function tokenRangePoints(token: any, grid: any) {
  // V14 may expose the animated position on the prepared document.
  const { x, y } = token._source ?? token;
  const position = { x, y };
  if (grid.isSquare && grid.getOffsetRange) {
    // Use document bounds. Foundry's occupied-space query can exclude squares
    // based on client-side wall and level geometry, which the flat ruler ignores.
    const width = token.width * grid.size;
    const height = token.height * grid.size;
    const [i0, j0, i1, j1] = grid.getOffsetRange({ ...position, width, height });
    const points = [];
    for (let i = i0; i < i1; i++) {
      for (let j = j0; j < j1; j++) points.push(grid.getCenterPoint({ i, j }));
    }
    if (points.length) return points;
  }
  const occupied = token.getOccupiedGridSpaceOffsets?.({ ...position, level: null });
  if (occupied?.length) return occupied.map(({ i, j }: any) => grid.getCenterPoint({ i, j }));
  return [tokenCenter(token, grid, position)];
}

function withinLootRange(target: any, user: any, adapter: any, feet: number, recipient?: any) {
  const scene = target.parent;
  const grid = scene?.grid;
  if (!grid?.measurePath) return false;
  const units = grid.units?.trim().toLowerCase().replace(/\.$/, "");
  // Unlabeled or custom grids use the configured number as their scene distance.
  const limit = /^(m|meters?|metres?)$/.test(units ?? "") ? feet * 0.3048
    : /^(yd|yards?)$/.test(units ?? "") ? feet / 3 : feet;
  const destinations = tokenRangePoints(target, grid);
  return Array.from<any>(scene.tokens ?? []).some(token => {
    const actor = token.actor;
    if (token.id === target.id || token.hidden || !actor || !adapter.destination(actor)
      || !actor.testUserPermission(user, "OWNER") || (recipient && actorKey(actor) !== actorKey(recipient))) return false;
    // Match the flat distance ruler and use the nearest occupied spaces on a grid.
    return tokenRangePoints(token, grid).some(({ x, y }: any) => destinations.some((point: any) =>
      grid.measurePath([{ x, y }, { x: point.x, y: point.y }]).distance <= limit + 1e-8));
  });
}

// Conservative Basic Sight policy. GM clients do not maintain vision sources
// for uncontrolled player tokens, so construct an unregistered native source.
// It never enters the canvas source collection or changes GM token controls.
export function visible(token: any, user: any) {
  const scene = token.parent;
  if (canvas.scene?.id !== scene.id) return false;
  if (!scene.tokenVision) return true;
  const target = token.object;
  if (!target) return false;
  const config = (globalThis as any).CONFIG;
  if (token.hasStatusEffect?.(config.specialStatusEffects.INVISIBLE)) return false;
  return canvas.tokens.placeables.some((observer: any) => {
    if (observer.document.hidden || !observer.document.sight?.enabled
      || !observer.actor?.testUserPermission(user, "OWNER")) return false;
    if (observer.document.hasStatusEffect?.(config.specialStatusEffects.BLIND)) return false;
    let vision: any;
    try {
      const sight = observer.document.sight;
      const origin = observer.document.getVisionOrigin?.() ?? { ...observer.center, elevation: observer.document.elevation };
      vision = new config.Canvas.visionSourceClass({ object: observer, sourceId: `hololoot-${user.id}-${observer.id}` });
      vision.initialize({ x: origin.x, y: origin.y, elevation: origin.elevation,
        ...(observer.document.level != null ? { level: observer.document.level } : {}), rotation: observer.document.rotation,
        radius: observer.sightRange, lightRadius: observer.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: observer.externalRadius, angle: sight.angle, visionMode: sight.visionMode,
        color: sight.color, contrast: sight.contrast, saturation: sight.saturation,
        brightness: sight.brightness, attenuation: sight.attenuation });
      if (vision.isBlinded || !vision.los?.contains(target.center.x, target.center.y)) return false;
      if (vision.shape?.contains(target.center.x, target.center.y)) return true;
      const globalSource = canvas.environment?.globalLightSource;
      const globalLight = globalSource ? globalSource.active && globalSource.shape?.contains(target.center.x, target.center.y)
        : scene.globalLight && (scene.globalLightThreshold == null || scene.darkness <= scene.globalLightThreshold);
      if (globalLight && vision.light?.contains(target.center.x, target.center.y)) return true;
      return !!vision.light?.contains(target.center.x, target.center.y)
        && !!canvas.effects?.lightSources?.some((light: any) => light.active && light.shape?.contains(target.center.x, target.center.y));
    } catch { return false; }
    finally { vision?.destroy(); }
  });
}
export function environment(adapter?: any) {
  const automatic = game.settings.get(MODULE_ID, "zeroHP");
  const feet = adapter ? lootRange() : 0;
  return { combats: game.combats.contents, automatic, zeroHP: automatic, visible,
    inRange: feet > 0 ? (token: any, user: any, recipient?: any) => withinLootRange(token, user, adapter, feet, recipient) : undefined };
}
