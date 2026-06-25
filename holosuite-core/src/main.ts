import type { HoloSuiteAppRegistration } from "../../shared/src/index";
import { addSceneControlTool } from "./scene-controls";

const MODULE_ID = "holosuite-core";
const SETTING_DISABLE_FOR_PLAYERS = "disableForPlayers";
const SETTING_THEME = "theme";

const THEME_CHOICES = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
} as const;

type HoloSuiteTheme = keyof typeof THEME_CHOICES;

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;
let launcherObserver: MutationObserver | null = null;

function getLegacyApplicationBase(): any {
  const appv1 = (globalThis as any).foundry?.appv1?.api ?? foundry?.appv1?.api ?? null;
  const applications = (globalThis as any).foundry?.applications?.api ?? foundry?.applications?.api ?? null;
  return (globalThis as any).FormApplication
    ?? appv1?.FormApplication
    ?? (globalThis as any).Application
    ?? appv1?.Application
    ?? applications?.ApplicationV2;
}

const LegacyApplication = getLegacyApplicationBase();
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
  const createTool = () => ({
    name: "holosuite-core-launcher",
    title: isGM ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-terminal",
    button: true,
    visible: true,
    onClick: openLauncher,
    onChange: openLauncher
  });

  const addedToTiles = addSceneControlTool(controls, createTool(), ["tiles", "tile"]);
  addSceneControlTool(controls, createTool(), ["tokens", "token"], { allowFallback: !addedToTiles });
}

function canOpenLauncher(): boolean {
  return game.user?.isGM === true || !isDisabledForPlayers();
}

function createLauncherButton(tagName: "a" | "button", className: string): HTMLElement {
  const button = document.createElement(tagName);
  button.className = className;
  button.dataset.holosuiteLauncher = "true";
  button.title = "HoloSuite";
  button.setAttribute("aria-label", "Open HoloSuite");
  button.setAttribute("data-tooltip", "HoloSuite");
  button.innerHTML = `<i class="fa-solid fa-terminal" aria-hidden="true"></i><span>HoloSuite</span>`;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    api.openLauncher();
  });
  button.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    api.openLauncher();
  });
  return button;
}

function injectSidebarLauncher(): boolean {
  if (!canOpenLauncher()) return false;
  if (document.querySelector("[data-holosuite-launcher='true']")) return true;

  const sidebarTabs = document.querySelector<HTMLElement>(
    "#sidebar-tabs, #ui-right #sidebar-tabs, #sidebar nav.tabs, #sidebar .tabs, nav.sidebar-tabs"
  );
  if (!sidebarTabs) return false;

  const launcher = createLauncherButton("a", "item holosuite-sidebar-launcher");
  launcher.setAttribute("role", "button");
  launcher.setAttribute("tabindex", "0");
  sidebarTabs.appendChild(launcher);
  return true;
}

function injectFloatingLauncherFallback(): void {
  if (!canOpenLauncher()) return;
  if (document.querySelector("[data-holosuite-launcher='true']")) return;
  document.body.appendChild(createLauncherButton("button", "holosuite-floating-launcher"));
}

function ensureLauncherButton(): void {
  if (injectSidebarLauncher()) return;
  window.setTimeout(() => {
    if (injectSidebarLauncher()) return;
    injectFloatingLauncherFallback();
  }, 250);
}

function observeLauncherContainers(): void {
  if (launcherObserver || !document.body) return;
  launcherObserver = new MutationObserver(() => {
    if (document.querySelector(".holosuite-sidebar-launcher")) return;
    injectSidebarLauncher();
  });
  launcherObserver.observe(document.body, { childList: true, subtree: true });
}

function removeSidebarLaunchers(): void {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((element) => element.remove());
}

function unwrapHtmlElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;
  if (Array.isArray(html) && html[0] instanceof HTMLElement) return html[0];
  const jqueryElement = html as { 0?: unknown; get?: (index: number) => unknown } | null;
  const first = jqueryElement?.get?.(0) ?? jqueryElement?.[0];
  return first instanceof HTMLElement ? first : null;
}

