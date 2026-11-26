import type {
  HoloSuiteAppRegistration,
  HoloSuiteBranding,
  HoloSuiteWhatsNewEntry,
  HoloSuiteWhatsNewRegistration,
  HoloSuiteWhatsNewTier
} from "../../shared/src/index";
import {
  CORE_STYLESHEET_ATTRIBUTE,
  CORE_STYLESHEET_PATHS,
  setCoreStylesEnabled
} from "./core-styles";
import { addSceneControlTool } from "./scene-controls";
import { BRANDING_ICONS, BRANDING_SETTING, DEVICE_BRANDING_ID, imagePath, normalizeBranding } from "./branding";
import { refreshModuleBranding } from "./module-branding";

const MODULE_ID = "holosuite-core";
const SETTING_API_ONLY_FOR_DEBUGGING = "apiOnlyForDebugging";
const SETTING_DISABLE_CORE_CSS_FOR_DEBUGGING = "disableCoreCssForDebugging";
const SETTING_DISABLE_VISUAL_EFFECTS_FOR_DEBUGGING = "disableVisualEffectsForDebugging";
const SETTING_DISABLE_FOR_PLAYERS = "disableForPlayers";
const SETTING_DEVICE_STYLE = "deviceStyle";
const SETTING_FORCE_DEVICE_STYLE = "forceDeviceStyle";
const SETTING_FORM_FACTOR = "formFactor";
const SETTING_THEMED_APP_COLORS = "themedAppColors";
const SETTING_APP_ORDER = "appOrder";
const SETTING_THEME = "theme";
const SETTING_WHATS_NEW_LAST_SEEN = "whatsNewLastSeen";
const KEYBINDING_OPEN_LAUNCHER = "openLauncher";
const FOUNDRY_GENERATION_ATTRIBUTE = "data-holosuite-foundry-generation";
const REDUCED_EFFECTS_ATTRIBUTE = "data-holosuite-debug-no-effects";
const WHATS_NEW_CATALOG_PATH = `modules/${MODULE_ID}/data/whats-new.json`;
const WHATS_NEW_UPDATES_SINCE = Date.UTC(2026, 7, 1);
const BUNDLED_NEWS_LAUNCHER_ICONS = new Set([
  "bounty-board",
  "csi-toolkit",
  "cybercall",
  "galaxy-map",
  "holo-assistant",
  "holodock",
  "holosuite-blueprint",
  "holosuite-critical-cutin",
  "holosuite-galactic-records",
  "holosuite-hacking",
  "holosuite-loot",
  "holosuite-terminal",
  "holosuite-vending-machines",
  "pulse-scanner",
  "security-camera",
  "security-cameras"
]);

const DEVICE_STYLE_CHOICES = {
  base: "HoloSuite",
  "space-police": "Space Police",
  "cassette-futurism": "Cassette Futurism",
  red: "RED",
  corporate: "Corporate"
} as const;

// RED and Corporate are still being developed. Keep their implementation available
// for later, but expose only the released themes in this version.
const RELEASED_DEVICE_STYLE_CHOICES = {
  base: DEVICE_STYLE_CHOICES.base,
  "space-police": DEVICE_STYLE_CHOICES["space-police"],
  "cassette-futurism": DEVICE_STYLE_CHOICES["cassette-futurism"]
} as const;

const RELEASED_FORCED_DEVICE_STYLE_CHOICES = {
  "": "Allow User Choice",
  ...RELEASED_DEVICE_STYLE_CHOICES
} as const;

const FORM_FACTOR_CHOICES = {
  phone: "Compact",
  datapad: "Datapad",
  computer: "Computer"
} as const;

const THEME_CHOICES = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
} as const;

type HoloSuiteDeviceStyle = keyof typeof DEVICE_STYLE_CHOICES;
type HoloSuiteFormFactor = keyof typeof FORM_FACTOR_CHOICES;
type HoloSuiteTheme = keyof typeof THEME_CHOICES;

const registeredApps = new Map<string, HoloSuiteAppRegistration>();
const brandingTargets = new Map<string, HoloSuiteAppRegistration>();

function getBrandingTargets(): HoloSuiteAppRegistration[] {
  return [...new Map([...brandingTargets, ...registeredApps]).values()]
    .sort((a, b) => a.title.localeCompare(b.title));
}
const registeredWhatsNew = new Map<string, HoloSuiteWhatsNewRegistration>();
const registeredReleases = new Map<string, HoloSuiteWhatsNewRegistration>();
let launcherApp: HoloSuiteLauncher | null = null;
let brandingApp: HoloSuiteBrandingEditor | null = null;
let launcherOpenPromise: Promise<HoloSuiteLauncher | null> | null = null;
let launcherCloseInProgress = false;
let launcherObserver: MutationObserver | null = null;
let launcherControlClickHandledAt = 0;
let coreReady = false;
let apiOnlyRuntimeState: boolean | null = null;
let whatsNewCatalogLoaded = false;
let whatsNewCatalogPromise: Promise<void> | null = null;
let launcherReorderMode = false;
let suppressAppClickUntil = 0;

type LauncherView = "apps" | "whats-new" | "settings";
type WhatsNewTab = "updates" | "releases";
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

function isRenderableLauncher(app: HoloSuiteLauncher | null): app is HoloSuiteLauncher {
  if (!app) return false;
  if (app.getLauncherRoot({ includeDocumentFallback: false })) return true;
  return false;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
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

function isApiOnlyMode(): boolean {
  return apiOnlyRuntimeState ?? safeGetSetting(MODULE_ID, SETTING_API_ONLY_FOR_DEBUGGING) === true;
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

  const compatibilityTag = safeArray(entry?.tags)
    .map((tag) => String(tag ?? "").trim())
    .find((tag) => /^foundry\b/i.test(tag));
  const tags = compatibilityTag ? [compatibilityTag.replace(/-v(?=\d)/i, "\u2013")] : [];

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
  return [...registeredWhatsNew.values(), ...registeredReleases.values()]
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
    brandingHeader: app.brandingHeader,
    brandingInApp: app.brandingInApp === true,
    premium: app.premium === true,
    playerVisible: app.playerVisible !== false,
    description: String(app.description ?? "").trim(),
    featureId: String(app.featureId ?? id).trim() || id,
    open: app.open,
    contextActions: (app.contextActions ?? []).filter(action => action?.label && typeof action.callback === "function")
  };
}

function appDisplayTitle(title: string): string {
  return title.replace(/^HoloSuite\s*:?\s*/i, "").trim() || title;
}

function getBranding(id: string): HoloSuiteBranding {
  const settings = safeGetSetting(MODULE_ID, BRANDING_SETTING);
  if (!settings || typeof settings !== "object" || !Object.hasOwn(settings, id)) return {};
  return normalizeBranding(settings[id]);
}

function launcherTitle(isGM: boolean, branding = getBranding(DEVICE_BRANDING_ID)): string {
  const name = branding.name || "HoloSuite";
  return isGM ? branding.gmTitle || `${name} Command Deck` : branding.playerTitle || `${name} Player View`;
}

function brandedIcon(branding: HoloSuiteBranding, fallback: string): string {
  const icon = `<i class="${escapeHtml(branding.icon ? `fa-solid ${branding.icon}` : fallback)}" aria-hidden="true"></i>`;
  if (!branding.iconImage) return icon;
  return `<img class="holosuite-brand-image" src="${escapeHtml(branding.iconImage)}" alt="">${icon}`;
}

function bindBrandingImages(root: ParentNode): void {
  root.querySelectorAll<HTMLImageElement>("img.holosuite-brand-image").forEach(img => {
    const showFallback = () => { img.hidden = true; };
    img.addEventListener("error", showFallback, { once: true });
    if (img.complete && !img.naturalWidth) showFallback();
  });
}

function renderOpenLauncherControl(controls: unknown): void {
  if (isApiOnlyMode()) return;
  const isGM = game.user?.isGM === true;
  if (!isGM && isDisabledForPlayers()) return;
  const createTool = () => ({
    name: "holosuite-core-launcher",
    title: launcherTitle(isGM),
    icon: getLauncherIconClass(),
    button: true,
    visible: true,
    onClick: handleLauncherControlClick,
    onChange: handleLauncherControlChange
  });

  const addedToTiles = addSceneControlTool(controls, createTool(), ["tiles", "tile"]);
  addSceneControlTool(controls, createTool(), ["tokens", "token"], { allowFallback: !addedToTiles });
}

function canOpenLauncher(): boolean {
  return !isApiOnlyMode() && (game.user?.isGM === true || !isDisabledForPlayers());
}

function createLauncherButton(tagName: "a" | "button", className: string): HTMLElement {
  const branding = getBranding(DEVICE_BRANDING_ID);
  const name = branding.name || "HoloSuite";
  const button = document.createElement(tagName);
  button.className = className;
  button.dataset.holosuiteLauncher = "true";
  button.title = name;
  button.setAttribute("aria-label", `Open ${name}`);
  button.setAttribute("data-tooltip", name);
  button.innerHTML = `${brandedIcon(branding, defaultLauncherIcon())}<span>${escapeHtml(name)}</span>`;
  bindBrandingImages(button);
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
  if (isApiOnlyMode()) return;
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((element) => element.remove());
}

function unwrapHtmlElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;
  if (Array.isArray(html) && html[0] instanceof HTMLElement) return html[0];
  const jqueryElement = html as { 0?: unknown; get?: (index: number) => unknown } | null;
  const first = jqueryElement?.get?.(0) ?? jqueryElement?.[0];
  return first instanceof HTMLElement ? first : null;
}

