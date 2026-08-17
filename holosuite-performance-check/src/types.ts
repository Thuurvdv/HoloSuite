export type MetricKind = "hook" | "timeout" | "interval" | "animation-frame" | "socket";

export interface MetricAggregate {
  key: string;
  kind: MetricKind;
  source: string;
  label: string;
  calls: number;
  syncTotalMs: number;
  asyncCompletions: number;
  asyncWallTotalMs: number;
  maxMs: number;
  p50Ms: number;
  p95Ms: number;
  errors: number;
}

export interface TimelineEvent {
  offsetMs: number;
  durationMs: number;
  kind: MetricKind | "long-task" | "marker";
  source: string;
  label: string;
  error?: boolean;
}

export interface LongTaskRecord {
  offsetMs: number;
  durationMs: number;
  name: string;
}

export interface ResourceRecord {
  offsetMs: number;
  durationMs: number;
  source: string;
  initiatorType: string;
  name: string;
}

export interface ModuleSnapshot {
  id: string;
  title: string;
  version: string;
}

export interface StylesheetSnapshot {
  source: string;
  href: string;
  ruleCount: number | null;
  disabled: boolean;
}

export interface EnvironmentSnapshot {
  capturedAt: string;
  foundryVersion: string;
  systemId: string;
  systemVersion: string;
  worldId: string;
  sceneId: string;
  sceneName: string;
  userRole: number | string;
  browser: string;
  hardwareConcurrency: number | null;
  deviceMemoryGb: number | null;
  viewport: string;
  devicePixelRatio: number;
  domNodes: number;
  openWindows: number;
}

export interface DomActivity {
  batches: number;
  records: number;
  addedNodes: number;
  removedNodes: number;
  attributeChanges: number;
}

export interface CaptureReport {
  schemaVersion: 1;
  id: string;
  label: string;
  deepMode: boolean;
  startedAt: string;
  durationMs: number;
  environmentStart: EnvironmentSnapshot;
  environmentEnd: EnvironmentSnapshot;
  modules: ModuleSnapshot[];
  stylesheets: StylesheetSnapshot[];
  metrics: MetricAggregate[];
  timeline: TimelineEvent[];
  longTasks: LongTaskRecord[];
  resources: ResourceRecord[];
  dom: DomActivity;
  droppedTimelineEvents: number;
  notes: string[];
}

export interface CaptureOptions {
  label?: string;
  deepMode?: boolean;
}

export interface LiveCaptureState {
  id: string;
  label: string;
  deepMode: boolean;
  startedAt: string;
  startedAtPerformance: number;
}
