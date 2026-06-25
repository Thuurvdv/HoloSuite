type SceneControl = {
  name?: string;
  tools?: unknown;
};

type SceneControlTool = {
  name: string;
  order?: number;
  [key: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNamedControl(control: unknown, names: string[]): control is SceneControl {
  if (!isRecord(control)) return false;
  return names.includes(String(control.name ?? ""));
}

function isFallbackControl(control: unknown): control is SceneControl {
  if (!isRecord(control) || !("tools" in control)) return false;
  const name = String(control.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(name);
}

function findControl(controls: unknown, names: string[], allowFallback: boolean): SceneControl | null {
  if (Array.isArray(controls)) {
    return controls.find((control) => isNamedControl(control, names))
      ?? (allowFallback ? controls.find(isFallbackControl) : null)
      ?? null;
  }

  if (!isRecord(controls)) return null;
  for (const name of names) {
    if (isRecord(controls[name])) return controls[name];
  }
  return Object.values(controls).find((control) => isNamedControl(control, names))
    ?? (allowFallback ? Object.values(controls).find(isFallbackControl) : null)
    ?? null;
}

function nextToolOrder(tools: Record<string, any>): number {
  const orders = Object.values(tools)
    .map((tool) => Number(tool?.order))
    .filter(Number.isFinite);
  return orders.length ? Math.max(...orders) + 1 : Object.keys(tools).length;
}

export function addSceneControlTool(
  controls: unknown,
  tool: SceneControlTool,
  controlNames = ["tokens", "token"],
  options: { allowFallback?: boolean } = {}
): boolean {
  const control = findControl(controls, controlNames, options.allowFallback === true);
  if (!control) return false;

  const tools = control.tools;
  if (Array.isArray(tools)) {
    if (tools.some((candidate) => candidate?.name === tool.name)) return false;
    tools.push(tool);
    return true;
  }

  if (!isRecord(tools) || tools[tool.name]) return false;
  tools[tool.name] = { ...tool, order: tool.order ?? nextToolOrder(tools) };
  return true;
}