function removeDuplicateLauncherWindows(app: HoloSuiteLauncher | null): void {
  const windows = new Set(document.querySelectorAll<HTMLElement>("#holosuite-launcher, .holosuite-launcher-window"));
  if (windows.size <= 1) return;

  const appElement = app ? unwrapHtmlElement((app as any).element) : null;
  const currentWindow = appElement?.closest?.("#holosuite-launcher, .holosuite-launcher-window") as HTMLElement | null;
  const keepWindow = currentWindow ?? [...windows].at(-1) ?? null;

  for (const launcherWindow of windows) {
    if (launcherWindow !== keepWindow) launcherWindow.remove();
  }
}

function removeAllLauncherWindows(): void {
  document.querySelectorAll<HTMLElement>("#holosuite-launcher, .holosuite-launcher-window").forEach((element) => {
    element.remove();
  });
}

function hasStaleLauncherWindow(): boolean {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}

function resetLauncherState(): void {
  launcherApp = null;
  launcherOpenPromise = null;
  launcherCloseInProgress = false;
}

function getBooleanArgument(args: unknown[]): boolean | null {
  const value = args.find((arg) => typeof arg === "boolean");
  return typeof value === "boolean" ? value : null;
}

function handleLauncherControlClick(): Promise<HoloSuiteLauncher | null> {
  launcherControlClickHandledAt = Date.now();
  return api.toggleLauncher();
}

function handleLauncherControlChange(...args: unknown[]): Promise<HoloSuiteLauncher | null> | null {
  const active = getBooleanArgument(args);
  if (active === false) {
    void requestLauncherClose();
    return null;
  }
  if (active === null && Date.now() - launcherControlClickHandledAt < 100) {
    return null;
  }
  return api.openLauncher();
}

function injectRenderedLauncherControl(html: unknown): void {
  if (isApiOnlyMode()) return;
  const isGM = game.user?.isGM === true;
  if (!isGM && isDisabledForPlayers()) return;

  const root = unwrapHtmlElement(html) ?? document.querySelector("#controls, #scene-controls");
  if (!root) return;
  const branding = getBranding(DEVICE_BRANDING_ID);
  const nativeTools = root.querySelectorAll<HTMLElement>("[data-tool='holosuite-core-launcher'], [data-action='holosuite-core-launcher']");
  if (nativeTools.length) {
    if (branding.iconImage) nativeTools.forEach(tool => {
      if (tool.querySelector("img.holosuite-brand-image")) return;
      tool.insertAdjacentHTML("afterbegin", `<img class="holosuite-brand-image" src="${escapeHtml(branding.iconImage)}" alt="">`);
      bindBrandingImages(tool);
    });
    return;
  }

  const controlsList = root.querySelector<HTMLElement>(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!controlsList) return;

  const launcher = document.createElement("li");
  launcher.className = "control-tool holosuite-scene-control";
  launcher.dataset.tool = "holosuite-core-launcher";
  launcher.title = launcherTitle(isGM, branding);
  launcher.innerHTML = brandedIcon(branding, defaultLauncherIcon());
  bindBrandingImages(launcher);
  launcher.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleLauncherControlClick();
  });
  controlsList.appendChild(launcher);
}

function organizeCoreSettings(_app: unknown, html: unknown): void {
  const root = unwrapHtmlElement(html);
  if (!root) return;

  const selectors = [
    `input[name="${MODULE_ID}.${SETTING_API_ONLY_FOR_DEBUGGING}"]`,
    `input[name="${MODULE_ID}.${SETTING_DISABLE_CORE_CSS_FOR_DEBUGGING}"]`,
    `input[name="${MODULE_ID}.${SETTING_DISABLE_VISUAL_EFFECTS_FOR_DEBUGGING}"]`
  ];
  const groups = selectors
    .map((selector) => root.querySelector<HTMLElement>(selector)?.closest<HTMLElement>(".form-group") ?? null)
    .filter((group): group is HTMLElement => group !== null);

  for (const group of groups) group.parentElement?.append(group);
}

function registerSettings(): void {
  game.settings.register(MODULE_ID, BRANDING_SETTING, {
    scope: "world", config: false, type: Object, default: {},
    onChange: () => {
      refreshModuleBranding(document, getBranding);
      Hooks.callAll("holosuite-core.brandingChanged");
      if (!coreReady || isApiOnlyMode()) return;
      launcherApp?.refreshCurrentView();
      removeSidebarLaunchers();
      void refreshSceneControls();
    }
  });
  game.settings.registerMenu(MODULE_ID, "brandingEditor", {
    name: "HoloSuite Branding", label: "Open HoloSuite Branding",
    hint: "Customize the device and app branding for this world.",
    icon: "fa-solid fa-palette", type: HoloSuiteBrandingEditor, restricted: true
  });
  game.settings.register(MODULE_ID, SETTING_API_ONLY_FOR_DEBUGGING, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    restricted: false,
    onChange: (enabled: boolean) => applyApiOnlySetting(enabled)
  });

  game.settings.register(MODULE_ID, SETTING_DISABLE_CORE_CSS_FOR_DEBUGGING, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    restricted: false,
    onChange: (disabled: boolean) => applyCoreStylesSetting(disabled)
  });

  game.settings.register(MODULE_ID, SETTING_DISABLE_VISUAL_EFFECTS_FOR_DEBUGGING, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    restricted: false,
    onChange: (disabled: boolean) => applyVisualEffectsSetting(disabled)
  });

  game.settings.register(MODULE_ID, SETTING_DEVICE_STYLE, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: true,
    type: String,
    choices: RELEASED_DEVICE_STYLE_CHOICES,
    default: "base",
    restricted: false,
    onChange: () => {
      applySavedDeviceStyle();
      launcherApp?.refreshCurrentView();
    }
  });

  game.settings.register(MODULE_ID, SETTING_FORCE_DEVICE_STYLE, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: true,
    type: String,
    choices: RELEASED_FORCED_DEVICE_STYLE_CHOICES,
    default: "",
    restricted: true,
    onChange: () => {
      applySavedDeviceStyle();
      launcherApp?.refreshCurrentView();
    }
  });

  game.settings.register(MODULE_ID, SETTING_FORM_FACTOR, {
    name: "HoloSuite Size",
    hint: "Choose a compact, wide datapad, or large computer layout for this user.",
    scope: "client",
    config: true,
    type: String,
    choices: FORM_FACTOR_CHOICES,
    default: "phone",
    restricted: false,
    onChange: () => {
      applySavedFormFactor();
      launcherApp?.refreshCurrentView();
      launcherApp?.resizeForFormFactor();
    }
  });

  game.settings.register(MODULE_ID, SETTING_THEMED_APP_COLORS, {
    name: "Use Themed App Colors",
    hint: "Use the active device theme’s accent for app icons and interaction glow. Uploaded branding images keep their original colors.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    restricted: false,
    onChange: () => launcherApp?.applyAppColors()
  });

  game.settings.register(MODULE_ID, SETTING_APP_ORDER, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: false,
    type: Array,
    default: [],
    restricted: false
  });

  game.settings.register(MODULE_ID, SETTING_THEME, {
    name: "HoloSuite Color Theme",
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

  game.settings.registerMenu(MODULE_ID, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: HoloSuiteDiagnostics,
    restricted: true
  });
}

async function refreshSceneControls(): Promise<void> {
  const controls = ui.controls as any;
  if (typeof controls?.render !== "function") return;
  const generation = Number(game.release?.generation ?? 0);
  try {
    if (generation >= 13) await controls.render({ force: true, reset: true });
    else await controls.render(true);
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not rebuild scene controls.`, error);
  }
}

function applyApiOnlySetting(value: unknown = safeGetSetting(MODULE_ID, SETTING_API_ONLY_FOR_DEBUGGING)): void {
  const enabled = value === true;
  apiOnlyRuntimeState = enabled;
  if (enabled) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((element) => element.remove());
    if (launcherApp || hasStaleLauncherWindow()) void requestLauncherClose();
    if (coreReady) void refreshSceneControls();
    console.warn(`${MODULE_ID} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }

  if (coreReady) {
    void loadBundledWhatsNewCatalog();
    void refreshSceneControls();
  }
}

function applyCoreStylesSetting(value: unknown = safeGetSetting(MODULE_ID, SETTING_DISABLE_CORE_CSS_FOR_DEBUGGING)): void {
  const disabled = value === true;
  const version = String(game.modules.get(MODULE_ID)?.version ?? "");
  setCoreStylesEnabled(!disabled, document, version);
  if (disabled) {
    console.warn(`${MODULE_ID} | Core CSS is disabled on this browser for debugging.`);
  }
}

function applyVisualEffectsSetting(
  value: unknown = safeGetSetting(MODULE_ID, SETTING_DISABLE_VISUAL_EFFECTS_FOR_DEBUGGING)
): void {
  const disabled = value === true;
  for (const target of [document.documentElement, document.body].filter(Boolean)) {
    if (disabled) target.setAttribute(REDUCED_EFFECTS_ATTRIBUTE, "true");
    else target.removeAttribute(REDUCED_EFFECTS_ATTRIBUTE);
  }
  if (disabled) {
    console.warn(`${MODULE_ID} | Core visual effects are disabled on this browser for debugging.`);
  }
}

function registerKeybindings(): void {
  game.keybindings?.register?.(MODULE_ID, KEYBINDING_OPEN_LAUNCHER, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: false,
    onDown: () => {
      if (isApiOnlyMode()) {
        ui.notifications?.warn?.("HoloSuite Core is in API-only diagnostic mode on this browser.");
        return false;
      }
      if (!canOpenLauncher()) {
        ui.notifications?.warn?.("HoloSuite is disabled for players in this world.");
        return false;
      }
      void api.toggleLauncher();
      return true;
    }
  });
}

function normalizeDeviceStyle(value: unknown): HoloSuiteDeviceStyle {
  return Object.hasOwn(RELEASED_DEVICE_STYLE_CHOICES, String(value)) ? String(value) as HoloSuiteDeviceStyle : "base";
}

