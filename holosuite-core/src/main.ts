import type { HoloSuiteAppRegistration, HoloSuiteLicenseResult } from "../../shared/src/index";

const MODULE_ID = "holosuite-core";
const SETTING_LICENSE_KEY = "licenseKey";
const SETTING_ALLOWED_FEATURES = "mockAllowedFeatures";

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;
let licenseCache: HoloSuiteLicenseResult | null = null;

const LegacyApplication = (globalThis as any).Application ?? foundry?.appv1?.api?.Application;

function escapeHtml(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
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
    description: String(app.description ?? "").trim(),
    featureId: String(app.featureId ?? id).trim() || id,
    open: app.open
  };
}

function renderOpenLauncherControl(controls: unknown): void {
  if (!game.user?.isGM) return;

  const openLauncher = () => api.openLauncher();
  const tool = {
    name: "holosuite-core-launcher",
    title: "HoloSuite",
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

async function openRegisteredApp(appId: string): Promise<unknown> {
  const app = registeredApps.get(appId);
  if (!app) {
    ui.notifications?.warn?.(`HoloSuite app "${appId}" is not registered.`);
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
  const apps = [...registeredApps.values()].sort((left, right) => left.title.localeCompare(right.title));
  const status = licenseCache?.valid ? "Supporter link active" : "Free core mode";

  const appCards = apps.length
    ? apps.map((app) => {
      const locked = !canOpenApp(app);
      const description = app.description ? `<p>${escapeHtml(app.description)}</p>` : "";
      return `
        <button type="button" class="holosuite-app-tile ${locked ? "is-locked" : ""}" data-holosuite-app="${escapeHtml(app.id)}" ${locked ? "disabled" : ""}>
          <span class="holosuite-app-icon"><i class="${escapeHtml(app.icon)}"></i></span>
          <span class="holosuite-app-title">${escapeHtml(app.title)}</span>
          ${description}
          ${app.premium ? `<span class="holosuite-app-badge">${locked ? "Locked" : "Premium"}</span>` : ""}
        </button>
      `;
    }).join("")
    : '<p class="holosuite-empty">No HoloSuite apps have registered yet.</p>';

  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          <span>${escapeHtml(status)}</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">GM Command Deck</span>
              <h2>Apps</h2>
            </div>
            <button type="button" class="holosuite-refresh" data-holosuite-action="check-license" title="Check license">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
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
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only the GM can open HoloSuite.");
      return null;
    }
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
