import type {
  HoloSuiteAppRegistration,
  HoloSuiteWhatsNewEntry,
  HoloSuiteWhatsNewRegistration,
  HoloSuiteWhatsNewTier
} from "../../shared/src/index";
import { addSceneControlTool } from "./scene-controls";

const MODULE_ID = "holosuite-core";
const SETTING_DISABLE_FOR_PLAYERS = "disableForPlayers";
const SETTING_DEVICE_STYLE = "deviceStyle";
const SETTING_THEME = "theme";
const SETTING_WHATS_NEW_LAST_SEEN = "whatsNewLastSeen";
const FOUNDRY_GENERATION_ATTRIBUTE = "data-holosuite-foundry-generation";
const WHATS_NEW_CATALOG_PATH = `modules/${MODULE_ID}/data/whats-new.json`;

const DEVICE_STYLE_CHOICES = {
  base: "Base",
  "space-police": "Space Police"
} as const;

const THEME_CHOICES = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
} as const;

type HoloSuiteDeviceStyle = keyof typeof DEVICE_STYLE_CHOICES;
type HoloSuiteTheme = keyof typeof THEME_CHOICES;

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
const registeredWhatsNew = new Map<string, HoloSuiteWhatsNewRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;
let launcherObserver: MutationObserver | null = null;

type LauncherView = "apps" | "whats-new";
type WhatsNewFilter = "all" | HoloSuiteWhatsNewTier | "installed";

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

function normalizeWhatsNewEntry(entry: HoloSuiteWhatsNewEntry): HoloSuiteWhatsNewEntry | null {
  const title = String(entry?.title ?? "").trim();
  if (!title) return null;

  const tags = safeArray(entry?.tags)
    .map((tag) => String(tag ?? "").trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    title,
    summary: String(entry?.summary ?? "").trim(),
    tags
  };
}

function normalizeWhatsNew(update: HoloSuiteWhatsNewRegistration): HoloSuiteWhatsNewRegistration | null {
  const moduleId = String(update?.moduleId ?? "").trim();
  const title = String(update?.title ?? "").trim();
  const entries = safeArray(update?.entries)
    .map((entry) => normalizeWhatsNewEntry(entry))
    .filter((entry): entry is HoloSuiteWhatsNewEntry => Boolean(entry));

  if (!moduleId || !title || entries.length === 0) {
    console.warn(`${MODULE_ID} | Ignoring invalid what's new registration.`, update);
    return null;
  }

  const tier = String(update?.tier ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId,
    title,
    tier,
    version: String(update?.version ?? "").trim(),
    updated: String(update?.updated ?? "").trim(),
    icon: String(update?.icon ?? "").trim(),
    url: String(update?.url ?? "").trim(),
    entries
  };
}