function getForcedDeviceStyle(): HoloSuiteDeviceStyle | null {
  const value = String(safeGetSetting(MODULE_ID, SETTING_FORCE_DEVICE_STYLE) ?? "");
  return Object.hasOwn(RELEASED_DEVICE_STYLE_CHOICES, value) ? value as HoloSuiteDeviceStyle : null;
}

function getUserDeviceStyle(): HoloSuiteDeviceStyle {
  return normalizeDeviceStyle(safeGetSetting(MODULE_ID, SETTING_DEVICE_STYLE));
}

function getEffectiveDeviceStyle(): HoloSuiteDeviceStyle {
  return getForcedDeviceStyle() ?? getUserDeviceStyle();
}

function normalizeTheme(value: unknown): HoloSuiteTheme {
  return Object.hasOwn(THEME_CHOICES, String(value)) ? String(value) as HoloSuiteTheme : "default";
}

function normalizeFormFactor(value: unknown): HoloSuiteFormFactor {
  const formFactor = String(value ?? "");
  return Object.hasOwn(FORM_FACTOR_CHOICES, formFactor) ? formFactor as HoloSuiteFormFactor : "phone";
}

function getFormFactor(): HoloSuiteFormFactor {
  return normalizeFormFactor(safeGetSetting(MODULE_ID, SETTING_FORM_FACTOR));
}

function getFormFactorDimensions(formFactor = getFormFactor()): { width: number; height: number } {
  const preferred = formFactor === "computer"
    ? { width: 980, height: 700 }
    : formFactor === "datapad"
      ? { width: 760, height: 680 }
      : { width: 483, height: 700 };
  return {
    width: Math.min(preferred.width, Math.max(1, window.innerWidth - 32)),
    height: Math.min(preferred.height, Math.max(1, window.innerHeight - 32))
  };
}

function getAppColorMode(): "theme" | "original" {
  return safeGetSetting(MODULE_ID, SETTING_THEMED_APP_COLORS) === true ? "theme" : "original";
}

