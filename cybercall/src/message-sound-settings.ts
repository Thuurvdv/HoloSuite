import { MODULE_ID } from "./constants";
import { getFilePickerClass, normalizeCustomRingtones, RingtoneSettingsApp } from "./ringtone-settings";

declare const game: any;
declare const ui: any;

export function getMessageSoundChoices() {
  const personal = game.user?.getFlag(MODULE_ID, "messageSound") ?? {};
  const shared = game.user?.isGM || game.settings.get(MODULE_ID, "shareMessageSounds") !== false
    ? normalizeCustomRingtones(game.settings.get(MODULE_ID, "customMessageSounds")) : [];
  return normalizeCustomRingtones([
    ...(personal.path ? [{ label: personal.label || "My uploaded sound", path: personal.path }] : []),
    ...shared
  ]);
}

export function getMessageSoundPath() {
  const selected = game.user?.getFlag(MODULE_ID, "messageSound")?.selected;
  return getMessageSoundChoices().some((sound) => sound.path === selected) ? selected : "";
}

export function getMessageSoundOptions() {
  const current = getMessageSoundPath();
  return [
    { value: "", label: "Built-in notification tone", selected: !current },
    ...getMessageSoundChoices().map(({ path, label }) => ({ value: path, label, selected: path === current }))
  ];
}

export async function setMessageSoundPath(path: string) {
  if (path && !getMessageSoundChoices().some((sound) => sound.path === path)) return;
  const previous = game.user.getFlag(MODULE_ID, "messageSound") ?? {};
  await game.user.setFlag(MODULE_ID, "messageSound", { ...previous, selected: path });
}

export function canChooseMessageSoundFile() {
  return game.user?.isGM || game.user?.can?.("FILES_BROWSE") === true;
}

export class MessageSoundSettingsApp extends RingtoneSettingsApp {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "cybercall-message-sound-settings",
      title: "CyberCall Message Notification Sounds",
      template: `modules/${MODULE_ID}/templates/message-sound-settings.hbs`
    };
  }

  getData() {
    const personal = game.user?.getFlag(MODULE_ID, "messageSound") ?? {};
    const current = getMessageSoundPath();
    return {
      isGM: game.user?.isGM === true,
      shareSounds: game.settings.get(MODULE_ID, "shareMessageSounds") !== false,
      canChooseFile: canChooseMessageSoundFile(),
      canUpload: game.user?.isGM || game.user?.can?.("FILES_UPLOAD") === true,
      personal,
      usePersonal: !!personal.path && current === personal.path,
      useDefault: !current,
      sounds: getMessageSoundChoices().filter((sound) => sound.path !== personal.path)
        .map((sound) => ({ ...sound, selected: current === sound.path })),
      ringtones: normalizeCustomRingtones(game.settings.get(MODULE_ID, "customMessageSounds"))
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const root: HTMLElement | undefined = html instanceof HTMLElement ? html : html?.[0] ?? this.element?.[0] ?? this.element;
    const selection = root?.querySelector<HTMLSelectElement>("[data-message-sound-selection]");
    const input = root?.querySelector<HTMLInputElement>("[data-personal-sound]");
    const browse = root?.querySelector<HTMLButtonElement>("[data-message-sound-browse]");
    if (!selection || !input || !browse) return;

    const syncFileControls = () => {
      input.disabled = browse.disabled = selection.value === "";
    };
    selection.addEventListener("change", syncFileControls);
    syncFileControls();

    browse.addEventListener("click", () => {
      if (browse.disabled || !canChooseMessageSoundFile()) return;
      const Picker = getFilePickerClass();
      if (!Picker) return ui.notifications?.warn?.("Foundry FilePicker is unavailable.");
      const picker = new Picker({
        type: "audio",
        current: input.value,
        callback: (path: string) => {
          input.value = path;
          selection.value = "personal";
          syncFileControls();
        }
      });
      if (typeof picker.browse === "function") picker.browse();
      else picker.render?.(true);
    });
  }

  async _updateObject(event: Event) {
    const form = event.currentTarget as HTMLFormElement;
    const previous = game.user.getFlag(MODULE_ID, "messageSound") ?? {};
    const path = canChooseMessageSoundFile()
      ? form.querySelector<HTMLInputElement>("[data-personal-sound]")?.value.trim() ?? ""
      : previous.path ?? "";
    if (game.user.isGM) {
      const sounds = [...form.querySelectorAll<HTMLElement>("[data-ringtone-row]")].map((row) => ({
        label: row.querySelector<HTMLInputElement>("[data-ringtone-label]")?.value,
        path: row.querySelector<HTMLInputElement>("[data-ringtone-path]")?.value
      }));
      if (path && path !== previous.path) sounds.push({ label: "", path });
      await game.settings.set(MODULE_ID, "customMessageSounds", normalizeCustomRingtones(sounds));
      await game.settings.set(MODULE_ID, "shareMessageSounds", form.querySelector<HTMLInputElement>("[data-share-message-sounds]")?.checked === true);
    }
    const selection = form.querySelector<HTMLSelectElement>("[data-message-sound-selection]")?.value ?? "";
    const selected = selection === "personal" ? path : selection;
    const allowed = selected === path || getMessageSoundChoices().some((sound) => sound.path === selected);
    await game.user.setFlag(MODULE_ID, "messageSound", { path, selected: allowed ? selected : "" });
    ui.notifications?.info?.("CyberCall message notification sound saved.");
  }
}
