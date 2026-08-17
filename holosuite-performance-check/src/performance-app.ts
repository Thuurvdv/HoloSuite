import { MODULE_ID, MODULE_TITLE } from "./constants";
import { beginPreexistingAttribution } from "./instrumentation";
import { profiler } from "./profiler";
import { downloadText, reportSummaryText, reportsToCsv, reportToCsv, safeFilename, summarizeSources } from "./report";
import type { CaptureReport } from "./types";

function applicationBase(): any {
  const root = globalThis as any;
  return root.Application
    ?? root.foundry?.appv1?.api?.Application
    ?? root.foundry?.applications?.api?.ApplicationV2;
}

function escapeHtml(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatMs(value: number): string {
  if (value < 1) return `${value.toFixed(3)} ms`;
  return `${value.toFixed(2)} ms`;
}

function unwrapHtml(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (value && typeof (value as any).get === "function") return (value as any).get(0) ?? null;
  if (Array.isArray(value) && value[0] instanceof HTMLElement) return value[0];
  return null;
}

function reportHtml(report: CaptureReport | null): string {
  if (!report) {
    return `<section class="hspc-empty">
      <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
      <h3>No completed capture yet</h3>
      <p>Start a capture, perform one repeatable action, and stop it from the Token Controls button or the keybinding.</p>
    </section>`;
  }

  const summaries = summarizeSources(report);
  const sourceRows = summaries.slice(0, 20).map((summary) => `<tr>
    <td><code>${escapeHtml(summary.source)}</code></td>
    <td>${summary.calls}</td>
    <td>${formatMs(summary.syncTotalMs)}</td>
    <td>${formatMs(summary.maxMs)}</td>
    <td>${summary.asyncCompletions}</td>
    <td>${summary.errors}</td>
  </tr>`).join("");
  const metricRows = report.metrics.slice(0, 40).map((metric) => `<tr>
    <td><code>${escapeHtml(metric.source)}</code></td>
    <td>${escapeHtml(metric.kind)}</td>
    <td title="${escapeHtml(metric.label)}">${escapeHtml(metric.label)}</td>
    <td>${metric.calls}</td>
    <td>${formatMs(metric.syncTotalMs)}</td>
    <td>${formatMs(metric.maxMs)}</td>
    <td>${formatMs(metric.p95Ms)}</td>
  </tr>`).join("");
  const moduleRows = report.modules.map((entry) => `<tr><td><code>${escapeHtml(entry.id)}</code></td><td>${escapeHtml(entry.version)}</td><td>${escapeHtml(entry.title)}</td></tr>`).join("");
  const stylesheetCounts = new Map<string, { sheets: number; rules: number; inaccessible: number }>();
  for (const sheet of report.stylesheets) {
    const count = stylesheetCounts.get(sheet.source) ?? { sheets: 0, rules: 0, inaccessible: 0 };
    count.sheets += 1;
    if (sheet.ruleCount === null) count.inaccessible += 1;
    else count.rules += sheet.ruleCount;
    stylesheetCounts.set(sheet.source, count);
  }
  const styleRows = [...stylesheetCounts.entries()]
    .sort((a, b) => b[1].rules - a[1].rules)
    .map(([source, value]) => `<tr><td><code>${escapeHtml(source)}</code></td><td>${value.sheets}</td><td>${value.rules}</td><td>${value.inaccessible}</td></tr>`)
    .join("");

  return `<section class="hspc-report">
    <div class="hspc-cards">
      <article><span>Capture window</span><strong>${formatMs(report.durationMs)}</strong></article>
      <article><span>Mode</span><strong>${report.deepMode ? "Deep" : "Normal"}</strong></article>
      <article><span>Active modules</span><strong>${report.modules.length}</strong></article>
      <article><span>Long tasks</span><strong>${report.longTasks.length}</strong></article>
      <article><span>DOM mutations</span><strong>${report.deepMode ? report.dom.records : "Not measured"}</strong></article>
      <article><span>Dropped events</span><strong>${report.droppedTimelineEvents}</strong></article>
    </div>
    <p class="hspc-caveat"><i class="fa-solid fa-circle-info"></i> Callback times are inclusive and can overlap. Style/layout, GPU, garbage collection, and other browser work remain unattributed.</p>
    <details open>
      <summary>Observed sources</summary>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Calls</th><th>Inclusive time</th><th>Longest</th><th>Async</th><th>Errors</th></tr></thead><tbody>${sourceRows || '<tr><td colspan="6">No instrumented callbacks were observed.</td></tr>'}</tbody></table></div>
    </details>
    <details open>
      <summary>Slowest operations</summary>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Kind</th><th>Operation</th><th>Calls</th><th>Total</th><th>Max</th><th>p95</th></tr></thead><tbody>${metricRows || '<tr><td colspan="7">No operations were measured.</td></tr>'}</tbody></table></div>
    </details>
    <details>
      <summary>Environment and active modules</summary>
      <dl class="hspc-environment">
        <dt>Foundry</dt><dd>${escapeHtml(report.environmentStart.foundryVersion)}</dd>
        <dt>System</dt><dd>${escapeHtml(report.environmentStart.systemId)} ${escapeHtml(report.environmentStart.systemVersion)}</dd>
        <dt>Scene</dt><dd>${escapeHtml(report.environmentStart.sceneName)}</dd>
        <dt>Viewport</dt><dd>${escapeHtml(report.environmentStart.viewport)} @ ${report.environmentStart.devicePixelRatio}x</dd>
        <dt>DOM nodes</dt><dd>${report.environmentStart.domNodes} → ${report.environmentEnd.domNodes}</dd>
      </dl>
      <div class="hspc-table-wrap"><table><thead><tr><th>Module ID</th><th>Version</th><th>Title</th></tr></thead><tbody>${moduleRows}</tbody></table></div>
    </details>
    <details>
      <summary>Stylesheet footprint</summary>
      <p>Rule counts describe loaded CSS only; they do not measure selector cost.</p>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Sheets</th><th>Accessible rules</th><th>Inaccessible</th></tr></thead><tbody>${styleRows}</tbody></table></div>
    </details>
  </section>`;
}

function historyComparisonHtml(reports: readonly CaptureReport[]): string {
  if (!reports.length) return "";
  const groups = new Map<string, CaptureReport[]>();
  for (const report of reports) {
    const entries = groups.get(report.label) ?? [];
    entries.push(report);
    groups.set(report.label, entries);
  }
  const medianOf = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };
  const rows = [...groups.entries()].map(([label, entries]) => {
    const inclusive = entries.map((entry) => entry.metrics.reduce((total, metric) => total + metric.syncTotalMs, 0)).sort((a, b) => a - b);
    const p95 = inclusive[Math.min(inclusive.length - 1, Math.ceil(inclusive.length * 0.95) - 1)];
    const windows = entries.map((entry) => entry.durationMs);
    const longTasks = entries.map((entry) => entry.longTasks.reduce((total, task) => total + task.durationMs, 0));
    return `<tr><td>${escapeHtml(label)}</td><td>${entries.length}</td><td>${formatMs(medianOf(inclusive))}</td><td>${formatMs(p95)}</td><td>${formatMs(medianOf(windows))}</td><td>${formatMs(medianOf(longTasks))}</td></tr>`;
  }).join("");
  return `<details ${groups.size > 1 || reports.length > 1 ? "open" : ""}>
    <summary>Capture comparison by exact label</summary>
    <p>Use the same label for repeated runs. Inclusive callback totals can overlap; the capture window includes human start/stop time.</p>
    <div class="hspc-table-wrap"><table><thead><tr><th>Label</th><th>Runs</th><th>Inclusive median</th><th>Inclusive p95</th><th>Window median</th><th>Long-task median</th></tr></thead><tbody>${rows}</tbody></table></div>
  </details>`;
}