function getSavedAppOrder(): string[] {
  return safeArray(safeGetSetting(MODULE_ID, SETTING_APP_ORDER))
    .map((id) => String(id ?? "").trim())
    .filter((id, index, ids) => Boolean(id) && ids.indexOf(id) === index);
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

function applyFormFactor(value: unknown): void {
  const formFactor = normalizeFormFactor(value);
  for (const target of [document.documentElement, document.body].filter(Boolean)) {
    target.setAttribute("data-holosuite-form-factor", formFactor);
  }
}

function applySavedDeviceStyle(): void {
  applyDeviceStyle(getEffectiveDeviceStyle());
}

function applySavedTheme(): void {
  applyTheme(safeGetSetting(MODULE_ID, SETTING_THEME));
}

function applySavedFormFactor(): void {
  applyFormFactor(getFormFactor());
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

function defaultLauncherIcon(): string {
  return getFoundryGeneration() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}

function getLauncherIconClass(): string {
  const icon = getBranding(DEVICE_BRANDING_ID).icon;
  return icon ? `fa-solid ${icon}` : defaultLauncherIcon();
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
  if (getUpdateTimestamp(normalized) < WHATS_NEW_UPDATES_SINCE) return null;
  const current = registeredWhatsNew.get(normalized.moduleId);
  if (current) {
    const currentTimestamp = getUpdateTimestamp(current);
    const incomingTimestamp = getUpdateTimestamp(normalized);
    if (incomingTimestamp < currentTimestamp ||
        (incomingTimestamp === currentTimestamp && options.replace === false)) return current;
  }
  registeredWhatsNew.set(normalized.moduleId, normalized);
  if (!isApiOnlyMode()) launcherApp?.render(false);
  return normalized;
}

function registerReleaseInternal(
  release: HoloSuiteWhatsNewRegistration,
  options: { replace?: boolean } = {}
): HoloSuiteWhatsNewRegistration | null {
  const normalized = normalizeWhatsNew(release);
  if (!normalized) return null;
  if (options.replace === false && registeredReleases.has(normalized.moduleId)) {
    return registeredReleases.get(normalized.moduleId) ?? null;
  }
  registeredReleases.set(normalized.moduleId, normalized);
  if (!isApiOnlyMode()) launcherApp?.render(false);
  return normalized;
}

async function loadBundledWhatsNewCatalog(): Promise<void> {
  if (isApiOnlyMode() || whatsNewCatalogLoaded) return;
  if (whatsNewCatalogPromise) return whatsNewCatalogPromise;

  whatsNewCatalogPromise = (async () => {
    try {
      const response = await fetch(WHATS_NEW_CATALOG_PATH, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const catalog = await response.json();
      const modules = safeArray(catalog?.modules);
      for (const update of modules) {
        registerWhatsNewInternal(update, { replace: false });
      }
      const releases = safeArray(catalog?.releases);
      for (const release of releases) {
        registerReleaseInternal(release, { replace: false });
      }
      whatsNewCatalogLoaded = true;
    } catch (error) {
      console.warn(`${MODULE_ID} | Could not load bundled what's new catalog.`, error);
    }
  })().finally(() => {
    whatsNewCatalogPromise = null;
  });

  return whatsNewCatalogPromise;
}

function renderHeaderActions(view: LauncherView): string {
  const branding = getBranding(DEVICE_BRANDING_ID);
  const unseenCount = getUnseenWhatsNewCount();
  const badgeLabel = unseenCount > 0 ? `<span>${escapeHtml(unseenCount)}</span>` : "";
  const backButton = view === "apps" ? "" : `
    <button
      type="button"
      class="holosuite-header-action"
      data-holosuite-action="apps"
      title="Back to apps"
      aria-label="Back to apps"
    >
      ${brandedIcon({ icon: branding.backIcon }, "fa-solid fa-arrow-left")}
    </button>
  `;

  return `
    <div class="holosuite-header-actions">
      ${backButton}
      <button
        type="button"
        class="holosuite-header-action ${view === "settings" ? "is-active" : ""}"
        data-holosuite-action="settings"
        title="Settings"
        aria-label="Settings"
      >
        ${brandedIcon({ icon: branding.settingsIcon }, "fa-solid fa-gear")}
      </button>
      <button
        type="button"
        class="holosuite-header-action ${view === "whats-new" ? "is-active" : ""}"
        data-holosuite-action="whats-new"
        title="What's New"
        aria-label="What's New"
      >
        ${brandedIcon({ icon: branding.updatesIcon }, "fa-solid fa-star")}
        ${badgeLabel}
      </button>
      <button
        type="button"
        class="holosuite-header-action holosuite-header-close"
        data-holosuite-action="close"
        title="Close"
        aria-label="Close"
      >
        ${brandedIcon({ icon: branding.closeIcon }, "fa-solid fa-xmark")}
      </button>
    </div>
  `;
}

function renderAppIcon(app: Pick<HoloSuiteAppRegistration, "id" | "icon">, branding = getBranding(app.id)): string {
  return `
    <span class="holosuite-app-icon ${branding.icon ? "holosuite-brand-glyph" : ""}" data-holosuite-app-icon="${escapeHtml(app.id)}">
      ${brandedIcon(branding, app.icon)}
    </span>
  `;
}

function brandedTileLabel(app: HoloSuiteAppRegistration, branding = getBranding(app.id)): string {
  const title = appDisplayTitle(app.title);
  return branding.label || branding.name || title;
}

function renderAppTileContent(app: HoloSuiteAppRegistration, branding: HoloSuiteBranding, isGM: boolean): string {
  const description = app.description;
  return `${renderAppIcon(app, branding)}
    <span class="holosuite-app-title">${escapeHtml(brandedTileLabel(app, branding))}</span>
    ${isGM && description ? `<p>${escapeHtml(description)}</p>` : ""}`;
}

function renderAppsView(): string {
  const isGM = game.user?.isGM === true;
  const savedOrder = getSavedAppOrder();
  const orderIndex = new Map(savedOrder.map((id, index) => [id, index]));
  const apps = [...registeredApps.values()]
    .filter(isAppVisibleToCurrentUser)
    .sort((left, right) => {
      const leftIndex = orderIndex.get(left.id);
      const rightIndex = orderIndex.get(right.id);
      if (leftIndex !== undefined || rightIndex !== undefined) {
        if (leftIndex === undefined) return 1;
        if (rightIndex === undefined) return -1;
        return leftIndex - rightIndex;
      }
      return left.title.localeCompare(right.title);
    });
  const device = getBranding(DEVICE_BRANDING_ID);
  const deckLabel = isGM ? device.gmHeading || "GM Command Deck" : device.playerHeading || "Player Link";
  const screenTitle = isGM ? device.gmScreen || "Apps" : device.playerScreen || "Commlink";
  const emptyLabel = isGM
    ? "No HoloSuite apps have registered yet."
    : "No player apps are available yet.";
  const playerSummary = isGM ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">${escapeHtml(device.userLabel || "Active User")}</span>
        <strong>${escapeHtml(getPlayerDisplayName())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>${escapeHtml(device.linkStatus || "LINK STABLE")}</span>
      </div>
    </section>
  `;

  const appCards = apps.map((app) => {
      const badgeLabel = !isGM ? getAppBadgeLabel(app.id) : "";
      return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${escapeHtml(app.id)}">
          ${renderAppTileContent(app, getBranding(app.id), isGM)}
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
    ${apps.length > 1 ? `
      <div class="holosuite-reorder-help" aria-live="polite">
        <span class="holosuite-reorder-help-idle"><i class="fa-solid fa-hand-pointer"></i> Press and hold an app to rearrange</span>
        <span class="holosuite-reorder-help-active"><i class="fa-solid fa-arrows-up-down-left-right"></i> Drag apps into place</span>
        <button type="button" data-holosuite-action="reorder-done">Done</button>
      </div>
    ` : ""}
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

function renderWhatsNewTabs(activeTab: WhatsNewTab): string {
  const tabs: Array<{ id: WhatsNewTab; label: string; count: number }> = [
    { id: "updates", label: "Updates", count: registeredWhatsNew.size },
    { id: "releases", label: "Releases", count: registeredReleases.size }
  ];

  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${tabs.map((tab) => `
        <button
          type="button"
          class="${tab.id === activeTab ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${escapeHtml(tab.id)}"
        >
          <span>${escapeHtml(tab.label)}</span>
          <strong>${escapeHtml(tab.count)}</strong>
        </button>
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

function getFilteredReleases(filter: WhatsNewFilter): HoloSuiteWhatsNewRegistration[] {
  return [...registeredReleases.values()]
    .filter((release) => {
      if (filter === "installed") return isModuleInstalled(release.moduleId);
      if (filter === "free" || filter === "premium") return release.tier === filter;
      return true;
    })
    .sort(sortWhatsNew);
}

function renderWhatsNewIcon(update: HoloSuiteWhatsNewRegistration): string {
  const fallback = update.icon || (update.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube");
  const appId = update.moduleId === "holosuite-buddy" ? "holo-assistant" : update.moduleId;
  const app = registeredApps.get(update.moduleId) ?? registeredApps.get(appId);
  if (app) return renderAppIcon(app);
  if (BUNDLED_NEWS_LAUNCHER_ICONS.has(appId)) return renderAppIcon({ id: appId, icon: fallback });
  return brandedIcon({}, fallback);
}

function renderWhatsNewCards(items: HoloSuiteWhatsNewRegistration[], emptyLabel: string): string {
  return items.length
    ? items.map((update) => {
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
      const releaseLink = update.url
        ? `
          <a class="holosuite-whats-new-link" href="${escapeHtml(update.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        `
        : "";

      return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon">${renderWhatsNewIcon(update)}</span>
            <div>
              <h3>${escapeHtml(update.title)}</h3>
            </div>
          </header>
          <ul>${entries}</ul>
          ${releaseLink}
        </article>
      `;
    }).join("")
    : `<p class="holosuite-empty">${escapeHtml(emptyLabel)}</p>`;
}

function renderWhatsNewView(activeFilter: WhatsNewFilter, activeTab: WhatsNewTab): string {
  const updates = getFilteredWhatsNew(activeFilter);
  const releases = getFilteredReleases(activeFilter);
  const activeItems = activeTab === "releases" ? releases : updates;
  const emptyLabel = activeTab === "releases"
    ? "No releases match this filter yet."
    : "No updates match this filter yet.";

  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${renderWhatsNewTabs(activeTab)}
    ${renderWhatsNewFilters(activeFilter)}
    <div class="holosuite-whats-new-list">
      ${renderWhatsNewCards(activeItems, emptyLabel)}
    </div>
  `;
}

function renderSettingsView(): string {
  const forcedStyle = getForcedDeviceStyle();
  const userStyle = getUserDeviceStyle();
  const effectiveStyle = forcedStyle ?? userStyle;
  const formFactor = getFormFactor();
  const overrideNotice = forcedStyle ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "";

  const options = Object.entries(RELEASED_DEVICE_STYLE_CHOICES).map(([id, label]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${id === effectiveStyle ? "is-active" : ""}"
      data-holosuite-device-style="${escapeHtml(id)}"
      ${forcedStyle ? "disabled" : ""}
      aria-pressed="${id === effectiveStyle ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${escapeHtml(id)}"></span>
      <strong>${escapeHtml(label)}</strong>
    </button>
  `).join("");

  const formFactorOptions = Object.entries(FORM_FACTOR_CHOICES).map(([id, label]) => `
    <button
      type="button"
      class="holosuite-form-factor-choice ${id === formFactor ? "is-active" : ""}"
      data-holosuite-form-factor-choice="${escapeHtml(id)}"
      aria-pressed="${id === formFactor ? "true" : "false"}"
    >
      <span class="holosuite-form-factor-preview holosuite-form-factor-preview--${escapeHtml(id)}" aria-hidden="true"></span>
      <strong>${escapeHtml(label)}</strong>
    </button>
  `).join("");

  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Personal Console</span>
        <h2>Settings</h2>
      </div>
    </div>
    <section class="holosuite-settings-panel">
      ${overrideNotice}
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Theme</span>
          <strong>${escapeHtml(RELEASED_DEVICE_STYLE_CHOICES[effectiveStyle as keyof typeof RELEASED_DEVICE_STYLE_CHOICES])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices" role="group" aria-label="Theme">
        ${options}
      </div>
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Size</span>
          <strong>${escapeHtml(FORM_FACTOR_CHOICES[formFactor])}</strong>
        </div>
      </div>
      <div class="holosuite-form-factor-choices" role="group" aria-label="Size">
        ${formFactorOptions}
      </div>
      ${game.user?.isGM ? `
        <div class="holosuite-branding-action">
          <button type="button" data-holosuite-action="branding">Open HoloSuite Branding</button>
          <span class="holosuite-branding-warning" tabindex="0" role="img" aria-label="Experimental feature" data-tooltip="Experimental feature">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          </span>
        </div>
      ` : ""}
    </section>
  `;
}

function renderDeviceBrand(branding = getBranding(DEVICE_BRANDING_ID)): string {
  const mark = branding.logo ? `<img class="holosuite-brand-image" src="${escapeHtml(branding.logo)}" alt="">` : "";
  return `<span>${mark}${escapeHtml(branding.name || "HoloSuite")}</span>`;
}

function renderLauncherHtml(
  view: LauncherView = "apps",
  activeFilter: WhatsNewFilter = "all",
  activeWhatsNewTab: WhatsNewTab = "releases"
): string {
  const screenClass = view === "whats-new" ? "holosuite-screen--whats-new" : view === "settings" ? "holosuite-screen--settings" : "";
  const screenContent = view === "whats-new"
    ? renderWhatsNewView(activeFilter, activeWhatsNewTab)
    : view === "settings"
      ? renderSettingsView()
      : renderAppsView();

  return `
    <section class="holosuite-phone" data-holosuite-app-colors="${getAppColorMode()}">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          ${renderDeviceBrand()}
          ${renderHeaderActions(view)}
        </header>
        <main class="holosuite-screen ${screenClass}">
          ${screenContent}
        </main>
        <div class="holosuite-device-bottom-trim" aria-hidden="true"></div>
      </div>
    </section>
  `;
}

function setLauncherReorderMode(root: HTMLElement, enabled: boolean): void {
  launcherReorderMode = enabled;
  root.classList.toggle("is-reordering-apps", enabled);
}

async function persistAppOrder(grid: HTMLElement): Promise<void> {
  const order = [...grid.querySelectorAll<HTMLElement>("[data-holosuite-app]")]
    .map((tile) => tile.dataset.holosuiteApp ?? "")
    .filter(Boolean);
  await game.settings.set(MODULE_ID, SETTING_APP_ORDER, order);
}

const REORDER_SLOT_HYSTERESIS_PX = 12;

function getClosestReorderSlot(
  slots: DOMRect[],
  clientX: number,
  clientY: number,
  currentIndex: number
): number {
  if (slots.length === 0) return 0;

  const distanceToSlot = (slot: DOMRect) => Math.hypot(
    clientX - (slot.left + slot.width / 2),
    clientY - (slot.top + slot.height / 2)
  );
  const safeCurrentIndex = Math.min(Math.max(currentIndex, 0), slots.length - 1);
  const currentDistance = distanceToSlot(slots[safeCurrentIndex]);
  let closestIndex = safeCurrentIndex;
  let closestDistance = currentDistance;

  slots.forEach((slot, index) => {
    const distance = distanceToSlot(slot);
    if (distance < closestDistance) {
      closestIndex = index;
      closestDistance = distance;
    }
  });

  // Keep the current slot until the pointer is clearly closer to another one.
  // This dead zone prevents a reflow or tiny pointer movement from swapping back.
  if (closestIndex !== safeCurrentIndex
    && closestDistance + REORDER_SLOT_HYSTERESIS_PX >= currentDistance) {
    return safeCurrentIndex;
  }
  return closestIndex;
}

function moveReorderPlaceholder(
  grid: HTMLElement,
  tile: HTMLElement,
  placeholder: HTMLElement,
  targetIndex: number
): void {
  const remainingTiles = [...grid.querySelectorAll<HTMLElement>("[data-holosuite-app]")]
    .filter((candidate) => candidate !== tile);
  const before = remainingTiles[targetIndex] ?? null;

  if (before) {
    if (placeholder.nextElementSibling !== before) grid.insertBefore(placeholder, before);
  } else if (placeholder.nextElementSibling) {
    grid.append(placeholder);
  }
}

function bindAppReordering(root: HTMLElement): void {
  const grid = root.querySelector<HTMLElement>(".holosuite-app-grid");
  if (!grid) return;
  setLauncherReorderMode(root, launcherReorderMode);

  root.querySelector<HTMLElement>("[data-holosuite-action='reorder-done']")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setLauncherReorderMode(root, false);
  });

  grid.querySelectorAll<HTMLElement>("[data-holosuite-app]").forEach((tile) => {
    let holdTimer: number | null = null;
    let activePointer: number | null = null;
    let dragging = false;
    let pressX = 0;
    let pressY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let placeholder: HTMLElement | null = null;
    let reorderSlots: DOMRect[] = [];
    let currentSlotIndex = 0;

    const beginDragging = (pointerId: number) => {
      const rect = tile.getBoundingClientRect();
      const tiles = [...grid.querySelectorAll<HTMLElement>("[data-holosuite-app]")];
      reorderSlots = tiles.map((candidate) => candidate.getBoundingClientRect());
      currentSlotIndex = Math.max(0, tiles.indexOf(tile));
      setLauncherReorderMode(root, true);
      dragging = true;
      suppressAppClickUntil = Date.now() + 700;
      dragOffsetX = pressX - rect.left;
      dragOffsetY = pressY - rect.top;
      placeholder = document.createElement("div");
      placeholder.className = "holosuite-app-placeholder";
      placeholder.style.height = `${rect.height}px`;
      placeholder.setAttribute("aria-hidden", "true");
      tile.before(placeholder);
      tile.style.height = `${rect.height}px`;
      tile.style.left = `${rect.left}px`;
      tile.style.top = `${rect.top}px`;
      tile.style.width = `${rect.width}px`;
      tile.classList.add("is-being-reordered");
      try { tile.setPointerCapture(pointerId); } catch { /* Pointer may already have been released. */ }
    };

    tile.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      activePointer = event.pointerId;
      pressX = event.clientX;
      pressY = event.clientY;
      if (launcherReorderMode) {
        event.preventDefault();
        beginDragging(event.pointerId);
      } else {
        holdTimer = window.setTimeout(() => beginDragging(event.pointerId), 550);
      }
    });

    tile.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointer) return;
      if (!dragging) {
        if (Math.hypot(event.clientX - pressX, event.clientY - pressY) > 8 && holdTimer !== null) {
          window.clearTimeout(holdTimer);
          holdTimer = null;
        }
        return;
      }
      event.preventDefault();
      tile.style.left = `${event.clientX - dragOffsetX}px`;
      tile.style.top = `${event.clientY - dragOffsetY}px`;

      const gridRect = grid.getBoundingClientRect();
      if (placeholder && event.clientX >= gridRect.left && event.clientX <= gridRect.right
        && event.clientY >= gridRect.top && event.clientY <= gridRect.bottom) {
        const targetIndex = getClosestReorderSlot(
          reorderSlots,
          event.clientX,
          event.clientY,
          currentSlotIndex
        );
        if (targetIndex !== currentSlotIndex) {
          moveReorderPlaceholder(grid, tile, placeholder, targetIndex);
          currentSlotIndex = targetIndex;
        }
      }
    });

    const finishPointer = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
      activePointer = null;
      if (!dragging) return;
      event.preventDefault();
      dragging = false;
      reorderSlots = [];
      placeholder?.replaceWith(tile);
      placeholder = null;
      tile.classList.remove("is-being-reordered");
      tile.style.removeProperty("height");
      tile.style.removeProperty("left");
      tile.style.removeProperty("top");
      tile.style.removeProperty("width");
      suppressAppClickUntil = Date.now() + 450;
      void persistAppOrder(grid);
    };

    tile.addEventListener("pointerup", finishPointer);
    tile.addEventListener("pointercancel", finishPointer);
    tile.addEventListener("contextmenu", (event) => {
      if (!launcherReorderMode) return;
      event.preventDefault();
    });
  });
}

let closeAppContextMenu: (() => void) | null = null;

function showAppContextMenu(appId: string, anchor: HTMLElement, x: number, y: number): void {
  const app = registeredApps.get(appId);
  if (!app || !isAppVisibleToCurrentUser(app) || !app.contextActions?.length) return;
  closeAppContextMenu?.();
  const menu = document.createElement("div");
  menu.className = "holosuite-app-context-menu";
  menu.setAttribute("role", "menu");
  const title = brandedTileLabel(app);
  menu.setAttribute("aria-label", title);
  Object.assign(menu.style, { position: "fixed", zIndex: "100000", background: "#091923", border: "1px solid #58c8d5", borderRadius: "5px", padding: "5px", minWidth: "200px", boxShadow: "0 8px 30px #0009" });
  const controller = new AbortController();
  const close = () => { controller.abort(); menu.remove(); closeAppContextMenu = null; };
  closeAppContextMenu = close;
  const actions = [{ label: `Open ${title}`, callback: () => openRegisteredApp(appId) }, ...app.contextActions];
  for (const action of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.textContent = action.label;
    Object.assign(button.style, { display: "block", width: "100%", textAlign: "left", color: "#d8faff", background: "#102c38", border: "1px solid #315967", padding: "8px 12px", margin: "3px 0" });
    button.addEventListener("click", async () => {
      close();
      anchor.focus();
      if (!isAppVisibleToCurrentUser(app)) return;
      try { await action.callback(); }
      catch (error) { console.error(`${MODULE_ID} | App action failed`, error); ui.notifications?.error?.(`Could not complete ${action.label}.`); }
    });
    menu.appendChild(button);
  }
  document.body.appendChild(menu);
  const bounds = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - bounds.width - 4))}px`;
  menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - bounds.height - 4))}px`;
  menu.querySelector<HTMLButtonElement>("button")?.focus();
  document.addEventListener("pointerdown", event => { if (!menu.contains(event.target as Node)) close(); }, { capture: true, signal: controller.signal });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); anchor.focus(); }
    else if (event.key === "Tab") close();
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      const buttons = Array.from(menu.querySelectorAll("button"));
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  }, { capture: true, signal: controller.signal });
}