function injectRenderedLauncherControl(html: unknown): void {
  const isGM = game.user?.isGM === true;
  if (!isGM && isDisabledForPlayers()) return;

  const root = unwrapHtmlElement(html) ?? document.querySelector("#controls, #scene-controls");
  if (!root || root.querySelector("[data-tool='holosuite-core-launcher']")) return;

  const controlsList = root.querySelector<HTMLElement>(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!controlsList) return;

  const launcher = document.createElement("li");
  launcher.className = "control-tool holosuite-scene-control";
  launcher.dataset.tool = "holosuite-core-launcher";
  launcher.title = isGM ? "HoloSuite Command Deck" : "HoloSuite Player View";
  launcher.innerHTML = `<i class="fa-solid fa-terminal"></i>`;
  launcher.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    api.openLauncher();
  });
  controlsList.appendChild(launcher);
}

function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTING_THEME, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: true,
    type: String,
    choices: THEME_CHOICES,
    default: "default",
    restricted: true,
    onChange: (value: string) => applyTheme(value)
  });

  game.settings.register(MODULE_ID, SETTING_DISABLE_FOR_PLAYERS, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    restricted: true
  });

  game.settings.registerMenu(MODULE_ID, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: HoloSuiteLauncher,
    restricted: true
  });
}

function normalizeTheme(value: unknown): HoloSuiteTheme {
  return Object.hasOwn(THEME_CHOICES, String(value)) ? String(value) as HoloSuiteTheme : "default";
}

function applyTheme(value: unknown): void {
  const theme = normalizeTheme(value);
  const targets = [document.documentElement, document.body].filter(Boolean);
  for (const target of targets) {
    if (theme === "default") target.removeAttribute("data-holosuite-theme");
    else target.setAttribute("data-holosuite-theme", theme);
  }
}

function applySavedTheme(): void {
  applyTheme(safeGetSetting(MODULE_ID, SETTING_THEME));
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
      const description = isGM && app.description ? `<p>${escapeHtml(app.description)}</p>` : "";
      const badgeLabel = !isGM ? getAppBadgeLabel(app.id) : "";
      return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${escapeHtml(app.id)}">
          <span class="holosuite-app-icon"><i class="${escapeHtml(app.icon)}"></i></span>
          <span class="holosuite-app-title">${escapeHtml(title)}</span>
          ${description}
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

function bindLauncherControls(root: HTMLElement | null): void {
  if (!root) return;
  root.querySelectorAll<HTMLElement>("[data-holosuite-app]").forEach((button) => {
    button.addEventListener("click", (event) => {
      openRegisteredApp((event.currentTarget as HTMLElement).dataset.holosuiteApp ?? "");
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='close']").forEach((button) => {
    button.addEventListener("click", () => launcherApp?.close());
  });
}

class HoloSuiteLauncher extends LegacyApplication {
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
    bindLauncherControls(unwrapHtmlElement(html));
  }

  async _renderHTML() {
    const wrapper = document.createElement("template");
    wrapper.innerHTML = renderLauncherHtml().trim();
    return wrapper.content;
  }

  _replaceHTML(result: DocumentFragment | HTMLElement, content: HTMLElement) {
    content.replaceChildren(result);
    bindLauncherControls(content);
  }

  async close(options = {}) {
    launcherApp = null;
    return super.close(options);
  }

  async _updateObject() {
    return undefined;
  }
}

const api = {
  registerApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null {
    const normalized = normalizeApp(app);
    if (!normalized) return null;
    registeredApps.set(normalized.id, normalized);
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
    if (!launcherApp) launcherApp = new HoloSuiteLauncher();
    await launcherApp.render(true);
    return launcherApp;
  }
};

function exposeApi(): void {
  const foundryModule = game.modules.get(MODULE_ID);
  game.holosuite = api;
  (globalThis as any).HoloSuiteCoreApi = api;

  if (foundryModule) {
    try {
      foundryModule.api = api;
    } catch (error) {
      console.warn(`${MODULE_ID} | Could not attach API to game.modules; using game.holosuite fallback.`, error);
    }
  }

  Hooks.callAll(`${MODULE_ID}.apiReady`, api);
}

Hooks.once("init", () => {
  registerSettings();
  exposeApi();
});

Hooks.on("getSceneControlButtons", renderOpenLauncherControl);
Hooks.on("renderSceneControls", (_app: unknown, html: unknown) => injectRenderedLauncherControl(html));
Hooks.on("renderSidebar", removeSidebarLaunchers);
Hooks.on("renderSidebarTab", removeSidebarLaunchers);

Hooks.once("ready", () => {
  exposeApi();
  applySavedTheme();
  removeSidebarLaunchers();
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
