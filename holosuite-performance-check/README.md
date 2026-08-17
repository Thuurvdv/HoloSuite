# HoloSuite Performance Check

HoloSuite Performance Check is a standalone, local Foundry VTT v13 profiler. It does not require HoloSuite Core and does not send telemetry anywhere.

## What it measures

- Foundry hook callbacks, grouped by the module or system that registered them.
- Call counts, inclusive synchronous duration, longest call, median, p95, and errors.
- Browser long tasks and resource timing.
- Exact active module versions, Foundry/system versions, viewport, scene, DOM size, and loaded stylesheet rule counts.
- In optional **Deep mode**: newly scheduled timeouts, intervals, animation-frame callbacks, socket sends/acknowledgements, and DOM mutations.
- A bounded event timeline plus JSON, CSV, and Markdown-summary exports.

## Recommended test workflow

1. Duplicate the world and use one GM client with no connected players.
2. Close character sheets and other application windows.
3. Open Performance Check from Token Controls or press **Alt+Shift+P**.
4. Enter a useful label such as `Core on - Fireball 01`.
5. Start a **Normal** capture. The profiler window closes before recording begins.
6. Perform exactly one repeatable action.
7. Click the Performance Check Token Control or press **Alt+Shift+P** to stop and open the report.
8. Run one discarded warm-up, then at least ten measured samples per configuration.
9. Export JSON for full evidence. Use CSV for spreadsheets and Copy Summary for GitHub issues.

Keep the same capture label for all repetitions of one configuration. The comparison table groups exact labels and reports inclusive callback-time, capture-window, and browser-long-task medians. **All CSV** exports every in-memory capture together. The capture window includes human start/stop time and is context, not a precise action benchmark.

Use Deep mode only after a normal capture reveals a suspicious period. Deep instrumentation observes more browser APIs and therefore adds more measurement overhead.

## Reading the report

The source table shows observed callbacks, not a magical percentage of all browser work. Callback totals are **inclusive**, so nested callbacks can overlap and must not be added together as total CPU use. Asynchronous wall time can also overlap other activity.

The following work cannot always be assigned to a module from inside Foundry:

- CSS selector matching and style recalculation
- Layout and paint
- Pixi/GPU work
- Garbage collection
- Remote work performed on another GM/player client
- Callbacks registered before this module could observe their registration

Those costs remain explicitly unattributed. Run the profiler on both the initiating client and the active GM when socket work is under investigation.

## Console API

The supported API is available at `game.holosuitePerformanceCheck` and `game.modules.get("holosuite-performance-check").api`.

```js
game.holosuitePerformanceCheck.start({ label: "Fireball", deepMode: false });
game.holosuitePerformanceCheck.mark("Damage card appeared");
const report = game.holosuitePerformanceCheck.stop();
console.log(report);
```

Reports are held only in memory and disappear when Foundry reloads unless exported.