function bindLauncherControls(root: HTMLElement | null): void {
  if (!root) return;
  bindBrandingImages(root);
  closeAppContextMenu?.();
  root.querySelectorAll<HTMLElement>("[data-holosuite-app]").forEach((button) => {
    const appId = button.dataset.holosuiteApp ?? "";
    if (registeredApps.get(appId)?.contextActions?.length) {
      button.setAttribute("aria-haspopup", "menu");
      button.title = `${brandedTileLabel(registeredApps.get(appId)!)} — Right-click for options`;
      button.addEventListener("contextmenu", event => {
        if (launcherReorderMode) return;
        event.preventDefault(); event.stopPropagation();
        const rect = button.getBoundingClientRect();
        showAppContextMenu(appId, button, event.clientX || rect.left, event.clientY || rect.bottom);
      });
      button.addEventListener("keydown", event => {
        if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
        if (launcherReorderMode) return;
        event.preventDefault(); event.stopPropagation();
        const rect = button.getBoundingClientRect();
        showAppContextMenu(appId, button, rect.left, rect.bottom);
      });
    }
    button.addEventListener("click", (event) => {
      if (launcherReorderMode || Date.now() < suppressAppClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
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
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='settings']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      launcherApp?.showSettings();
    });
  });
  root.querySelector("[data-holosuite-action='branding']")?.addEventListener("click", () => openBranding());
  root.querySelectorAll<HTMLElement>("[data-holosuite-device-style]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const style = (event.currentTarget as HTMLElement).dataset.holosuiteDeviceStyle;
      launcherApp?.setDeviceStyle(normalizeDeviceStyle(style));
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-form-factor-choice]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const formFactor = (event.currentTarget as HTMLElement).dataset.holosuiteFormFactorChoice;
      launcherApp?.setFormFactor(normalizeFormFactor(formFactor));
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-filter]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const filter = (event.currentTarget as HTMLElement).dataset.holosuiteFilter;
      launcherApp?.setWhatsNewFilter(normalizeWhatsNewFilter(filter));
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-whats-new-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const tab = (event.currentTarget as HTMLElement).dataset.holosuiteWhatsNewTab;
      launcherApp?.setWhatsNewTab(normalizeWhatsNewTab(tab));
    });
  });
  root.querySelectorAll<HTMLElement>("[data-holosuite-action='close']").forEach((button) => {
    button.addEventListener("pointerdown", handleLauncherCloseEvent, { capture: true });
    button.addEventListener("click", handleLauncherCloseEvent, { capture: true });
  });
  bindAppReordering(root);
}

function normalizeWhatsNewFilter(value: unknown): WhatsNewFilter {
  const filter = String(value ?? "");
  return filter === "free" || filter === "premium" || filter === "installed" ? filter : "all";
}

function normalizeWhatsNewTab(value: unknown): WhatsNewTab {
  return String(value ?? "") === "releases" ? "releases" : "updates";
}

function handleLauncherCloseEvent(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  (event as any).stopImmediatePropagation?.();
  void requestLauncherClose();
}

async function requestLauncherClose(): Promise<void> {
  closeAppContextMenu?.();
  if (launcherCloseInProgress) return;
  launcherCloseInProgress = true;

  const app = launcherApp;
  const element = app ? unwrapHtmlElement((app as any).element) : document.querySelector<HTMLElement>("#holosuite-launcher");
  const launcherElement = element?.closest?.("#holosuite-launcher, .holosuite-launcher-window") ?? element;
  launcherApp = null;
  launcherOpenPromise = null;

  try {
    await app?.close?.({ force: true });
  } catch (error) {
    console.warn(`${MODULE_ID} | Foundry did not close the launcher cleanly; removing stale launcher element.`, error);
  } finally {
    launcherCloseInProgress = false;
  }

  window.setTimeout(() => {
    if (launcherElement?.isConnected) launcherElement.remove();
    if (!launcherApp) removeAllLauncherWindows();
  }, 0);
}

