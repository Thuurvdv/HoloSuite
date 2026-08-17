type SceneControl = { name?: string; tools?: unknown };
type SceneControlTool = { name: string; order?: number; [key: string]: unknown };

function isRecord(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function findTokenControl(controls: unknown): SceneControl | null {
  if (Array.isArray(controls)) {
    return controls.find((control) => isRecord(control) && ["tokens", "token"].includes(String(control.name ?? ""))) ?? null;
  }
  if (!isRecord(controls)) return null;
  return controls.tokens ?? controls.token ?? Object.values(controls).find((control) => (
    isRecord(control) && ["tokens", "token"].includes(String(control.name ?? ""))
  )) ?? null;
}

export function addPerformanceControl(controls: unknown, tool: SceneControlTool): boolean {
  const control = findTokenControl(controls);
  if (!control) return false;
  const tools = control.tools;
  if (Array.isArray(tools)) {
    if (tools.some((candidate) => candidate?.name === tool.name)) return false;
    tools.push(tool);
    return true;
  }
  if (!isRecord(tools) || tools[tool.name]) return false;
  const orders = Object.values(tools).map((entry) => Number(entry?.order)).filter(Number.isFinite);
  tools[tool.name] = { ...tool, order: tool.order ?? (orders.length ? Math.max(...orders) + 1 : 0) };
  return true;
}
