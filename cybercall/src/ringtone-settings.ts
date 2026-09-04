import { getLegacyFormApplicationBase } from "../../shared/src/application-base";
import { MODULE_ID, RINGTONE_SETTINGS_TEMPLATE_PATH } from "./constants";

declare const foundry: any;
declare const game: any;
declare const ui: any;
declare const FilePicker: any;

const BaseFormApplication = getLegacyFormApplicationBase();

export type CustomRingtone = {
  label: string;
  path: string;
};

function getDefaultLabel(path: string) {
  const filename = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "Custom ringtone";
  try {
    return decodeURIComponent(filename);
  } catch (_error) {
    return filename;
  }
}

export function normalizeCustomRingtones(value: any): CustomRingtone[] {
  if (!Array.isArray(value)) return [];
  const paths = new Set<string>();
  return value.flatMap((entry) => {
    const path = String(entry?.path ?? "").trim();
    if (!path || paths.has(path)) return [];
    paths.add(path);
    return [{ label: String(entry?.label ?? "").trim() || getDefaultLabel(path), path }];
  });
}

export function getFilePickerClass() {
  const root = (globalThis as any).foundry;
  const candidates = [
    typeof FilePicker !== "undefined" ? FilePicker : null,
    (globalThis as any).FilePicker,
    root?.applications?.apps?.FilePicker?.implementation,
    root?.applications?.apps?.FilePicker,
    root?.applications?.api?.FilePicker,
    root?.appv1?.api?.FilePicker
  ];
  return candidates.find((candidate) => typeof candidate === "function") ?? null;
}

function getRootElement(app: any, html: any): HTMLElement | null {
  const element = html instanceof HTMLElement ? html : html?.[0] ?? app.element?.[0] ?? app.element ?? null;
  return element instanceof HTMLElement ? element : null;
}

function createRingtoneRow(index: number) {
  const row = document.createElement("div");
  row.className = "cybercall-ringtone-config-row";
  row.dataset.ringtoneRow = "";
  row.innerHTML = `
    <label class="cybercall-ringtone-config-field">
      <span>Display name</span>
      <input type="text" data-ringtone-label name="ringtones.${index}.label" placeholder="For example: Urgent Call">
    </label>
    <label class="cybercall-ringtone-config-field">
      <span>Audio file</span>
      <div class="cybercall-ringtone-config-path">
        <input type="text" data-ringtone-path name="ringtones.${index}.path" placeholder="Choose an audio file…">
        <button type="button" class="cybercall-ringtone-browse" data-ringtone-browse title="Choose audio file" aria-label="Choose audio file"><i class="fa-solid fa-folder-open"></i></button>
      </div>
    </label>
    <button type="button" class="cybercall-ringtone-remove" data-ringtone-remove title="Remove ringtone" aria-label="Remove ringtone"><i class="fa-solid fa-trash"></i></button>`;
  return row;
}

export class RingtoneSettingsApp extends BaseFormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: RINGTONE_SETTINGS_TEMPLATE_PATH,
      classes: ["cybercall-ringtone-settings-app"],
      width: 680,
      height: "auto",
      resizable: true,
      closeOnSubmit: true
    });
  }

  getData() {
    return {
      ringtones: normalizeCustomRingtones(game.settings.get(MODULE_ID, "customRingtones"))
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const root = getRootElement(this, html);
    const list = root?.querySelector<HTMLElement>("[data-ringtone-list]");
    if (!root || !list) return;

    root.querySelector("[data-ringtone-add]")?.addEventListener("click", () => {
      const row = createRingtoneRow(list.querySelectorAll("[data-ringtone-row]").length);
      list.querySelector("[data-ringtone-empty]")?.before(row);
    });

    root.addEventListener("click", (event) => {
      const target = event.target as Element | null;
      const removeButton = target?.closest?.("[data-ringtone-remove]");
      if (removeButton) {
        removeButton.closest("[data-ringtone-row]")?.remove();
        return;
      }

      const browseButton = target?.closest?.("[data-ringtone-browse]");
      if (!browseButton) return;
      const row = browseButton.closest("[data-ringtone-row]");
      const input = row?.querySelector<HTMLInputElement>("[data-ringtone-path]");
      const Picker = getFilePickerClass();
      if (!input || !Picker) {
        ui.notifications?.warn?.("Foundry FilePicker is unavailable.");
        return;
      }
      const picker = new Picker({
        type: "audio",
        current: input.value,
        callback: (path: string) => {
          input.value = path;
          const labelInput = row?.querySelector<HTMLInputElement>("[data-ringtone-label]");
          if (labelInput && !labelInput.value.trim()) labelInput.value = getDefaultLabel(path);
        }
      });
      if (typeof picker.browse === "function") picker.browse();
      else picker.render?.(true);
    });
  }

  async _updateObject(event: Event) {
    const form = event.currentTarget as HTMLFormElement;
    const ringtones = [...form.querySelectorAll<HTMLElement>("[data-ringtone-row]")].map((row) => ({
      label: row.querySelector<HTMLInputElement>("[data-ringtone-label]")?.value ?? "",
      path: row.querySelector<HTMLInputElement>("[data-ringtone-path]")?.value ?? ""
    }));
    await game.settings.set(MODULE_ID, "customRingtones", normalizeCustomRingtones(ringtones));
    ui.notifications?.info?.("CyberCall ringtones saved.");
  }
}