function getActiveModuleDiagnostics(): Array<{ id: string; title: string; version: string }> {
  const moduleCollection = game.modules as any;
  const modules = safeArray(moduleCollection?.contents ?? Array.from(moduleCollection?.values?.() ?? []));
  return modules
    .filter((foundryModule: any) => foundryModule?.active === true)
    .map((foundryModule: any) => ({
      id: String(foundryModule.id ?? ""),
      title: String(foundryModule.title ?? foundryModule.id ?? ""),
      version: String(foundryModule.version ?? "")
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function getCoreStylesheetDiagnostics(): Array<{
  path: string;
  present: boolean;
  loaded: boolean;
  href: string | null;
}> {
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>(`link[${CORE_STYLESHEET_ATTRIBUTE}]`)
  );
  return CORE_STYLESHEET_PATHS.map((path) => {
    const link = links.find((candidate) => candidate.getAttribute(CORE_STYLESHEET_ATTRIBUTE) === path) ?? null;
    return {
      path,
      present: link !== null,
      loaded: link?.sheet != null,
      href: link?.href ?? null
    };
  });
}

function getChatMessageCount(): number {
  const messages = game.messages as any;
  const count = Number(messages?.size ?? messages?.contents?.length ?? 0);
  return Number.isFinite(count) ? count : 0;
}

function collectCoreDiagnostics(): Record<string, unknown> {
  const cssDisabled = safeGetSetting(MODULE_ID, SETTING_DISABLE_CORE_CSS_FOR_DEBUGGING) === true;
  const apiOnly = isApiOnlyMode();
  const visualEffectsDisabled = safeGetSetting(MODULE_ID, SETTING_DISABLE_VISUAL_EFFECTS_FOR_DEBUGGING) === true;
  const stylesheets = getCoreStylesheetDiagnostics();
  const activeModules = getActiveModuleDiagnostics();
  const release = game.release as any;
  const system = game.system as any;

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    core: {
      version: String(game.modules.get(MODULE_ID)?.version ?? ""),
      diagnosticModeActive: apiOnly || cssDisabled || visualEffectsDisabled,
      apiOnly,
      cssDisabled,
      visualEffectsDisabled,
      stylesheets,
      launcherOpen: isRenderableLauncher(launcherApp) || hasStaleLauncherWindow(),
      registeredApps: [...registeredApps.values()].map((app) => ({
        id: app.id,
        title: app.title,
        premium: app.premium === true,
        playerVisible: app.playerVisible !== false
      })),
      registeredWhatsNewModules: [...registeredWhatsNew.keys()].sort(),
      deviceStyle: {
        effective: getEffectiveDeviceStyle(),
        client: getUserDeviceStyle(),
        forced: getForcedDeviceStyle()
      },
      formFactor: getFormFactor(),
      appOrder: getSavedAppOrder(),
      colorTheme: normalizeTheme(safeGetSetting(MODULE_ID, SETTING_THEME))
    },
    foundry: {
      version: String(release?.version ?? game.version ?? ""),
      generation: Number(release?.generation ?? 0) || null,
      build: Number(release?.build ?? 0) || null,
      systemId: String(system?.id ?? ""),
      systemVersion: String(system?.version ?? ""),
      worldId: String(game.world?.id ?? ""),
      isGM: game.user?.isGM === true
    },
    workload: {
      chatMessages: getChatMessageCount(),
      renderedChatMessages: document.querySelectorAll(".chat-message").length,
      domElements: document.getElementsByTagName("*").length,
      openApplicationWindows: document.querySelectorAll(".window-app, .application").length
    },
    browser: {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      hardwareConcurrency: navigator.hardwareConcurrency ?? null,
      deviceMemoryGb: Number((navigator as any).deviceMemory ?? 0) || null
    },
    activeModules
  };
}

function diagnosticsJson(): string {
  return JSON.stringify(collectCoreDiagnostics(), null, 2);
}

async function copyDiagnosticsToClipboard(): Promise<void> {
  const json = diagnosticsJson();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(json);
    } else if ((game as any).clipboard?.copyPlainText) {
      await (game as any).clipboard.copyPlainText(json);
    } else {
      throw new Error("No clipboard API is available.");
    }
    ui.notifications?.info?.("HoloSuite Core diagnostics copied to the clipboard.");
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not copy diagnostics.`, error);
    ui.notifications?.error?.("Could not copy diagnostics. Use Download JSON instead.");
  }
}

function downloadDiagnosticsJson(): void {
  const blob = new Blob([diagnosticsJson()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `holosuite-core-diagnostics-${timestamp}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function renderDiagnosticsHtml(): string {
  const diagnostics = collectCoreDiagnostics() as any;
  const core = diagnostics.core;
  const activeLabels = [
    core.apiOnly ? "API-only" : null,
    core.cssDisabled ? "CSS disabled" : null,
    core.visualEffectsDisabled ? "visual effects disabled" : null
  ].filter(Boolean);
  const modeLabel = activeLabels.length > 0 ? activeLabels.join(", ") : "Normal";

  return `
    <form class="standard-form holosuite-core-diagnostics">
      <p>This report stays on this browser until you copy or download it. It includes module versions and browser/workload counts, but no actor, chat-message, or campaign content.</p>
      <fieldset>
        <legend>Current test state</legend>
        <div class="form-group"><label>Diagnostic mode</label><div class="form-fields"><strong>${escapeHtml(modeLabel)}</strong></div></div>
        <div class="form-group"><label>Core version</label><div class="form-fields"><code>${escapeHtml(core.version)}</code></div></div>
        <div class="form-group"><label>Core styles loaded</label><div class="form-fields"><strong>${core.stylesheets.filter((sheet) => sheet.present).length}/${core.stylesheets.length}</strong></div></div>
        <div class="form-group"><label>Launcher</label><div class="form-fields"><strong>${core.launcherOpen ? "Open" : "Closed"}</strong></div></div>
        <div class="form-group"><label>Chat messages</label><div class="form-fields"><strong>${diagnostics.workload.chatMessages} stored / ${diagnostics.workload.renderedChatMessages} rendered</strong></div></div>
        <div class="form-group"><label>Active modules</label><div class="form-fields"><strong>${diagnostics.activeModules.length}</strong></div></div>
      </fieldset>
      <footer class="form-footer">
        <button type="button" data-action="refresh"><i class="fas fa-rotate"></i> Refresh</button>
        <button type="button" data-action="copy"><i class="fas fa-copy"></i> Copy JSON</button>
        <button type="button" data-action="download"><i class="fas fa-download"></i> Download JSON</button>
      </footer>
      <details>
        <summary>JSON preview</summary>
        <pre style="max-height: 360px; overflow: auto; user-select: text; white-space: pre-wrap;">${escapeHtml(JSON.stringify(diagnostics, null, 2))}</pre>
      </details>
    </form>
  `;
}

function bindDiagnosticsControls(root: HTMLElement | null, app: HoloSuiteDiagnostics): void {
  if (!root) return;
  root.querySelector<HTMLElement>("[data-action='refresh']")?.addEventListener("click", () => app.render(false));
  root.querySelector<HTMLElement>("[data-action='copy']")?.addEventListener("click", () => void copyDiagnosticsToClipboard());
  root.querySelector<HTMLElement>("[data-action='download']")?.addEventListener("click", downloadDiagnosticsJson);
}

class HoloSuiteDiagnostics extends LegacyApplication {
  static DEFAULT_OPTIONS = {
    id: "holosuite-core-diagnostics",
    tag: "section",
    classes: ["holosuite-core-diagnostics-window"],
    window: {
      title: "HoloSuite Core Diagnostics",
      resizable: true
    },
    position: {
      width: 720,
      height: 720
    }
  };

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-core-diagnostics",
      title: "HoloSuite Core Diagnostics",
      classes: ["holosuite-core-diagnostics-window"],
      popOut: true,
      resizable: true,
      width: 720,
      height: 720
    });
  }

  async _renderInner() {
    return $(renderDiagnosticsHtml());
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindDiagnosticsControls(unwrapHtmlElement(html), this);
  }

  async _renderHTML() {
    const wrapper = document.createElement("template");
    wrapper.innerHTML = renderDiagnosticsHtml().trim();
    return wrapper.content;
  }

  _replaceHTML(result: unknown, content: unknown) {
    const root = unwrapHtmlElement(content);
    const target = root?.querySelector<HTMLElement>(".window-content") ?? root;
    if (!target) return;
    const resultElement = result instanceof DocumentFragment || result instanceof HTMLElement
      ? result
      : unwrapHtmlElement(result);
    if (resultElement) target.replaceChildren(resultElement);
    else target.innerHTML = String(result ?? "");
    bindDiagnosticsControls(target, this);
  }

  async _updateObject() {
    // This menu is a read-only diagnostics view.
  }
}

function openBranding(id?: string): unknown {
  if (!game.user?.isGM) return null;
  brandingApp ??= new HoloSuiteBrandingEditor();
  if (typeof id === "string") brandingApp.selectTarget(id);
  return brandingApp.render(LegacyApplication === (globalThis as any).foundry?.applications?.api?.ApplicationV2
    ? { force: true } : true);
}

