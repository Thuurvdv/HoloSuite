import type { HoloSuiteAppRegistration, HoloSuiteLicenseResult } from "../../shared/src/index";

const MODULE_ID = "holosuite-core";
const SETTING_LICENSE_KEY = "licenseKey";
const SETTING_ALLOWED_FEATURES = "mockAllowedFeatures";

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;
let licenseCache: HoloSuiteLicenseResult | null = null;

const LegacyApplication = (globalThis as any).Application ?? foundry?.appv1?.api?.Application;
const PLAYER_APP_TITLES: Record<string, string> = {
  "holocall": "Comms",
  "bounty-board": "Contracts",
  "csi-toolkit": "Case Files",
  "galaxy-map": "NavMap"
};

function escapeHtml(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function safeGetSetting(moduleId: string, key: string): unknown {
  try {
    return game.settings.get(moduleId, key);
  } catch (error) {
    return null;
  }
}

function getPublicApi(moduleId: string): any {
  return game.modules.get(moduleId)?.api ?? null;
}

function getPlayerDisplayName(): string {
  return String(game.user?.character?.name ?? game.user?.name ?? "Player");
}

function getClockLabel(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getPlayerAppTitle(app: HoloSuiteAppRegistration): string {
  return PLAYER_APP_TITLES[app.id] ?? app.title;
}

function getAppBadgeLabel(appId: string): string {
  if (appId === "holocall") {
    const contacts = safeArray(safeGetSetting("holocall", "contacts"));
    const groupContacts = safeArray(safeGetSetting("holocall", "groupContacts"));
    return pluralize(contacts.length + groupContacts.length, "link");
  }

  if (appId === "bounty-board") {
    const bounties = safeArray(getPublicApi("bounty-board")?.getAllBounties?.({ includeHidden: false }));
    return pluralize(bounties.length, "contract");
  }

  if (appId === "csi-toolkit") {
    const cases = Object.values(getPublicApi("csi-toolkit")?.getCases?.() ?? {})
      .filter((csiCase: any) => csiCase?.visibility !== "gm");
    return pluralize(cases.length, "case");
  }

  if (appId === "galaxy-map") {
    const maps = safeArray(getPublicApi("galaxy-map")?.getMaps?.())
      .filter((map: any) => map?.visibility === "players");
    return pluralize(maps.length, "chart");
  }

  return "";
}

function safeArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function normalizeApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null {
  const id = String(app?.id ?? "").trim();
  const title = String(app?.title ?? "").trim();
  const icon = String(app?.icon ?? "").trim();
  if (!id || !title || !icon || typeof app?.open !== "function") {
    console.warn(`${MODULE_ID} | Ignoring invalid app registration.`, app);
    return null;
  }

  return {
    id,
    title,
    icon,
    premium: app.premium === true,
    playerVisible: app.playerVisible !== false,
    description: String(app.description ?? "").trim(),
    featureId: String(app.featureId ?? id).trim() || id,
    open: app.open
  };
}

function renderOpenLauncherControl(controls: unknown): void {
  const openLauncher = () => api.openLauncher();
  const isGM = game.user?.isGM === true;
  const tool = {
    name: "holosuite-core-launcher",
    title: isGM ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-mobile-screen-button",
    button: true,
    visible: true,
    onClick: openLauncher,
    onChange: openLauncher
  };

  if (Array.isArray(controls)) {
    const tokenControls = controls.find((control) => control.name === "token") ?? controls[0];
    if (tokenControls?.tools && !tokenControls.tools.some?.((candidate) => candidate.name === tool.name)) {
      tokenControls.tools.push(tool);
    }
    return;
  }

  const record = controls as Record<string, any>;
  const tokenControls = record?.tokens ?? record?.token ?? Object.values(record ?? {})[0];
  if (!tokenControls?.tools || tokenControls.tools[tool.name]) return;
  tokenControls.tools[tool.name] = { ...tool, order: Object.keys(tokenControls.tools).length };
}

function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTING_LICENSE_KEY, {
    name: "HoloSuite License Key",
    hint: "Optional supporter validation key. This is not DRM; use it for supporter status, downloads, and update access.",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_ID, SETTING_ALLOWED_FEATURES, {
    name: "Mock Allowed Premium Features",
    hint: "Development-only comma-separated feature ids returned by the local mock license checker.",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
}

async function checkLicense(force = false): Promise<HoloSuiteLicenseResult> {
  if (licenseCache && !force) return licenseCache;

  const licenseKey = String(game.settings.get(MODULE_ID, SETTING_LICENSE_KEY) ?? "").trim();
  const configuredFeatures = String(game.settings.get(MODULE_ID, SETTING_ALLOWED_FEATURES) ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const allowedFeatureIds = new Set(configuredFeatures);
  const normalizedKey = licenseKey.toLowerCase();

  if (normalizedKey.includes("supporter") || normalizedKey.includes("valid")) {
    for (const app of registeredApps.values()) {
      if (app.premium) allowedFeatureIds.add(app.featureId ?? app.id);
    }
  }

  licenseCache = {
    valid: Boolean(licenseKey) && (allowedFeatureIds.size > 0 || normalizedKey.includes("valid")),
    allowedFeatureIds: [...allowedFeatureIds].sort(),
    checkedAt: new Date().toISOString(),
    message: licenseKey ? "Mock license check complete." : "No license key configured."
  };

  await launcherApp?.render(false);
  return licenseCache;
}

function isFeatureAllowed(featureId: string): boolean {
  if (!featureId) return false;
  return licenseCache?.allowedFeatureIds.includes(featureId) ?? false;
}

function canOpenApp(app: HoloSuiteAppRegistration): boolean {
  return !app.premium || isFeatureAllowed(app.featureId ?? app.id);
}

function isAppVisibleToCurrentUser(app: HoloSuiteAppRegistration): boolean {
  return game.user?.isGM === true || app.playerVisible !== false;
}

async function openRegisteredApp(appId: string): Promise<unknown> {
  const app = registeredApps.get(appId);
  if (!app) {
    ui.notifications?.warn?.(`HoloSuite app "${appId}" is not registered.`);
    return null;
  }

  if (!isAppVisibleToCurrentUser(app)) {
    ui.notifications?.warn?.(`${app.title} is not available from the player view.`);
    return null;
  }

  await checkLicense();
  if (!canOpenApp(app)) {
    ui.notifications?.warn?.(`${app.title} is locked for this world.`);
    return null;
  }

  return app.open();
}

function renderLauncherHtml(): string {
  const isGM = game.user?.isGM === true;
  const apps = [...registeredApps.values()]
    .filter(isAppVisibleToCurrentUser)
    .sort((left, right) => left.title.localeCompare(right.title));
  const status = licenseCache?.valid ? "Supporter link active" : "";
  const deckLabel = isGM ? "GM Command Deck" : "Player Link";
  const screenTitle = isGM ? "Apps" : "Commlink";
  const emptyLabel = isGM
    ? "No HoloSuite apps have registered yet."
    : "No player apps are available yet.";
  const playerSummary = isGM ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${escapeHtml(getPlayerDisplayName())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
        <span>${escapeHtml(getClockLabel())}</span>
      </div>
    </section>
  `;

  const appCards = apps.length
    ? apps.map((app) => {
      const locked = !canOpenApp(app);
      const title = isGM ? app.title : getPlayerAppTitle(app);
      const description = isGM && app.description ? `<p>${escapeHtml(app.description)}</p>` : "";
      const badgeLabel = !isGM ? getAppBadgeLabel(app.id) : "";
      return `
        <button type="button" class="holosuite-app-tile ${locked ? "is-locked" : ""}" data-holosuite-app="${escapeHtml(app.id)}" ${locked ? "disabled" : ""}>
          <span class="holosuite-app-icon"><i class="${escapeHtml(app.icon)}"></i></span>
          <span class="holosuite-app-title">${escapeHtml(title)}</span>
          ${description}
          ${badgeLabel ? `<span class="holosuite-app-count">${escapeHtml(badgeLabel)}</span>` : ""}
          ${app.premium ? `<span class="holosuite-app-badge">${locked ? "Locked" : "Premium"}</span>` : ""}
        </button>
      `;
    }).join("")
    : `<p class="holosuite-empty">${escapeHtml(emptyLabel)}</p>`;

  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${status ? `<span>${escapeHtml(status)}</span>` : ""}
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${escapeHtml(deckLabel)}</span>
              <h2>${escapeHtml(screenTitle)}</h2>
            </div>
            <button type="button" class="holosuite-refresh" data-holosuite-action="check-license" title="Check license">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          ${playerSummary}
          <div class="holosuite-app-grid">
            ${appCards}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}

class HoloSuiteLauncher extends LegacyApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-launcher",
      title: "HoloSuite",
      classes: ["holosuite-launcher-window"],
      popOut: true,
      resizable: false,
      width: 420,
      height: "auto"
    });
  }

  async _renderInner() {
    return $(renderLauncherHtml());
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-holosuite-app]").on("click", (event) => {
      openRegisteredApp(event.currentTarget.dataset.holosuiteApp);
    });
    html.find("[data-holosuite-action='check-license']").on("click", () => checkLicense(true));
    html.find("[data-holosuite-action='close']").on("click", () => this.close());
  }

  async close(options = {}) {
    launcherApp = null;
    return super.close(options);
  }
}

const api = {
  registerApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null {
    const normalized = normalizeApp(app);
    if (!normalized) return null;
    registeredApps.set(normalized.id, normalized);
    licenseCache = null;
    launcherApp?.render(false);
    return normalized;
  },
  unregisterApp(id: string): boolean {
    const removed = registeredApps.delete(String(id ?? ""));
    if (removed) launcherApp?.render(false);
    return removed;
  },
  getApps(): HoloSuiteAppRegistration[] {
    return [...registeredApps.values()];
  },
  async openLauncher(): Promise<HoloSuiteLauncher | null> {
    await checkLicense();
    if (!launcherApp) launcherApp = new HoloSuiteLauncher();
    await launcherApp.render(true);
    return launcherApp;
  },
  checkLicense,
  isFeatureAllowed
};

function exposeApi(): void {
  const foundryModule = game.modules.get(MODULE_ID);
  if (foundryModule) foundryModule.api = api;
  game.holosuite = api;
}

Hooks.once("init", () => {
  registerSettings();
  exposeApi();
});

Hooks.on("getSceneControlButtons", renderOpenLauncherControl);

Hooks.once("ready", async () => {
  exposeApi();
  await checkLicense(true);
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
