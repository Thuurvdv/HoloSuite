import { ANIMATED_CELESTIAL_STYLES, normalizeMap } from "./galaxy-model";
import { getPlanetAppearance } from "./planet-presets";
import { TRAVEL_APPROVAL_OPTIONS } from "./travel-approval";

declare const game: any;

function canPlayerSeeSystem(system: any) {
  return system.visibility === "players";
}

function isSystemObscured(system: any, playerMode: boolean) {
  return playerMode && system.status === "undiscovered";
}

export function getDisplayIconStyle(type: string, iconStyle: string) {
  const typeIconFallbacks: Record<string, string> = { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" };
  return iconStyle === "planet" ? typeIconFallbacks[type] ?? iconStyle : iconStyle;
}

export function prepareMapForDisplay(map: any, { playerMode = false, selectedSystemId = null, selectedRouteId = null }: any = {}) {
  const normalized = normalizeMap(map);
  const systems = playerMode ? normalized.systems.filter(canPlayerSeeSystem) : normalized.systems;
  const visibleSystemIds = new Set(systems.map((system: any) => system.id));
  const factions = playerMode
    ? normalized.factions.filter((faction: any) => faction.visibility === "players")
    : normalized.factions;
  const factionLookup = new Map(factions.map((faction: any) => [faction.id, faction]));

  const displaySystems = systems.map((system: any) => {
    const faction: any = factionLookup.get(system.factionId);
    const obscured = isSystemObscured(system, playerMode);
    const displayType = obscured ? "unknown" : system.type;
    const displayIconStyle = obscured ? "diamond" : getDisplayIconStyle(displayType, system.iconStyle);
    const displayMarkerImage = obscured ? "" : system.markerImage;
    return {
      ...system,
      image: system.image,
      sceneIds: [...system.sceneIds],
      journalId: system.journalId,
      planetPreset: system.planetPreset,
      planetShape: system.planetShape,
      planetTexture: system.planetTexture,
      planetColor: system.planetColor,
      iconStyle: displayIconStyle,
      displayMarkerImage,
      hasCustomMarker: Boolean(displayMarkerImage),
      displayName: obscured ? "???" : system.name,
      displayDescription: obscured ? "Unresolved sensor contact. Details are not available." : system.description,
      displayType,
      displayStatus: obscured ? "undiscovered" : system.status,
      factionName: faction?.name ?? "Unaffiliated",
      factionColor: system.iconColor || faction?.color || "#58d8ff",
      obscured,
      isCurrent: system.id === normalized.currentSystemId,
      isSelected: system.id === selectedSystemId,
      gmOnly: system.visibility === "gm",
      animatedCelestial: !displayMarkerImage && ANIMATED_CELESTIAL_STYLES.includes(displayIconStyle),
      hasAlert: ["danger", "locked"].includes(obscured ? "undiscovered" : system.status),
      alertLabel: system.status === "danger" ? "Hazard advisory" : system.status === "locked" ? "Restricted access" : "",
      hasJournal: Boolean(!obscured && system.journalId),
      hasScenes: Boolean(!obscured && system.sceneIds.length),
      showImage: Boolean(!obscured && system.image),
      canInspectSystem: Boolean(getPlanetAppearance({ ...system, iconStyle: displayIconStyle, obscured }))
    };
  });

  const routes = normalized.routes
    .filter((route: any) => !playerMode || route.visibility === "players")
    .filter((route: any) => visibleSystemIds.has(route.fromSystemId) && visibleSystemIds.has(route.toSystemId))
    .map((route: any) => {
      const from = displaySystems.find((system: any) => system.id === route.fromSystemId);
      const to = displaySystems.find((system: any) => system.id === route.toSystemId);
      return {
        ...route,
        from,
        to,
        fromName: from?.displayName ?? route.fromSystemId,
        toName: to?.displayName ?? route.toSystemId,
        isSelected: route.id === selectedRouteId,
        connectsCurrent: route.fromSystemId === normalized.currentSystemId || route.toSystemId === normalized.currentSystemId,
        gmOnly: route.visibility === "gm"
      };
    });

  const selectedRoute = routes.find((route: any) => route.id === selectedRouteId) ?? null;
  const selectedSystem = selectedRoute ? null : displaySystems.find((system: any) => system.id === selectedSystemId) ?? null;
  if (selectedSystem) selectedSystem.isSelected = true;
  const currentSystem = displaySystems.find((system: any) => system.id === normalized.currentSystemId) ?? displaySystems[0] ?? null;
  const selectedTravelRoute = selectedSystem && currentSystem && selectedSystem.id !== currentSystem.id
    ? routes.find((route: any) => (
      (route.fromSystemId === currentSystem.id && route.toSystemId === selectedSystem.id)
      || (route.toSystemId === currentSystem.id && route.fromSystemId === selectedSystem.id)
    ))
    : null;
  if (selectedSystem) {
    selectedSystem.canTravel = Boolean(selectedTravelRoute);
    selectedSystem.travelRouteId = selectedTravelRoute?.id ?? "";
    selectedSystem.isCurrent = selectedSystem.id === currentSystem?.id;
    selectedSystem.isDestination = Boolean(selectedTravelRoute && !selectedSystem.isCurrent);
  }
  routes.forEach((route: any) => { route.isActive = route.isSelected || route.id === selectedTravelRoute?.id; });

  return {
    ...normalized,
    systems: displaySystems,
    routes,
    factions,
    selectedSystem,
    selectedRoute,
    currentSystem,
    selectedType: selectedRoute ? "route" : selectedSystem ? "system" : null,
    playerMode,
    isGM: game.user?.isGM ?? false,
    canEdit: game.user?.isGM && !playerMode
  };
}

export function prepareMapForManager(map: any) {
  if (!map) return null;
  const normalized = normalizeMap(map);
  const systemsById = new Map<string, any>(normalized.systems.map((system: any) => [system.id, system]));
  const factionsById = new Map<string, any>(normalized.factions.map((faction: any) => [faction.id, faction]));
  return {
    ...normalized,
    travelApprovalModeLabel: TRAVEL_APPROVAL_OPTIONS.find(option => option.value === normalized.travelApprovalMode)?.label ?? "Unanimous agreement",
    systems: normalized.systems.map((system: any) => ({
      ...system,
      factionName: factionsById.get(system.factionId)?.name ?? "Unaffiliated"
    })),
    routes: [
      ...normalized.routes.map((route: any) => ({
        ...route,
        systemId: "",
        scopeLabel: "Galaxy route",
        fromName: systemsById.get(route.fromSystemId)?.name ?? route.fromSystemId,
        toName: systemsById.get(route.toSystemId)?.name ?? route.toSystemId
      })),
      ...normalized.systems.flatMap((system: any) => {
        const locationsById = new Map<string, any>(system.objects.map((location: any) => [location.id, location]));
        return system.routes.map((route: any) => ({
          ...route,
          systemId: system.id,
          scopeLabel: `Inside ${system.name}`,
          fromName: locationsById.get(route.fromSystemId)?.name ?? route.fromSystemId,
          toName: locationsById.get(route.toSystemId)?.name ?? route.toSystemId
        }));
      })
    ]
  };
}
