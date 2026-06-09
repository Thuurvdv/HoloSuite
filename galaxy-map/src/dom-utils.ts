// @ts-nocheck
export function slugify(value: unknown): string {
  return String(value || "galaxy-map")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "galaxy-map";
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function escapeHtml(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

export function optionList(options: Array<string | { value: string; label: string }>, selected: unknown): string {
  return options.map((option) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

export function documentOptions(collection: any, selectedId: unknown): string {
  const documents = collection?.contents ?? [];
  return [
    { value: "", label: "None" },
    ...documents.map((doc) => ({ value: doc.id, label: doc.name }))
  ].map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === selectedId ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("");
}

export function getHtmlElement(html: any): any {
  return html?.[0] ?? html ?? null;
}

export function getFormValues(html: any): any {
  const element = getHtmlElement(html);
  const form = element?.matches?.("form") ? element : element?.querySelector("form");
  return Object.fromEntries(new FormData(form).entries());
}