function getUpdateTimestamp(update: HoloSuiteWhatsNewRegistration): number {
  const timestamp = Date.parse(String(update.updated ?? ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortWhatsNew(
  left: HoloSuiteWhatsNewRegistration,
  right: HoloSuiteWhatsNewRegistration
): number {
  return getUpdateTimestamp(right) - getUpdateTimestamp(left)
    || left.title.localeCompare(right.title);
}

function isModuleInstalled(moduleId: string): boolean {
  return game.modules?.has?.(moduleId) === true;
}

function getWhatsNewLastSeen(): number {
  const value = Number(safeGetSetting(MODULE_ID, SETTING_WHATS_NEW_LAST_SEEN));
  return Number.isFinite(value) ? value : 0;
}

function getUnseenWhatsNewCount(): number {
  const lastSeen = getWhatsNewLastSeen();
  return [...registeredWhatsNew.values()]
    .filter((update) => getUpdateTimestamp(update) > lastSeen)
    .reduce((count, update) => count + update.entries.length, 0);
}

function markWhatsNewSeen(): void {
  try {
    game.settings.set(MODULE_ID, SETTING_WHATS_NEW_LAST_SEEN, Date.now());
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not update what's new read state.`, error);
  }
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
    icon: getLauncherIconClass(),
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
  button.innerHTML = `<i class="${getLauncherIconClass()}" aria-hidden="true"></i><span>HoloSuite</span>`;
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
  launcher.innerHTML = `<i class="${getLauncherIconClass()}"></i>`;
  launcher.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    api.openLauncher();
  });
  controlsList.appendChild(launcher);
}

function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTING_DEVICE_STYLE, {
    name: "HoloSuite Device Style",
    hint: "Changes the launcher frame style without changing the launcher size.",
    scope: "world",
    config: true,
    type: String,
    choices: DEVICE_STYLE_CHOICES,
    default: "base",
    restricted: true,
    onChange: (value: string) => applyDeviceStyle(value)
  });

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

  game.settings.register(MODULE_ID, SETTING_WHATS_NEW_LAST_SEEN, {
    name: "HoloSuite What's New Last Seen",
    hint: "Tracks when this client last opened the HoloSuite What's New view.",
    scope: "client",
    config: false,
    type: Number,
    default: 0
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

function normalizeDeviceStyle(value: unknown): HoloSuiteDeviceStyle {
  return Object.hasOwn(DEVICE_STYLE_CHOICES, String(value)) ? String(value) as HoloSuiteDeviceStyle : "base";
}

function normalizeTheme(value: unknown): HoloSuiteTheme {
  return Object.hasOwn(THEME_CHOICES, String(value)) ? String(value) as HoloSuiteTheme : "default";
}

function applyDeviceStyle(value: unknown): void {
  const style = normalizeDeviceStyle(value);
  const targets = [document.documentElement, document.body].filter(Boolean);
  for (const target of targets) {
    if (style === "base") target.removeAttribute("data-holosuite-device-style");
    else target.setAttribute("data-holosuite-device-style", style);
  }
}

function applyTheme(value: unknown): void {
  const theme = normalizeTheme(value);
  const targets = [document.documentElement, document.body].filter(Boolean);
  for (const target of targets) {
    if (theme === "default") target.removeAttribute("data-holosuite-theme");
    else target.setAttribute("data-holosuite-theme", theme);
  }
}

function applySavedDeviceStyle(): void {
  applyDeviceStyle(safeGetSetting(MODULE_ID, SETTING_DEVICE_STYLE));
}

function applySavedTheme(): void {
  applyTheme(safeGetSetting(MODULE_ID, SETTING_THEME));
}

function getFoundryGeneration(): number | null {
  const generation = Number((globalThis as any).game?.release?.generation ?? game?.release?.generation);
  return Number.isFinite(generation) ? generation : null;
}

function applyFoundryGenerationMarker(): void {
  const generation = getFoundryGeneration();
  const targets = [document.documentElement, document.body].filter(Boolean);
  for (const target of targets) {
    if (generation === null) target.removeAttribute(FOUNDRY_GENERATION_ATTRIBUTE);
    else target.setAttribute(FOUNDRY_GENERATION_ATTRIBUTE, String(generation));
  }
}

function getLauncherIconClass(): string {
  return getFoundryGeneration() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
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

function registerWhatsNewInternal(
  update: HoloSuiteWhatsNewRegistration,
  options: { replace?: boolean } = {}
): HoloSuiteWhatsNewRegistration | null {
  const normalized = normalizeWhatsNew(update);
  if (!normalized) return null;
  if (options.replace === false && registeredWhatsNew.has(normalized.moduleId)) {
    return registeredWhatsNew.get(normalized.moduleId) ?? null;
  }
  registeredWhatsNew.set(normalized.moduleId, normalized);
  launcherApp?.render(false);
  return normalized;
}

async function loadBundledWhatsNewCatalog(): Promise<void> {
  try {
    const response = await fetch(WHATS_NEW_CATALOG_PATH, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const catalog = await response.json();
    const modules = safeArray(catalog?.modules);
    for (const update of modules) {
      registerWhatsNewInternal(update, { replace: false });
    }
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not load bundled what's new catalog.`, error);
  }
}

function renderWhatsNewHeaderButton(view: LauncherView): string {
  const unseenCount = getUnseenWhatsNewCount();
  const badgeLabel = unseenCount > 0 ? `<span>${escapeHtml(unseenCount)}</span>` : "";
  const action = view === "whats-new" ? "apps" : "whats-new";
  const title = view === "whats-new" ? "Back to HoloSuite apps" : "What's New";
  const icon = view === "whats-new" ? "fa-solid fa-arrow-left" : "fa-solid fa-star";
  return `
    <button
      type="button"
      class="holosuite-header-action ${view === "whats-new" ? "is-active" : ""}"
      data-holosuite-action="${escapeHtml(action)}"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
    >
      <i class="${escapeHtml(icon)}"></i>
      ${badgeLabel}
    </button>
  `;
}

function renderAppIcon(app: HoloSuiteAppRegistration): string {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${escapeHtml(app.id)}">
      <i class="${escapeHtml(app.icon)}"></i>
    </span>
  `;
}

function renderAppsView(): string {
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

  const appCards = apps.map((app) => {
      const title = app.title;
      const description = isGM && app.description ? `<p>${escapeHtml(app.description)}</p>` : "";
      const badgeLabel = !isGM ? getAppBadgeLabel(app.id) : "";
      return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${escapeHtml(app.id)}">
          ${renderAppIcon(app)}
          <span class="holosuite-app-title">${escapeHtml(title)}</span>
          ${description}
          ${badgeLabel ? `<span class="holosuite-app-count">${escapeHtml(badgeLabel)}</span>` : ""}
        </button>
      `;
    }).join("");

  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${escapeHtml(deckLabel)}</span>
        <h2>${escapeHtml(screenTitle)}</h2>
      </div>
    </div>
    ${playerSummary}
    <div class="holosuite-app-grid">
      ${apps.length ? appCards : `<p class="holosuite-empty">${escapeHtml(emptyLabel)}</p>`}
    </div>
  `;
}

function renderWhatsNewFilters(activeFilter: WhatsNewFilter): string {
  const filters: Array<{ id: WhatsNewFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
    { id: "installed", label: "Installed" }
  ];

  return `
    <nav class="holosuite-whats-new-filters" aria-label="What's New filters">
      ${filters.map((filter) => `
        <button
          type="button"
          class="${filter.id === activeFilter ? "is-active" : ""}"
          data-holosuite-filter="${escapeHtml(filter.id)}"
        >${escapeHtml(filter.label)}</button>
      `).join("")}
    </nav>
  `;
}

function getFilteredWhatsNew(filter: WhatsNewFilter): HoloSuiteWhatsNewRegistration[] {
  return [...registeredWhatsNew.values()]
    .filter((update) => {
      if (filter === "installed") return isModuleInstalled(update.moduleId);
      if (filter === "free" || filter === "premium") return update.tier === filter;
      return true;
    })
    .sort(sortWhatsNew);
}

function renderWhatsNewView(activeFilter: WhatsNewFilter): string {
  const updates = getFilteredWhatsNew(activeFilter);
  const updateCards = updates.length
    ? updates.map((update) => {
      const installed = isModuleInstalled(update.moduleId);
      const tierLabel = update.tier === "premium" ? "Premium" : "Free";
      const icon = update.icon || (update.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube");
      const entries = update.entries.map((entry) => `
        <li>
          <strong>${escapeHtml(entry.title)}</strong>
          ${entry.summary ? `<span>${escapeHtml(entry.summary)}</span>` : ""}
          ${entry.tags?.length ? `
            <div class="holosuite-whats-new-tags">
              ${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `).join("");

      return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon"><i class="${escapeHtml(icon)}"></i></span>
            <div>
              <h3>${escapeHtml(update.title)}</h3>
              <p>
                <span>${escapeHtml(tierLabel)}</span>
                ${update.version ? `<span>v${escapeHtml(update.version)}</span>` : ""}
                ${update.updated ? `<span>${escapeHtml(update.updated)}</span>` : ""}
                <span>${installed ? "Installed" : "Not installed"}</span>
              </p>
            </div>
          </header>
          <ul>${entries}</ul>
        </article>
      `;
    }).join("")
    : `<p class="holosuite-empty">No updates match this filter yet.</p>`;

  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${renderWhatsNewFilters(activeFilter)}
    <div class="holosuite-whats-new-list">
      ${updateCards}
    </div>
  `;
}

function renderLauncherHtml(view: LauncherView = "apps", activeFilter: WhatsNewFilter = "all"): string {
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${renderWhatsNewHeaderButton(view)}
        </header>
        <main class="holosuite-screen ${view === "whats-new" ? "holosuite-screen--whats-new" : ""}">
          ${view === "whats-new" ? renderWhatsNewView(activeFilter) : renderAppsView()}
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
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='whats-new']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      launcherApp?.showWhatsNew();
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='apps']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      launcherApp?.showApps();
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-filter]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const filter = (event.currentTarget as HTMLElement).dataset.holosuiteFilter;
      launcherApp?.setWhatsNewFilter(normalizeWhatsNewFilter(filter));
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='close']").forEach((button) => {
    button.addEventListener("click", () => launcherApp?.close());
  });
}

