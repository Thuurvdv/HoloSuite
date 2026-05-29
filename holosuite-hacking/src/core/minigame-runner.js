const minigames = new Map();
const activeApps = new Map();

export function registerMinigame(definition) {
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

export function getMinigame(id) {
  return minigames.get(String(id ?? ""));
}

export function getMinigames() {
  return [...minigames.values()];
}

export function startMinigame(type, options = {}) {
  const definition = getMinigame(type);
  if (!definition) {
    ui.notifications?.warn?.(`Unknown HoloSuite hacking minigame: ${type}`);
    return null;
  }

  activeApps.get(definition.id)?.close?.();
  const app = definition.create(options);
  const originalClose = app.close.bind(app);
  app.close = async (...args) => {
    activeApps.delete(definition.id);
    return originalClose(...args);
  };
  activeApps.set(definition.id, app);
  app.render(true);
  return app;
}

export function getActiveApp(type) {
  if (type) return activeApps.get(String(type)) ?? null;
  return [...activeApps.values()].at(-1) ?? null;
}
