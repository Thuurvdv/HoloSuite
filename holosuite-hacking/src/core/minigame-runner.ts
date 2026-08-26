declare const ui: any;

const minigames = new Map<string, any>();
const activeApps = new Map<string, any>();

export function registerMinigame(definition: any) {
  const id = String(definition?.id ?? "").trim();
  if (!id || typeof definition?.create !== "function") {
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  }

  minigames.set(id, {
    title: String(definition.title ?? id),
    icon: String(definition.icon ?? "fa-solid fa-terminal"),
    ...definition,
    id
  });
}

export function getMinigame(id: string) {
  return minigames.get(String(id ?? ""));
}

export function getMinigames() {
  return [...minigames.values()];
}

export function startMinigame(type: string, options: any = {}) {
  const definition = getMinigame(type);
  if (!definition) {
    ui.notifications?.warn?.(`Unknown HoloSuite hacking minigame: ${type}`);
    return null;
  }

  const liveSessionId = String(options.liveSessionId ?? "");
  const instanceKey = options.readOnly && liveSessionId
    ? `${definition.id}:spectator:${liveSessionId}`
    : definition.id;
  activeApps.get(instanceKey)?.close?.();
  const app = definition.create(options);
  const originalClose = app.close.bind(app);
  app.close = async (...args) => {
    activeApps.delete(instanceKey);
    return originalClose(...args);
  };
  activeApps.set(instanceKey, app);
  app.render(true);
  return app;
}

export function getActiveApp(type?: string) {
  if (type) return activeApps.get(String(type)) ?? null;
  return [...activeApps.values()].at(-1) ?? null;
}