function normalizeWhatsNewFilter(value: unknown): WhatsNewFilter {
  const filter = String(value ?? "");
  return filter === "free" || filter === "premium" || filter === "installed" ? filter : "all";
}

class HoloSuiteLauncher extends LegacyApplication {
  private currentView: LauncherView = "apps";
  private whatsNewFilter: WhatsNewFilter = "all";

  static DEFAULT_OPTIONS = {
    id: "holosuite-launcher",
    tag: "section",
    classes: ["holosuite-launcher-window"],
    window: {
      title: "HoloSuite",
      resizable: false
    },
    position: {
      width: 483,
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
      width: 483,
      height: "auto"
    });
  }

  async _renderInner() {
    return $(renderLauncherHtml(this.currentView, this.whatsNewFilter));
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindLauncherControls(unwrapHtmlElement(html));
  }

  async _renderHTML() {
    const wrapper = document.createElement("template");
    wrapper.innerHTML = renderLauncherHtml(this.currentView, this.whatsNewFilter).trim();
    return wrapper.content;
  }

  _replaceHTML(result: unknown, content: unknown) {
    const target = this.getRenderTarget(content);
    if (!target) return;

    const resultElement = result instanceof DocumentFragment || result instanceof HTMLElement
      ? result
      : unwrapHtmlElement(result);
    if (resultElement) target.replaceChildren(resultElement);
    else target.innerHTML = String(result ?? "");

    bindLauncherControls(target);
  }

  async close(options = {}) {
    launcherApp = null;
    return super.close(options);
  }

  getLauncherRoot(): HTMLElement | null {
    const element = unwrapHtmlElement((this as any).element);
    return element?.querySelector<HTMLElement>(".holosuite-phone")
      ?? element?.closest?.(".holosuite-phone")
      ?? document.querySelector<HTMLElement>("#holosuite-launcher .holosuite-phone");
  }

  private getRenderTarget(content: unknown): HTMLElement | null {
    const root = unwrapHtmlElement(content);
    if (!root) return null;
    return root.querySelector<HTMLElement>(".window-content")
      ?? root.querySelector<HTMLElement>(".holosuite-launcher-window .window-content")
      ?? root;
  }

  private updateRenderedView(): boolean {
    const root = this.getLauncherRoot();
    if (!root) return false;

    const statusBar = root.querySelector<HTMLElement>(".holosuite-status-bar");
    const screen = root.querySelector<HTMLElement>(".holosuite-screen");
    if (!statusBar || !screen) return false;

    statusBar.innerHTML = `
      <span>HoloSuite</span>
      ${renderWhatsNewHeaderButton(this.currentView)}
    `;
    screen.innerHTML = this.currentView === "whats-new"
      ? renderWhatsNewView(this.whatsNewFilter)
      : renderAppsView();
    screen.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new");
    bindLauncherControls(root);
    return true;
  }

  showApps(): void {
    this.currentView = "apps";
    if (!this.updateRenderedView()) this.render(false);
  }

  showWhatsNew(): void {
    this.currentView = "whats-new";
    markWhatsNewSeen();
    if (!this.updateRenderedView()) this.render(false);
  }

  setWhatsNewFilter(filter: WhatsNewFilter): void {
    this.currentView = "whats-new";
    this.whatsNewFilter = filter;
    if (!this.updateRenderedView()) this.render(false);
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
  registerWhatsNew(update: HoloSuiteWhatsNewRegistration): HoloSuiteWhatsNewRegistration | null {
    return registerWhatsNewInternal(update);
  },
  unregisterWhatsNew(moduleId: string): boolean {
    const removed = registeredWhatsNew.delete(String(moduleId ?? ""));
    if (removed) launcherApp?.render(false);
    return removed;
  },
  getWhatsNew(): HoloSuiteWhatsNewRegistration[] {
    return [...registeredWhatsNew.values()].sort(sortWhatsNew);
  },
  async openLauncher(): Promise<HoloSuiteLauncher | null> {
    if (launcherApp && (launcherApp as any).rendered && !launcherApp.getLauncherRoot()) {
      launcherApp = null;
    }
    if (!launcherApp) launcherApp = new HoloSuiteLauncher();
    try {
      await launcherApp.render(true);
    } catch (error) {
      console.warn(`${MODULE_ID} | Recreating launcher after render failure.`, error);
      launcherApp = new HoloSuiteLauncher();
      await launcherApp.render(true);
    }
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
  applyFoundryGenerationMarker();
  registerSettings();
  exposeApi();
});

Hooks.on("getSceneControlButtons", renderOpenLauncherControl);
Hooks.on("renderSceneControls", (_app: unknown, html: unknown) => injectRenderedLauncherControl(html));
Hooks.on("renderSidebar", removeSidebarLaunchers);
Hooks.on("renderSidebarTab", removeSidebarLaunchers);

Hooks.once("ready", () => {
  exposeApi();
  applyFoundryGenerationMarker();
  applySavedDeviceStyle();
  applySavedTheme();
  removeSidebarLaunchers();
  loadBundledWhatsNewCatalog();
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