const BaseApplication = applicationBase();

export class PerformanceCheckApp extends BaseApplication {
  private selectedReportId: string | null = null;

  static DEFAULT_OPTIONS = {
    id: MODULE_ID,
    tag: "section",
    classes: ["hspc-window"],
    window: { title: MODULE_TITLE, resizable: true },
    position: { width: 980, height: 760 }
  };

  static get defaultOptions() {
    return (globalThis as any).foundry.utils.mergeObject(super.defaultOptions ?? {}, {
      id: MODULE_ID,
      title: MODULE_TITLE,
      classes: ["hspc-window"],
      popOut: true,
      resizable: true,
      width: 980,
      height: 760
    });
  }

  private selectedReport(): CaptureReport | null {
    return profiler.history.find((entry) => entry.id === this.selectedReportId) ?? profiler.latest;
  }

  private content(): string {
    const active = profiler.liveState;
    const selected = this.selectedReport();
    const history = profiler.history.map((entry) => `<option value="${escapeHtml(entry.id)}" ${entry.id === selected?.id ? "selected" : ""}>${escapeHtml(entry.label)} — ${new Date(entry.startedAt).toLocaleString()}</option>`).join("");
    return `<main class="hspc-shell">
      <header class="hspc-header">
        <div><p class="hspc-kicker">LOCAL PROFILER</p><h2>${MODULE_TITLE}</h2><p>Measure one repeatable Foundry action without sending data anywhere.</p></div>
        <div class="hspc-status ${active ? "is-recording" : ""}"><span></span>${active ? `Recording: ${escapeHtml(active.label)}` : "Ready"}</div>
      </header>
      <section class="hspc-controls">
        <label>Capture label<input type="text" name="capture-label" value="${escapeHtml(selected?.label ?? `Test ${profiler.history.length + 1}`)}" ${active ? "disabled" : ""}></label>
        <label class="hspc-check"><input type="checkbox" name="deep-mode" ${active ? "disabled" : ""}> Deep mode</label>
        <button type="button" data-action="start" ${active ? "disabled" : ""}><i class="fa-solid fa-circle"></i> Start clean capture</button>
        <button type="button" data-action="stop" ${active ? "" : "disabled"}><i class="fa-solid fa-stop"></i> Stop</button>
        <button type="button" data-action="mark" ${active ? "" : "disabled"}><i class="fa-solid fa-bookmark"></i> Mark</button>
      </section>
      <section class="hspc-history">
        <label>Completed capture<select name="report">${history || '<option value="">No reports</option>'}</select></label>
        <button type="button" data-action="json" ${selected ? "" : "disabled"}>Export JSON</button>
        <button type="button" data-action="csv" ${selected ? "" : "disabled"}>Export CSV</button>
        <button type="button" data-action="all-csv" ${profiler.history.length ? "" : "disabled"}>All CSV</button>
        <button type="button" data-action="copy" ${selected ? "" : "disabled"}>Copy summary</button>
        <button type="button" data-action="clear" ${profiler.history.length && !active ? "" : "disabled"}>Clear</button>
      </section>
      ${historyComparisonHtml(profiler.history)}
      ${reportHtml(selected)}
    </main>`;
  }

