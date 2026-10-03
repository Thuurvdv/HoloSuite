import {
  TRAVEL_ANIMATION_MS,
  TRAVEL_REQUEST_TIMEOUT_MS,
  getEffectiveObjectVisibility,
  normalizeMap,
  randomId
} from "./galaxy-model";
import { SOCKET_NAME } from "./constants";
import { escapeHtml, getHtmlElement } from "./dom-utils";
import { evaluateTravelApproval, getTravelElectorate, TRAVEL_APPROVAL_OPTIONS } from "./travel-approval";

declare const Dialog: any;
declare const game: any;
declare const ui: any;

interface TravelDependencies {
  getRawMap: (mapId: string) => any;
  setCurrentSystem: (mapId: string, systemId: string) => Promise<any>;
  setCurrentObject: (mapId: string, systemId: string, objectId: string) => Promise<any>;
  getOpenMapViews: (mapId: string) => any[];
  getAppHtml: (app: any) => HTMLElement | null;
  notifyInfo: (message: string) => void;
  notifyError: (message: string) => void;
  getActiveUsers: () => any[];
  getPrimaryGM: () => any;
  isPrimaryGM: () => boolean;
}

export function createTravelService(deps: TravelDependencies) {
  const {
    getRawMap, setCurrentSystem, setCurrentObject, getOpenMapViews, getAppHtml,
    notifyInfo, notifyError, getActiveUsers, getPrimaryGM, isPrimaryGM
  } = deps;
  const pendingTravelRequests = new Map<string, any>();
  const promptedTravelRequests = new Set<string>();
  const travelRequestPrompts = new Map<string, any>();
  const latestTravelProgress = new Map<string, any>();

  function getTravelRoute(map: any, fromSystemId: string, toSystemId: string) {
    return map.routes.find((route: any) => (
      (route.fromSystemId === fromSystemId && route.toSystemId === toSystemId)
      || (route.toSystemId === fromSystemId && route.fromSystemId === toSystemId)
    )) ?? null;
  }

  function buildTravelRequest(mapId: string, destinationSystemId: string) {
    const rawMap = getRawMap(mapId);
    if (!rawMap) { notifyError(`Map "${mapId}" was not found.`); return null; }
    const map = normalizeMap(rawMap);
    const from = map.systems.find((system: any) => system.id === map.currentSystemId);
    const to = map.systems.find((system: any) => system.id === destinationSystemId);
    if (!to) { notifyError(`System "${destinationSystemId}" was not found.`); return null; }
    if (!from) { notifyError("This map does not have a current location yet. Ask the GM to set one first."); return null; }
    if (from.id === to.id) { notifyInfo(`${to.name} is already the current location.`); return null; }
    if (map.visibility !== "players" || from.visibility !== "players" || to.visibility !== "players") {
      notifyError("That travel destination is not visible to players."); return null;
    }
    const route = getTravelRoute(map, from.id, to.id);
    if (!route || route.visibility !== "players") { notifyError(`No player-visible direct route from ${from.name} to ${to.name}.`); return null; }
    const primaryGM = getPrimaryGM();
    if (!primaryGM) { notifyError("A GM must be online to approve player travel."); return null; }
    const electorate = getTravelElectorate(getActiveUsers(), game.user.id, primaryGM, map.travelApprovalMode);
    return {
      action: "travel-request", requestId: randomId("travel"), mapId, mapTitle: map.title,
      fromSystemId: from.id, fromName: from.name, toSystemId: to.id, toName: to.name,
      routeId: route.id, routeType: route.type, travelTime: route.travelTime, fuelCost: route.fuelCost,
      requesterId: game.user.id, requesterName: game.user.name, ...electorate
    };
  }

  function requestTravelToSystem(mapId: string, destinationSystemId: string) {
    const request = buildTravelRequest(mapId, destinationSystemId);
    if (!request) return null;
    game.socket.emit(SOCKET_NAME, request);
    notifyInfo(`Travel request sent: ${request.fromName} to ${request.toName}.`);
    return request;
  }

  function buildObjectTravelRequest(mapId: string, systemId: string, destinationObjectId: string) {
    const rawMap = getRawMap(mapId);
    if (!rawMap) { notifyError(`Map "${mapId}" was not found.`); return null; }
    const map = normalizeMap(rawMap);
    const system = map.systems.find((candidate: any) => candidate.id === systemId);
    const from = system?.objects.find((object: any) => object.id === map.currentLocation.objectId);
    const to = system?.objects.find((object: any) => object.id === destinationObjectId);
    if (!system || map.currentLocation.systemId !== system.id || !from) { notifyError("The current location is not inside this system."); return null; }
    if (!to) { notifyError(`Destination "${destinationObjectId}" was not found.`); return null; }
    if (from.id === to.id) { notifyInfo(`${to.name} is already the current location.`); return null; }
    if (map.visibility !== "players" || system.visibility !== "players"
      || getEffectiveObjectVisibility(system, from) !== "players"
      || getEffectiveObjectVisibility(system, to) !== "players") {
      notifyError("That travel destination is not visible to players."); return null;
    }
    const route = getTravelRoute({ routes: system.routes }, from.id, to.id);
    if (!route || route.visibility !== "players") { notifyError(`No player-visible direct route from ${from.name} to ${to.name}.`); return null; }
    const primaryGM = getPrimaryGM();
    if (!primaryGM) { notifyError("A GM must be online to approve player travel."); return null; }
    const electorate = getTravelElectorate(getActiveUsers(), game.user.id, primaryGM, map.travelApprovalMode);
    return {
      action: "travel-request", travelScope: "object", requestId: randomId("travel"), mapId, mapTitle: map.title,
      systemId: system.id, fromObjectId: from.id, fromName: from.name, toObjectId: to.id, toName: to.name,
      routeId: route.id, routeType: route.type, travelTime: route.travelTime, fuelCost: route.fuelCost,
      requesterId: game.user.id, requesterName: game.user.name, ...electorate
    };
  }

  function requestTravelToObject(mapId: string, systemId: string, destinationObjectId: string) {
    const request = buildObjectTravelRequest(mapId, systemId, destinationObjectId);
    if (!request) return null;
    game.socket.emit(SOCKET_NAME, request);
    notifyInfo(`Travel request sent: ${request.fromName} to ${request.toName}.`);
    return request;
  }

  function updateTravelPrompt(requestId: string, progress: any) {
    if (!progress) return;
    latestTravelProgress.set(requestId, progress);
    const root = travelRequestPrompts.get(requestId)?.root;
    if (!root) return;
    const count = root.querySelector("[data-travel-progress-count]");
    const pending = root.querySelector("[data-travel-progress-pending]");
    const bar = root.querySelector("[data-travel-progress-bar]");
    if (count) count.textContent = `${progress.acceptedCount} of ${progress.requiredApprovals} approvals`;
    if (pending) pending.textContent = progress.pendingNames?.length ? `Waiting for: ${progress.pendingNames.join(", ")}` : "All votes received";
    if (bar) bar.style.width = `${Math.min(100, (progress.acceptedCount / Math.max(1, progress.requiredApprovals)) * 100)}%`;
  }

  function promptForTravelRequest(payload: any) {
    if (!payload?.requestId || payload.requesterId === game.user?.id || !payload.voterIds?.includes(game.user?.id)) return;
    if (promptedTravelRequests.has(payload.requestId)) return;
    promptedTravelRequests.add(payload.requestId);
    let responded = false;
    let resolved = false;
    let dialog: any = null;
    const respond = (accepted: boolean) => {
      if (responded) return;
      responded = true;
      const vote = { action: "travel-vote", requestId: payload.requestId, mapId: payload.mapId,
        userId: game.user.id, userName: game.user.name, accepted };
      game.socket.emit(SOCKET_NAME, vote);
      handleTravelVote(vote);
    };
    const modeLabel = TRAVEL_APPROVAL_OPTIONS.find(option => option.value === payload.approvalMode)?.label ?? "Unanimous agreement";
    dialog = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${escapeHtml(payload.requesterName)}</strong> wants to travel on <strong>${escapeHtml(payload.mapTitle)}</strong>.</p>
        <p>${escapeHtml(payload.fromName)} &rarr; ${escapeHtml(payload.toName)}</p>
        <p class="gmf-travel-request__meta">${escapeHtml(payload.routeType)} route / ${escapeHtml(payload.travelTime || "Unknown time")} / Fuel ${escapeHtml(payload.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${escapeHtml(modeLabel)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (html: any) => {
        const root = getHtmlElement(html);
        const state = travelRequestPrompts.get(payload.requestId);
        if (state) state.root = root;
        updateTravelPrompt(payload.requestId, latestTravelProgress.get(payload.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => respond(true) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => respond(false) }
      },
      default: "accept",
      close: () => { travelRequestPrompts.delete(payload.requestId); if (!resolved) respond(false); }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) });
    travelRequestPrompts.set(payload.requestId, { root: null, resolve: () => { resolved = true; responded = true; dialog?.close(); } });
    dialog.render(true);
  }

  const isPrimaryGMMessage = (payload: any) => Boolean(payload?.coordinatorId && payload.coordinatorId === getPrimaryGM()?.id);

  function getTravelProgressPayload(pending: any) {
    const evaluation = evaluateTravelApproval(pending);
    return {
      action: "travel-progress", requestId: pending.requestId, mapId: pending.mapId, requesterId: pending.requesterId,
      approvalMode: pending.approvalMode, acceptedCount: evaluation.acceptedCount, declinedCount: evaluation.declinedCount,
      requiredApprovals: evaluation.required, participantCount: pending.participantCount,
      pendingNames: evaluation.pendingIds.map((id: string) => pending.voterNames?.[id] || "Navigator"), coordinatorId: game.user.id
    };
  }

  function broadcastTravelProgress(pending: any) {
    const progress = getTravelProgressPayload(pending);
    updateTravelPrompt(pending.requestId, progress);
    game.socket.emit(SOCKET_NAME, progress);
    return progress;
  }

  function handleTravelProgress(payload: any) {
    if (!payload?.requestId || !isPrimaryGMMessage(payload)) return;
    const previous = latestTravelProgress.get(payload.requestId);
    updateTravelPrompt(payload.requestId, payload);
    if (payload.requesterId === game.user?.id && (!previous || previous.acceptedCount !== payload.acceptedCount || previous.declinedCount !== payload.declinedCount)) {
      const waiting = payload.pendingNames?.length ? ` Waiting for ${payload.pendingNames.join(", ")}.` : "";
      ui.notifications?.info(`Travel vote: ${payload.acceptedCount}/${payload.requiredApprovals} approvals.${waiting}`);
    }
  }

  function trackTravelRequest(payload: any) {
    if (!isPrimaryGM() || !payload?.requestId || pendingTravelRequests.has(payload.requestId)) return null;
    const rawMap = getRawMap(payload.mapId);
    if (!rawMap) return null;
    const currentMap = normalizeMap(rawMap);
    const requester = getActiveUsers().find(user => user.id === payload.requesterId && !user.isGM);
    const objectTravel = payload.travelScope === "object";
    const travelSystem = objectTravel ? currentMap.systems.find((system: any) => system.id === payload.systemId) : null;
    const from = objectTravel ? travelSystem?.objects.find((object: any) => object.id === currentMap.currentLocation.objectId)
      : currentMap.systems.find((system: any) => system.id === currentMap.currentSystemId);
    const to = objectTravel ? travelSystem?.objects.find((object: any) => object.id === payload.toObjectId)
      : currentMap.systems.find((system: any) => system.id === payload.toSystemId);
    const route = from && to ? getTravelRoute(objectTravel ? { routes: travelSystem?.routes ?? [] } : currentMap, from.id, to.id) : null;
    const invalidObjectTravel = objectTravel && (!travelSystem || currentMap.currentLocation.systemId !== travelSystem.id
      || travelSystem.visibility !== "players" || getEffectiveObjectVisibility(travelSystem, from) !== "players"
      || getEffectiveObjectVisibility(travelSystem, to) !== "players");
    const invalidSystemTravel = !objectTravel && (from?.visibility !== "players" || to?.visibility !== "players");
    if (!requester || currentMap.visibility !== "players" || !from || !to || from.id === to.id
      || invalidObjectTravel || invalidSystemTravel || !route || route.visibility !== "players") return null;
    const primaryGM = getPrimaryGM();
    const electorate = getTravelElectorate(getActiveUsers(), payload.requesterId, primaryGM, currentMap.travelApprovalMode);
    const timeoutId = globalThis.setTimeout(() => {
      const pending = pendingTravelRequests.get(payload.requestId);
      if (pending) rejectTravelRequest(pending, { reason: "Travel request timed out." });
    }, TRAVEL_REQUEST_TIMEOUT_MS);
    const pending = {
      action: "travel-ballot", requestId: String(payload.requestId).slice(0, 80), mapId: currentMap.id,
      mapTitle: currentMap.title, travelScope: objectTravel ? "object" : "system",
      systemId: objectTravel ? travelSystem.id : "", fromSystemId: objectTravel ? travelSystem.id : from.id,
      fromObjectId: objectTravel ? from.id : "", fromName: from.name,
      toSystemId: objectTravel ? travelSystem.id : to.id, toObjectId: objectTravel ? to.id : "", toName: to.name,
      routeId: route.id, routeType: route.type, travelTime: route.travelTime, fuelCost: route.fuelCost,
      requesterId: requester.id, requesterName: requester.name, coordinatorId: game.user.id,
      ...electorate, accepted: new Set(), declined: new Set(), timeoutId
    };
    pendingTravelRequests.set(payload.requestId, pending);
    broadcastTravelProgress(pending);
    return pending;
  }

  function animateTravelOnOpenMaps(payload: any) {
    const map = normalizeMap(getRawMap(payload.mapId));
    const objectTravel = payload.travelScope === "object";
    const travelSystem = objectTravel ? map.systems.find((system: any) => system.id === payload.systemId) : null;
    const from = objectTravel ? travelSystem?.objects.find((object: any) => object.id === payload.fromObjectId)
      : map.systems.find((system: any) => system.id === payload.fromSystemId);
    const to = objectTravel ? travelSystem?.objects.find((object: any) => object.id === payload.toObjectId)
      : map.systems.find((system: any) => system.id === payload.toSystemId);
    if (!from || !to) return;
    getOpenMapViews(payload.mapId).forEach(app => {
      const html = getAppHtml(app);
      if (!html) return;
      if (objectTravel) { if (app.activeSystemId !== travelSystem.id) return; app.selectedObjectId = to.id; }
      else app.selectedSystemId = to.id;
      app.selectedRouteId = null;
      app._animateShipTravel?.(from, to, html);
    });
  }

  const broadcastTravelAnimation = (mapId: string, fromSystemId: string, toSystemId: string) => game.socket.emit(SOCKET_NAME,
    { action: "travel-animation", mapId, fromSystemId, toSystemId, coordinatorId: game.user?.id });
  const broadcastObjectTravelAnimation = (mapId: string, systemId: string, fromObjectId: string, toObjectId: string) => game.socket.emit(SOCKET_NAME,
    { action: "travel-animation", travelScope: "object", mapId, systemId, fromObjectId, toObjectId, coordinatorId: game.user?.id });

  function clearRequest(pending: any) {
    pendingTravelRequests.delete(pending.requestId);
    if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
    promptedTravelRequests.delete(pending.requestId);
    travelRequestPrompts.get(pending.requestId)?.resolve();
    travelRequestPrompts.delete(pending.requestId);
    latestTravelProgress.delete(pending.requestId);
  }

  async function approveTravelRequest(pending: any) {
    clearRequest(pending);
    const payload = { action: "travel-approved", requestId: pending.requestId, mapId: pending.mapId,
      travelScope: pending.travelScope, systemId: pending.systemId, fromSystemId: pending.fromSystemId,
      toSystemId: pending.toSystemId, fromObjectId: pending.fromObjectId, toObjectId: pending.toObjectId,
      fromName: pending.fromName, toName: pending.toName, coordinatorId: game.user.id };
    game.socket.emit(SOCKET_NAME, payload);
    animateTravelOnOpenMaps(payload);
    notifyInfo(`Travel approved: ${pending.fromName} to ${pending.toName}.`);
    globalThis.setTimeout(() => {
      if (pending.travelScope === "object") setCurrentObject(pending.mapId, pending.systemId, pending.toObjectId);
      else setCurrentSystem(pending.mapId, pending.toSystemId);
    }, TRAVEL_ANIMATION_MS);
  }

  function rejectTravelRequest(pending: any, { voterName = "", reason = "" } = {}) {
    clearRequest(pending);
    const message = reason || `${voterName || "A participant"} declined the request.`;
    const payload = { action: "travel-declined", requestId: pending.requestId, mapId: pending.mapId,
      fromName: pending.fromName, toName: pending.toName, voterName, reason: message, coordinatorId: game.user.id };
    game.socket.emit(SOCKET_NAME, payload);
    notifyInfo(`Travel cancelled: ${message}`);
  }

  function handleTravelVote(payload: any) {
    if (!isPrimaryGM() || !payload?.requestId) return;
    const pending = pendingTravelRequests.get(payload.requestId);
    if (!pending || !pending.voterIds.includes(payload.userId)
      || pending.accepted.has(payload.userId) || pending.declined.has(payload.userId)) return;
    if (payload.accepted) pending.accepted.add(payload.userId);
    else pending.declined.add(payload.userId);
    const evaluation = evaluateTravelApproval(pending);
    broadcastTravelProgress(pending);
    if (evaluation.outcome === "approved") approveTravelRequest(pending);
    else if (evaluation.outcome === "declined") rejectTravelRequest(pending, {
      voterName: payload.userName,
      reason: pending.approvalMode === "unanimous" ? `${payload.userName || "A participant"} declined the unanimous request.`
        : "The remaining votes cannot reach a majority."
    });
  }

  function finishRemoteRequest(payload: any) {
    if (payload.requestId) promptedTravelRequests.delete(payload.requestId);
    travelRequestPrompts.get(payload.requestId)?.resolve();
    travelRequestPrompts.delete(payload.requestId);
    latestTravelProgress.delete(payload.requestId);
  }
  function handleTravelApproved(payload: any) {
    if (!isPrimaryGMMessage(payload) || payload.coordinatorId === game.user?.id) return;
    finishRemoteRequest(payload);
    animateTravelOnOpenMaps(payload);
    ui.notifications?.info(`Travel approved: ${payload.fromName} to ${payload.toName}.`);
  }
  function handleTravelDeclined(payload: any) {
    if (!isPrimaryGMMessage(payload) || payload.coordinatorId === game.user?.id) return;
    finishRemoteRequest(payload);
    ui.notifications?.warn(`Travel cancelled: ${payload.reason || `${payload.voterName || "A participant"} declined.`}`);
  }

  return {
    getTravelRoute, requestTravelToSystem, requestTravelToObject, promptForTravelRequest, isPrimaryGMMessage,
    handleTravelProgress, trackTravelRequest, animateTravelOnOpenMaps, broadcastTravelAnimation,
    broadcastObjectTravelAnimation, handleTravelVote, handleTravelApproved, handleTravelDeclined
  };
}
