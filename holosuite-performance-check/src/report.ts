import type { CaptureReport, MetricAggregate } from "./types.js";

export interface SourceSummary {
  source: string;
  calls: number;
  syncTotalMs: number;
  maxMs: number;
  asyncCompletions: number;
  asyncWallTotalMs: number;
  errors: number;
}

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function summarizeSources(report: CaptureReport): SourceSummary[] {
  const summaries = new Map<string, SourceSummary>();
  for (const metric of report.metrics) {
    const summary = summaries.get(metric.source) ?? {
      source: metric.source,
      calls: 0,
      syncTotalMs: 0,
      maxMs: 0,
      asyncCompletions: 0,
      asyncWallTotalMs: 0,
      errors: 0
    };
    summary.calls += metric.calls;
    summary.syncTotalMs += metric.syncTotalMs;
    summary.maxMs = Math.max(summary.maxMs, metric.maxMs);
    summary.asyncCompletions += metric.asyncCompletions;
    summary.asyncWallTotalMs += metric.asyncWallTotalMs;
    summary.errors += metric.errors;
    summaries.set(metric.source, summary);
  }
  return [...summaries.values()]
    .map((summary) => ({
      ...summary,
      syncTotalMs: round(summary.syncTotalMs),
      asyncWallTotalMs: round(summary.asyncWallTotalMs),
      maxMs: round(summary.maxMs)
    }))
    .sort((a, b) => b.syncTotalMs - a.syncTotalMs);
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function reportToCsv(report: CaptureReport): string {
  const headers = [
    "capture",
    "started_at",
    "duration_ms",
    "deep_mode",
    "source",
    "kind",
    "operation",
    "calls",
    "sync_total_ms",
    "max_ms",
    "p50_ms",
    "p95_ms",
    "async_completions",
    "async_wall_total_ms",
    "errors"
  ];
  const rows = report.metrics.map((metric: MetricAggregate) => [
    report.label,
    report.startedAt,
    report.durationMs,
    report.deepMode,
    metric.source,
    metric.kind,
    metric.label,
    metric.calls,
    metric.syncTotalMs,
    metric.maxMs,
    metric.p50Ms,
    metric.p95Ms,
    metric.asyncCompletions,
    metric.asyncWallTotalMs,
    metric.errors
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function reportsToCsv(reports: readonly CaptureReport[]): string {
  if (!reports.length) return "";
  const [header] = reportToCsv(reports[0]).split("\r\n");
  const rows = reports.flatMap((report) => reportToCsv(report).split("\r\n").slice(1));
  return [header, ...rows].join("\r\n");
}

export function reportSummaryText(report: CaptureReport): string {
  const env = report.environmentStart;
  const sources = summarizeSources(report).slice(0, 10);
  const lines = [
    `# ${report.label}`,
    "",
    `- Captured: ${report.startedAt}`,
    `- Duration: ${report.durationMs.toFixed(1)} ms`,
    `- Mode: ${report.deepMode ? "Deep" : "Normal"}`,
    `- Foundry: ${env.foundryVersion}`,
    `- System: ${env.systemId} ${env.systemVersion}`,
    `- Scene: ${env.sceneName}`,
    `- Viewport: ${env.viewport} @ ${env.devicePixelRatio}x`,
    `- Active modules: ${report.modules.length}`,
    `- Long tasks: ${report.longTasks.length}`,
    "",
    "## Top observed sources",
    "",
    "| Source | Calls | Inclusive sync time | Longest | Async completions | Errors |",
    "|---|---:|---:|---:|---:|---:|",
    ...sources.map((source) => `| ${source.source} | ${source.calls} | ${source.syncTotalMs.toFixed(2)} ms | ${source.maxMs.toFixed(2)} ms | ${source.asyncCompletions} | ${source.errors} |`),
    "",
    "Inclusive callback totals may overlap. Browser style/layout/GPU/GC work and callbacks registered before attribution was available can remain unattributed."
  ];
  return lines.join("\n");
}

export function downloadText(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function safeFilename(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "performance-capture";
}
