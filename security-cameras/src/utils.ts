// @ts-nocheck
export function createCameraId(): string {
  if (foundry?.utils?.randomID) return foundry.utils.randomID();
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getDeepClone<T>(value: T): T {
  if (foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function escapeHTML(value: unknown): string {
  if (foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value));
  const element = document.createElement("div");
  element.innerText = String(value);
  return element.innerHTML;
}
