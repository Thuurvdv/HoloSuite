declare const foundry: any;
declare const FilePicker: any;

export function slugify(value: unknown): string {
  return String(value || "galaxy-map")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "galaxy-map";
}

export function downloadJson(filename: string, data: unknown): void {
  const json = JSON.stringify(data, null, 2);
  const saveFile = (globalThis as any).saveDataToFile;
  if (typeof saveFile === "function") {
    saveFile(json, "application/json", filename);
    return;
  }

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function escapeHtml(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

/** Dialog render hooks hand over jQuery on v12; everything else passes the element. */
export function getHtmlElement(html: any): any {
  return html?.[0] ?? html ?? null;
}

function notifyChanged(input: HTMLInputElement) {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

type FilePickerConstructor = new (options: {
  type: string;
  current: string;
  callback: (path: string) => void;
}) => { browse: () => unknown };

/** Resolve Foundry's configured picker across the v12 wrapper and v13/v14 class exports. */
export function getFilePickerClass(scope: any = globalThis): FilePickerConstructor | null {
  const namespacedPicker = scope.foundry?.applications?.apps?.FilePicker;
  const configuredPicker = namespacedPicker?.implementation;
  if (typeof configuredPicker === "function") return configuredPicker as FilePickerConstructor;
  if (typeof namespacedPicker === "function") return namespacedPicker as FilePickerConstructor;

  // Foundry v12 exposes FilePicker as a global lexical binding. In some system
  // environments it is deliberately absent from globalThis, so check it directly.
  const legacyPicker = typeof FilePicker === "function" ? FilePicker : scope.FilePicker;
  return typeof legacyPicker === "function" ? legacyPicker as FilePickerConstructor : null;
}

/** Wires every Browse and Clear button under `root` to the input named in its data attribute. */
export function bindFilePickerFields(root: ParentNode) {
  const findInput = (name?: string) => (name ? root.querySelector<HTMLInputElement>(`[name="${name}"]`) : null);
  root.querySelectorAll<HTMLElement>("[data-browse-target]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const input = findInput(button.dataset.browseTarget);
      if (!input) return;
      const FilePickerClass = getFilePickerClass();
      if (!FilePickerClass) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new FilePickerClass({
        type: "image",
        current: input.value,
        callback: (path: string) => {
          input.value = path;
          notifyChanged(input);
        }
      }).browse();
    });
  });
  root.querySelectorAll<HTMLElement>("[data-clear-target]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const input = findInput(button.dataset.clearTarget);
      if (!input) return;
      input.value = "";
      notifyChanged(input);
    });
  });
}
