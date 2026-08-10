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

export function documentCheckboxes(collection: any, selectedIds: unknown, name: string): string {
  const documents = collection?.contents ?? [];
  const selected = new Set(Array.isArray(selectedIds) ? selectedIds.map(String) : selectedIds ? [String(selectedIds)] : []);
  const knownIds = new Set(documents.map((doc) => String(doc.id)));
  const options = [
    ...documents.map((doc) => ({ value: String(doc.id), label: String(doc.name || doc.id), missing: false })),
    ...[...selected]
      .filter((id) => !knownIds.has(id))
      .map((id) => ({ value: id, label: `Missing scene (${id})`, missing: true }))
  ];

  if (!options.length) return '<p class="gmf-scene-picker__empty">No scenes exist in this world yet.</p>';
  return options.map((option) => `
    <label class="gmf-scene-picker__option ${option.missing ? "is-missing" : ""}">
      <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(option.value)}" ${selected.has(option.value) ? "checked" : ""} />
      <span>${escapeHtml(option.label)}</span>
    </label>
  `).join("");
}

export function getHtmlElement(html: any): any {
  return html?.[0] ?? html ?? null;
}

export function getFormValues(html: any): any {
  const element = getHtmlElement(html);
  const form = element?.matches?.("form") ? element : element?.querySelector("form");
  const values: Record<string, any> = {};
  for (const [name, value] of new FormData(form).entries()) {
    if (values[name] === undefined) values[name] = value;
    else if (Array.isArray(values[name])) values[name].push(value);
    else values[name] = [values[name], value];
  }
  return values;
}