  async _renderInner() {
    return (globalThis as any).$(this.content());
  }

  async _renderHTML() {
    const template = document.createElement("template");
    template.innerHTML = this.content().trim();
    return template.content;
  }

  _replaceHTML(result: unknown, content: unknown) {
    const root = unwrapHtml(content);
    const target = root?.querySelector<HTMLElement>(".window-content") ?? root;
    if (!target) return;
    const resultElement = result instanceof DocumentFragment || result instanceof HTMLElement ? result : unwrapHtml(result);
    if (resultElement) target.replaceChildren(resultElement);
    else target.innerHTML = String(result ?? "");
    this.bind(target);
  }

  activateListeners(html: unknown) {
    super.activateListeners(html);
    const root = unwrapHtml(html);
    if (root) this.bind(root);
  }

  private bind(root: HTMLElement): void {
    root.querySelector<HTMLSelectElement>('[name="report"]')?.addEventListener("change", (event) => {
      this.selectedReportId = (event.currentTarget as HTMLSelectElement).value || null;
      this.render(false);
    });
    for (const button of root.querySelectorAll<HTMLButtonElement>("[data-action]")) {
      button.addEventListener("click", () => this.handleAction(button.dataset.action ?? "", root));
    }
  }

  private async handleAction(action: string, root: HTMLElement): Promise<void> {
    const notify = (message: string) => (globalThis as any).ui?.notifications?.info?.(message);
    try {
      if (action === "start") {
        const label = root.querySelector<HTMLInputElement>('[name="capture-label"]')?.value;
        const deepMode = root.querySelector<HTMLInputElement>('[name="deep-mode"]')?.checked === true;
        await beginPreexistingAttribution();
        await this.close();
        window.setTimeout(() => {
          profiler.start({ label, deepMode });
        }, 150);
        return;
      }
      if (action === "stop") {
        const report = profiler.stop();
        this.selectedReportId = report.id;
        this.render(false);
        return;
      }
      if (action === "mark") {
        profiler.mark("Manual marker");
        notify(`${MODULE_TITLE}: marker added.`);
        return;
      }
      if (action === "clear") {
        profiler.clear();
        this.selectedReportId = null;
        this.render(false);
        return;
      }
      if (action === "all-csv") {
        downloadText("holosuite-performance-captures.csv", reportsToCsv(profiler.history), "text/csv;charset=utf-8");
        return;
      }
      const report = this.selectedReport();
      if (!report) return;
      const filename = `${safeFilename(report.label)}-${report.id.slice(0, 8)}`;
      if (action === "json") downloadText(`${filename}.json`, JSON.stringify(report, null, 2), "application/json");
      if (action === "csv") downloadText(`${filename}.csv`, reportToCsv(report), "text/csv;charset=utf-8");
      if (action === "copy") {
        await navigator.clipboard.writeText(reportSummaryText(report));
        notify(`${MODULE_TITLE}: summary copied.`);
      }
    } catch (error) {
      console.error(`${MODULE_ID} | Action failed.`, error);
      (globalThis as any).ui?.notifications?.error?.(`${MODULE_TITLE}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

let app: PerformanceCheckApp | null = null;

export function openPerformanceCheck(): PerformanceCheckApp {
  if (!app) app = new PerformanceCheckApp();
  app.render(true);
  return app;
}

export function stopAndOpenPerformanceCheck(): CaptureReport | null {
  let report: CaptureReport | null = null;
  if (profiler.liveState) report = profiler.stop();
  const instance = openPerformanceCheck();
  if (report) (instance as any).selectedReportId = report.id;
  return report;
}