class HoloSuiteBrandingEditor extends LegacyApplication {
  static DEFAULT_OPTIONS = {
    id: "holosuite-branding", tag: "section", classes: ["holosuite-branding-window"],
    window: { title: "HoloSuite Branding", resizable: true }, position: { width: 660, height: "auto" }
  };

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-branding", title: "HoloSuite Branding", classes: ["holosuite-branding-window"],
      width: 660, height: "auto", resizable: true, closeOnSubmit: false
    });
  }

  private selected = DEVICE_BRANDING_ID;
  private drafts = new Map<string, HoloSuiteBranding>();
  private saving = false;

  selectTarget(id: string): void {
    this.selected = id;
  }

  private renderEditor(): string {
    const apps = getBrandingTargets();
    return `<section class="holosuite-branding-editor">
      <p>Choose a device or app. Blank fields use its defaults. Changes apply to this world.</p>
      <label>Branding for <select data-branding-select>
        <option value="${DEVICE_BRANDING_ID}">HoloSuite device</option>
        <optgroup label="Apps">${apps.map(app => `<option value="${escapeHtml(app.id)}">${escapeHtml(app.title)}</option>`).join("")}</optgroup>
      </select></label>
      ${registeredApps.size ? '<details class="holosuite-branding-apps"><summary>Browse app tiles</summary><div class="holosuite-branding-grid" data-branding-grid></div></details>' : ""}
      <div data-branding-fields></div>
    </section>`;
  }

  private bind(root: HTMLElement | null): void {
    const editor = root?.matches(".holosuite-branding-editor") ? root : root?.querySelector<HTMLElement>(".holosuite-branding-editor");
    if (!editor || !game.user?.isGM) return;
    const select = editor.querySelector<HTMLSelectElement>("[data-branding-select]")!;
    const fields = editor.querySelector<HTMLElement>("[data-branding-fields]")!;
    if (!registeredApps.has(this.selected) && !brandingTargets.has(this.selected)) this.selected = DEVICE_BRANDING_ID;
    select.value = this.selected;
    select.addEventListener("change", () => {
      this.selected = select.value;
      this.renderFields(fields);
      this.renderGrid(editor);
    });
    this.renderFields(fields);
    this.renderGrid(editor);
  }

  private renderGrid(editor: HTMLElement): void {
    const grid = editor.querySelector<HTMLElement>("[data-branding-grid]");
    if (!grid) return;
    const select = editor.querySelector<HTMLSelectElement>("[data-branding-select]")!;
    const apps = [...registeredApps.values()].sort((a, b) => a.title.localeCompare(b.title));
    grid.innerHTML = apps.map(app => `<button type="button" class="holosuite-app-tile" data-holosuite-app="${escapeHtml(app.id)}"
      aria-pressed="${app.id === this.selected}">${renderAppTileContent(app, getBranding(app.id), false)}</button>`).join("");
    grid.querySelectorAll<HTMLButtonElement>("[data-holosuite-app]").forEach(tile => {
      tile.addEventListener("click", () => {
        select.value = tile.dataset.holosuiteApp!;
        select.dispatchEvent(new Event("change"));
        editor.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      });
    });
    bindBrandingImages(grid);
  }

  private renderFields(container: HTMLElement): void {
    const id = this.selected;
    const app = registeredApps.get(id) ?? brandingTargets.get(id);
    const hasTile = registeredApps.has(id);
    const hasModuleHeader = app?.brandingInApp === true;
    const branding = this.drafts.get(id) ?? getBranding(id);
    const field = (key: string, label: string, placeholder = "", length = 100, value = branding[key], hint = "") =>
      `<label>${escapeHtml(label)}${hint ? `<small>${escapeHtml(hint)}</small>` : ""}<input name="${escapeHtml(key)}" maxlength="${length}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"></label>`;
    const asset = (key: "iconImage" | "logo", label: string) => `
      <fieldset class="holosuite-branding-asset" ${key === "iconImage" ? "data-custom-icon-image" : ""}>${field(key, label, "PNG or WebP", 2048)}
        <button type="button" data-branding-pick="${key}" aria-label="Browse or upload ${escapeHtml(label)}"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse / Upload</button>
      </fieldset>`;
    const iconMode = this.drafts.has(id) ? branding.icon : branding.iconImage ? "custom" : branding.icon;
    const iconChoice = (key: keyof HoloSuiteBranding, label: string, selected = branding[key]) =>
      `<label>${label}<select name="${key}"><option value="">Use default</option>${Object.entries(BRANDING_ICONS).map(([icon, title]) =>
        `<option value="${icon}" ${selected === icon ? "selected" : ""}>${title}</option>`).join("")}
        ${key === "icon" ? `<option value="custom" ${selected === "custom" ? "selected" : ""}>Custom image</option>` : ""}</select></label>`;
    const textFields = Object.entries(app?.brandingHeader?.textFields ?? {});
    container.innerHTML = `<form class="holosuite-branding-form">
      ${field("name", app ? "Display name" : "Device name", app?.title || "HoloSuite")}
      ${hasTile && app ? field("label", "Launcher tile label (optional)", appDisplayTitle(app.title), 48, branding.label,
        "Only shown on the HoloSuite launcher tile. Leave blank to use the display name.") : ""}
      ${iconChoice("icon", app ? "App icon" : "Launcher icon", iconMode ?? "")}
      ${asset("iconImage", hasModuleHeader ? "App icon image" : app ? "Tile icon image" : "Launcher icon image")}
      ${!app || app.brandingHeader?.taglineLabel || textFields.length ? `<details><summary>Advanced branding</summary>
        ${!app || app.brandingHeader?.taglineLabel ? asset("logo", app ? "Header logo" : "Device logo") : ""}
        ${textFields.map(([key, entry]) => {
          const { label, hint, placeholder } = typeof entry === "string" ? { label: entry } : entry;
          return field(`text.${key}`, label, placeholder, 160, branding.text?.[key], hint);
        }).join("")}
        ${app ? `${app.brandingHeader?.taglineLabel ? field("tagline", app.brandingHeader.taglineLabel, "", 160) : ""}` : `
          ${field("gmTitle", "GM window title", "HoloSuite Command Deck")}
          ${field("gmHeading", "GM home header", "GM Command Deck", 60)}
          ${field("gmScreen", "GM home title", "Apps", 48)}
          ${field("playerTitle", "Player window title", "HoloSuite Player View")}
          ${field("playerHeading", "Player home header", "Player Link", 60)}
          ${field("playerScreen", "Player home title", "Commlink", 48)}
          ${field("userLabel", "Player name label", "Active User", 48)}
          ${field("linkStatus", "Player connection label", "LINK STABLE", 48)}
          ${iconChoice("backIcon", "Back to apps icon")}${iconChoice("settingsIcon", "Settings icon")}
          ${iconChoice("updatesIcon", "What’s New icon")}${iconChoice("closeIcon", "Close icon")}`}
      </details>` : ""}
      <footer><button type="button" data-branding-reset>Reset fields</button><button type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save branding</button></footer>
    </form>`;

    const form = container.querySelector("form")!;
    const iconSelect = form.elements.namedItem("icon") as HTMLSelectElement;
    const customImage = form.querySelector<HTMLFieldSetElement>("[data-custom-icon-image]")!;
    const iconImage = form.elements.namedItem("iconImage") as HTMLInputElement;
    const readForm = (keepInactiveImage = false) => {
      const data = Object.fromEntries(new FormData(form));
      if (keepInactiveImage || iconSelect.value === "custom") data.iconImage = iconImage.value;
      const text = Object.fromEntries(textFields.map(([key]) => [key, data[`text.${key}`]]));
      return { ...data, text };
    };
    const change = () => {
      customImage.disabled = iconSelect.value !== "custom";
      this.drafts.set(id, readForm(true) as HoloSuiteBranding);
    };
    form.addEventListener("input", change);
    form.querySelector("[data-branding-reset]")?.addEventListener("click", () => {
      this.drafts.set(id, {});
      this.renderFields(container);
    });
    form.querySelectorAll<HTMLButtonElement>("[data-branding-pick]").forEach(button => {
      button.addEventListener("click", () => {
        const input = form.elements.namedItem(button.dataset.brandingPick!) as HTMLInputElement;
        const Picker = (globalThis as any).foundry?.applications?.apps?.FilePicker?.implementation
          ?? (globalThis as any).foundry?.applications?.apps?.FilePicker ?? (globalThis as any).FilePicker;
        if (!Picker) return ui.notifications?.warn?.("Foundry’s file picker is unavailable.");
        new Picker({ type: "image", current: input.value, callback: (path: string) => {
          if (!imagePath(path)) return ui.notifications?.warn?.("Choose a PNG or WebP image.");
          if (!form.isConnected || input.matches(":disabled")) return;
          input.value = path;
          change();
        } }).browse();
      });
    });
    form.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopPropagation();
      if (this.saving || !game.user?.isGM) return;
      const data = readForm();
      if ([data["iconImage"], data["logo"]].some(value => typeof value === "string" && value.trim() && !imagePath(value))) {
        ui.notifications?.warn?.("Use a valid PNG or WebP image for branding.");
        return;
      }
      const saved = { ...safeGetSetting(MODULE_ID, BRANDING_SETTING) as Record<string, unknown> };
      const draft = normalizeBranding(data);
      const pending = this.drafts.get(id);
      if (Object.keys(draft).length) Object.defineProperty(saved, id, { value: draft, enumerable: true, configurable: true });
      else delete saved[id];
      this.saving = true;
      try {
        await game.settings.set(MODULE_ID, BRANDING_SETTING, saved);
        if (this.drafts.get(id) === pending) this.drafts.delete(id);
        const editor = container.closest<HTMLElement>(".holosuite-branding-editor");
        if (editor) this.renderGrid(editor);
        ui.notifications?.info?.("HoloSuite branding saved.");
      } catch (error) {
        console.error(`${MODULE_ID} | Branding could not be saved.`, error);
        ui.notifications?.error?.("HoloSuite branding could not be saved. Try again.");
      } finally {
        this.saving = false;
      }
    });
    customImage.disabled = iconSelect.value !== "custom";
  }

  async _renderInner() { return $(this.renderEditor()); }
  activateListeners(html: unknown) { this.bind(unwrapHtmlElement(html)); }
  async _renderHTML() {
    const template = document.createElement("template");
    template.innerHTML = this.renderEditor();
    return template.content;
  }
  _replaceHTML(result: DocumentFragment, content: unknown) {
    const root = unwrapHtmlElement(content);
    if (!root) return;
    root.replaceChildren(result);
    this.bind(root);
  }
  async _updateObject() { /* The editor handles its own save. */ }
}

class HoloSuiteLauncher extends LegacyApplication {
  private currentView: LauncherView = "apps";
  private whatsNewFilter: WhatsNewFilter = "all";
  private whatsNewTab: WhatsNewTab = "releases";

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

  get title() {
    const branding = getBranding(DEVICE_BRANDING_ID);
    const isGM = game.user?.isGM === true;
    return (isGM ? branding.gmTitle : branding.playerTitle) || branding.name || super.title;
  }

  render(...args: any[]) {
    if (isApiOnlyMode()) {
      ui.notifications?.warn?.("HoloSuite Core is in API-only diagnostic mode on this browser.");
      return this;
    }
    return super.render(...args);
  }

