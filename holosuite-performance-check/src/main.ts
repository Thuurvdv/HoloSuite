import { MODULE_ID, MODULE_TITLE } from "./constants";
import { beginPreexistingAttribution, installHookInstrumentation } from "./instrumentation";
import { openPerformanceCheck, stopAndOpenPerformanceCheck } from "./performance-app";
import { profiler } from "./profiler";
import { reportSummaryText, reportsToCsv, reportToCsv } from "./report";
import { addPerformanceControl } from "./scene-controls";

const hookInstrumentation = installHookInstrumentation();
let lastControlActivation = 0;

const api = {
  open: openPerformanceCheck,
  start: (options: { label?: string; deepMode?: boolean } = {}) => profiler.start(options),
  stop: () => profiler.stop(),
  mark: (label: string) => profiler.mark(label),
  get active() { return profiler.liveState; },
  get reports() { return profiler.history; },
  get latest() { return profiler.latest; },
  toCsv: reportToCsv,
  allToCsv: () => reportsToCsv(profiler.history),
  toSummary: reportSummaryText
};

function exposeApi(): void {
  const currentGame = (globalThis as any).game;
  currentGame.holosuitePerformanceCheck = api;
  const moduleEntry = currentGame.modules?.get?.(MODULE_ID);
  if (moduleEntry) {
    try {
      moduleEntry.api = api;
    } catch {
      // game.holosuitePerformanceCheck remains the supported fallback.
    }
  }
}

function activateControl(): void {
  const now = Date.now();
  if (now - lastControlActivation < 100) return;
  lastControlActivation = now;
  if (profiler.liveState) stopAndOpenPerformanceCheck();
  else openPerformanceCheck();
}

(globalThis as any).Hooks.once("init", () => {
  const currentGame = (globalThis as any).game;
  currentGame.keybindings.register(MODULE_ID, "toggle-capture", {
    name: `${MODULE_TITLE}: Open / Stop Capture`,
    hint: "Open the profiler when idle, or stop the current capture and show its report.",
    editable: [{ key: "KeyP", modifiers: ["ALT", "SHIFT"] }],
    onDown: () => {
      if (profiler.liveState) stopAndOpenPerformanceCheck();
      else openPerformanceCheck();
      return true;
    },
    restricted: false,
    precedence: 0
  });
  exposeApi();
});

(globalThis as any).Hooks.on("getSceneControlButtons", (controls: unknown) => {
  addPerformanceControl(controls, {
    name: MODULE_ID,
    title: profiler.liveState ? `${MODULE_TITLE}: Stop Capture` : MODULE_TITLE,
    icon: profiler.liveState ? "fa-solid fa-stop" : "fa-solid fa-chart-line",
    button: true,
    visible: true,
    onClick: activateControl,
    onChange: (...args: unknown[]) => {
      if (args.some((value) => value === false)) return;
      activateControl();
    }
  });
});

(globalThis as any).Hooks.once("ready", () => {
  exposeApi();
  console.info(`${MODULE_ID} | Ready. Hook instrumentation: ${hookInstrumentation.installed ? "active" : "unavailable"}; preexisting callbacks wrapped: ${hookInstrumentation.existingWrapped}.`);
  void beginPreexistingAttribution().then((result) => {
    console.info(`${MODULE_ID} | Preexisting hook attribution: ${result.resolved}/${result.total} resolved, ${result.ambiguous} ambiguous, ${result.unresolved} unresolved across ${result.scriptsScanned} scripts.`);
  });
});
