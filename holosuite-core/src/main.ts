import type { HoloSuiteAppRegistration } from "../../shared/src/index";

const MODULE_ID = "holosuite-core";
const SETTING_DISABLE_FOR_PLAYERS = "disableForPlayers";

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;

const LegacyApplication = (globalThis as any).Application ?? foundry?.appv1?.api?.Application;
const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;

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

function getAppBadgeLabel(appId: string): string {
  if (appId === "cybercall") {
    const contacts = safeArray(safeGetSetting("cybercall", "contacts"));
    const groupContacts = safeArray(safeGetSetting("cybercall", "groupContacts"));
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

function isAppV2(app: unknown): boolean {
  return Boolean((app as any)?.constructor?.DEFAULT_OPTIONS);
}

function renderApp(app: unknown, force = false): Promise<unknown> | unknown {
  if (isAppV2(app)) return (app as any).render({ force });
  return (app as any)?.render?.(force);
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
  const isGM = game.user?.isGM === true;
  if (!isGM && isDisabledForPlayers()) return;
  const openLauncher = () => api.openLauncher();
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
  game.settings.register(MODULE_ID, SETTING_DISABLE_FOR_PLAYERS, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
}

function isDisabledForPlayers(): boolean {
  try {
    return game.settings.get(MODULE_ID, SETTING_DISABLE_FOR_PLAYERS) === true;
  } catch {
    return false;
  }
}

function isAppVisibleToCurrentUser(app: HoloSuiteAppRegistration): boolean {
  if (game.user?.isGM === true) return true;
  if (isDisabledForPlayers()) return false;
  return app.playerVisible !== false;
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

  return app.open();
}

function renderLauncherHtml(): string {
  const isGM = game.user?.isGM === true;
  const apps = [...registeredApps.values()]
    .filter(isAppVisibleToCurrentUser)
    .sort((left, right) => left.title.localeCompare(right.title));
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
      </div>
    </section>
  `;

  const appCards = apps.length
    ? apps.map((app) => {
      const title = app.title;
      const description = isGM && app.description ? app.description : "";
      const badgeLabel = !isGM ? getAppBadgeLabel(app.id) : "";
      const tooltip = description ? ` title="${escapeHtml(description)}" data-tooltip="${escapeHtml(description)}"` : "";
      return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${escapeHtml(app.id)}"${tooltip}>
          <span class="holosuite-app-icon"><i class="${escapeHtml(app.icon)}"></i></span>
          <span class="holosuite-app-title">${escapeHtml(title)}</span>
          ${badgeLabel ? `<span class="holosuite-app-count">${escapeHtml(badgeLabel)}</span>` : ""}
        </button>
      `;
    }).join("")
    : `<p class="holosuite-empty">${escapeHtml(emptyLabel)}</p>`;

  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${escapeHtml(deckLabel)}</span>
              <h2>${escapeHtml(screenTitle)}</h2>
            </div>
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

class HoloSuiteLauncherV1 extends LegacyApplication {
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
    html.find("[data-holosuite-action='close']").on("click", () => this.close());
  }

  async close(options = {}) {
    launcherApp = null;
    return super.close(options);
  }
}

function createHoloSuiteLauncherV2() {
  if (!ApplicationV2) return null;

  return class HoloSuiteLauncherV2 extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
      id: "holosuite-launcher",
      tag: "section",
      classes: ["holosuite-launcher-window"],
      window: {
        title: "HoloSuite",
        resizable: false
      },
      position: {
        width: 420,
        height: "auto"
      }
    };

    async _renderHTML() {
      const template = document.createElement("template");
      template.innerHTML = renderLauncherHtml().trim();
      return template.content;
    }

    _replaceHTML(result: DocumentFragment | HTMLElement, content: HTMLElement) {
      const nodes = result instanceof DocumentFragment ? [...result.childNodes] : [result];
      content.replaceChildren(...nodes);
    }

    _onRender(context: unknown, options: unknown) {
      super._onRender?.(context, options);
      this.element.querySelectorAll("[data-holosuite-app]").forEach((button: HTMLElement) => {
        button.addEventListener("click", () => openRegisteredApp(button.dataset.holosuiteApp ?? ""));
      });
      this.element.querySelector("[data-holosuite-action='close']")?.addEventListener("click", () => this.close());
    }

    async close(options = {}) {
      launcherApp = null;
      return super.close(options);
    }
  };
}

const HoloSuiteLauncherClass = createHoloSuiteLauncherV2() ?? HoloSuiteLauncherV1;
type HoloSuiteLauncher = InstanceType<typeof HoloSuiteLauncherClass>;

const api = {
  registerApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null {
    const normalized = normalizeApp(app);
    if (!normalized) return null;
    registeredApps.set(normalized.id, normalized);
    if (launcherApp) renderApp(launcherApp, false);
    return normalized;
  },
  unregisterApp(id: string): boolean {
    const removed = registeredApps.delete(String(id ?? ""));
    if (removed && launcherApp) renderApp(launcherApp, false);
    return removed;
  },
  getApps(): HoloSuiteAppRegistration[] {
    return [...registeredApps.values()];
  },
  async openLauncher(): Promise<HoloSuiteLauncher | null> {
    if (!launcherApp) launcherApp = new HoloSuiteLauncherClass();
    await renderApp(launcherApp, true);
    return launcherApp;
  }
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

Hooks.once("ready", () => {
  exposeApi();
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