  async _renderInner() {
    return $(renderLauncherHtml(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindLauncherControls(unwrapHtmlElement(html));
    this.resizeForFormFactor();
  }

  async _renderHTML() {
    const wrapper = document.createElement("template");
    wrapper.innerHTML = renderLauncherHtml(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim();
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
    this.resizeForFormFactor();
  }

  async close(options = {}) {
    launcherReorderMode = false;
    launcherApp = null;
    return super.close(options);
  }

  getLauncherRoot(options: { includeDocumentFallback?: boolean } = {}): HTMLElement | null {
    const element = unwrapHtmlElement((this as any).element);
    const appRoot = element?.querySelector<HTMLElement>(".holosuite-phone")
      ?? element?.closest?.(".holosuite-phone")
      ?? null;
    if (appRoot?.isConnected) return appRoot;
    if (options.includeDocumentFallback === false) return null;
    return document.querySelector<HTMLElement>("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
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

    const focused = document.activeElement;
    const choice = focused instanceof HTMLElement && screen.contains(focused) ? focused : null;
    const style = choice?.dataset.holosuiteDeviceStyle;
    const size = choice?.dataset.holosuiteFormFactorChoice;

    statusBar.innerHTML = `
      ${renderDeviceBrand()}
      ${renderHeaderActions(this.currentView)}
    `;
    const windowTitle = root.closest(".holosuite-launcher-window")?.querySelector(".window-title");
    if (windowTitle) windowTitle.textContent = this.title;
    screen.innerHTML = this.currentView === "whats-new"
      ? renderWhatsNewView(this.whatsNewFilter, this.whatsNewTab)
      : this.currentView === "settings"
        ? renderSettingsView()
        : renderAppsView();
    screen.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new");
    screen.classList.toggle("holosuite-screen--settings", this.currentView === "settings");
    bindLauncherControls(root);
    if (style || size) {
      const selector = style ? "[data-holosuite-device-style]" : "[data-holosuite-form-factor-choice]";
      [...screen.querySelectorAll<HTMLElement>(selector)].find(button =>
        style ? button.dataset.holosuiteDeviceStyle === style : button.dataset.holosuiteFormFactorChoice === size
      )?.focus({ preventScroll: true });
    }
    return true;
  }

  showApps(): void {
    this.currentView = "apps";
    if (!this.updateRenderedView()) this.render(false);
  }

  showWhatsNew(): void {
    launcherReorderMode = false;
    this.currentView = "whats-new";
    markWhatsNewSeen();
    if (!this.updateRenderedView()) this.render(false);
  }

  showSettings(): void {
    launcherReorderMode = false;
    this.currentView = "settings";
    if (!this.updateRenderedView()) this.render(false);
  }

  async setDeviceStyle(style: HoloSuiteDeviceStyle): Promise<void> {
    if (getForcedDeviceStyle() || style === getUserDeviceStyle()) return;
    await game.settings.set(MODULE_ID, SETTING_DEVICE_STYLE, style);
  }

  async setFormFactor(formFactor: HoloSuiteFormFactor): Promise<void> {
    if (formFactor === getFormFactor()) return;
    await game.settings.set(MODULE_ID, SETTING_FORM_FACTOR, formFactor);
  }

  applyAppColors(): void {
    const root = this.getLauncherRoot({ includeDocumentFallback: false });
    if (root) root.dataset.holosuiteAppColors = getAppColorMode();
  }

  resizeForFormFactor(): void {
    const element = this.getLauncherRoot({ includeDocumentFallback: false })
      ?.closest<HTMLElement>("#holosuite-launcher, .holosuite-launcher-window");
    if (!element) return;
    const dimensions = getFormFactorDimensions();
    const { left, top, width, height } = element.getBoundingClientRect();
    const position = {
      ...dimensions,
      left: Math.max(16, Math.min(left + (width - dimensions.width) / 2, window.innerWidth - dimensions.width - 16)),
      top: Math.max(16, Math.min(top + (height - dimensions.height) / 2, window.innerHeight - dimensions.height - 16))
    };
    element.style.setProperty("--hs-launcher-width", `${dimensions.width}px`);
    element.style.setProperty("--hs-launcher-height", `${dimensions.height}px`);
    try { (this as any).setPosition?.(position); } catch { /* CSS sizing remains the fallback across Foundry generations. */ }
  }

  refreshCurrentView(): void {
    if (!this.updateRenderedView()) this.render(false);
  }

  setWhatsNewFilter(filter: WhatsNewFilter): void {
    this.currentView = "whats-new";
    this.whatsNewFilter = filter;
    if (!this.updateRenderedView()) this.render(false);
  }

  setWhatsNewTab(tab: WhatsNewTab): void {
    this.currentView = "whats-new";
    this.whatsNewTab = tab;
    if (!this.updateRenderedView()) this.render(false);
  }

  async _updateObject() {
    return undefined;
  }
}

const api = {
  registerBrandingTarget(target: Pick<HoloSuiteAppRegistration, "id" | "title" | "icon">): void {
    const entry = normalizeApp({ ...target, brandingInApp: true, open: () => undefined });
    if (entry) brandingTargets.set(entry.id, entry);
  },
  registerApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null {
    const normalized = normalizeApp(app);
    if (!normalized) return null;
    registeredApps.set(normalized.id, normalized);
    if (!isApiOnlyMode()) launcherApp?.render(false);
    return normalized;
  },
  unregisterApp(id: string): boolean {
    const removed = registeredApps.delete(String(id ?? ""));
    if (removed && !isApiOnlyMode()) launcherApp?.render(false);
    return removed;
  },
  getApps(): HoloSuiteAppRegistration[] {
    return [...registeredApps.values()];
  },
  getBranding,
  hasBrandingMigration(id: string): boolean {
    const saved = safeGetSetting(MODULE_ID, BRANDING_SETTING) as Record<string, unknown> | undefined;
    return saved?.[`migration:${id}`] === true;
  },
  async migrateBranding(id: string, legacy: HoloSuiteBranding): Promise<void> {
    if (!game.user?.isGM || this.hasBrandingMigration(id)) return;
    const saved = { ...safeGetSetting(MODULE_ID, BRANDING_SETTING) as Record<string, unknown> };
    const current = getBranding(id);
    const imported = normalizeBranding(legacy);
    saved[id] = normalizeBranding({ ...current, ...imported, text: { ...current.text, ...imported.text } });
    saved[`migration:${id}`] = true;
    await game.settings.set(MODULE_ID, BRANDING_SETTING, saved);
  },
  openBranding,
  getDiagnostics(): Record<string, unknown> {
    return collectCoreDiagnostics();
  },
  registerWhatsNew(update: HoloSuiteWhatsNewRegistration): HoloSuiteWhatsNewRegistration | null {
    return registerWhatsNewInternal(update);
  },
  unregisterWhatsNew(moduleId: string): boolean {
    const removed = registeredWhatsNew.delete(String(moduleId ?? ""));
    if (removed && !isApiOnlyMode()) launcherApp?.render(false);
    return removed;
  },
  getWhatsNew(): HoloSuiteWhatsNewRegistration[] {
    return [...registeredWhatsNew.values()].sort(sortWhatsNew);
  },
  async openLauncher(): Promise<HoloSuiteLauncher | null> {
    if (isApiOnlyMode()) {
      ui.notifications?.warn?.("HoloSuite Core is in API-only diagnostic mode on this browser.");
      return null;
    }
    if (launcherOpenPromise) return launcherOpenPromise;

    launcherOpenPromise = (async () => {
      if (!isRenderableLauncher(launcherApp)) launcherApp = null;
      if (!launcherApp) launcherApp = new HoloSuiteLauncher();
      try {
        await launcherApp.render(true);
      } catch (error) {
        console.warn(`${MODULE_ID} | Recreating launcher after render failure.`, error);
        launcherApp = new HoloSuiteLauncher();
        await launcherApp.render(true);
      }
      removeDuplicateLauncherWindows(launcherApp);
      return launcherApp;
    })().finally(() => {
      launcherOpenPromise = null;
    });

    return launcherOpenPromise;
  },
  async toggleLauncher(): Promise<HoloSuiteLauncher | null> {
    if (launcherOpenPromise) return launcherOpenPromise;
    if (isRenderableLauncher(launcherApp)) {
      await requestLauncherClose();
      return null;
    }
    if (hasStaleLauncherWindow()) {
      removeAllLauncherWindows();
    }
    resetLauncherState();
    return api.openLauncher();
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
  applyCoreStylesSetting();
  applyVisualEffectsSetting();
  registerKeybindings();
  exposeApi();
  window.addEventListener("resize", () => launcherApp?.resizeForFormFactor());
});

Hooks.on("getSceneControlButtons", renderOpenLauncherControl);
Hooks.on("renderSceneControls", (_app: unknown, html: unknown) => injectRenderedLauncherControl(html));
Hooks.on("renderSidebar", removeSidebarLaunchers);
Hooks.on("renderSidebarTab", removeSidebarLaunchers);
Hooks.on("renderSettingsConfig", organizeCoreSettings);
for (const hook of ["renderApplication", "renderApplicationV1", "renderApplicationV2"]) {
  Hooks.on(hook, (app: { element?: unknown }, html: unknown) => {
    const root = unwrapHtmlElement(app.element) ?? unwrapHtmlElement(html);
    if (root) refreshModuleBranding(root, getBranding);
  });
}
Hooks.on("holosuite-core.renderBranding", (root: HTMLElement) => refreshModuleBranding(root, getBranding));

Hooks.once("ready", () => {
  coreReady = true;
  exposeApi();
  applyFoundryGenerationMarker();
  applySavedDeviceStyle();
  applySavedTheme();
  applySavedFormFactor();
  if (isApiOnlyMode()) {
    console.warn(`${MODULE_ID} | API-only diagnostic mode is enabled on this browser.`);
  } else {
    removeSidebarLaunchers();
    void loadBundledWhatsNewCatalog();
  }
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
