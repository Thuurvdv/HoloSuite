import { MODULE_ID } from "./constants";
import { normalizeEmblemImage } from "./device-branding";
import { isValidPhoneNumberFormat } from "./phone-format";
import { getFilePickerClass } from "./ringtone-settings";

export function bindComposerConfiguration(element: HTMLElement, form: HTMLFormElement) {
  const numberFormat = form.querySelector<HTMLInputElement>('[name="phoneNumberFormat"]');
  const emblem = form.querySelector<HTMLInputElement>('[name="deviceEmblem"]');
  const status = element.querySelector("[data-cybercall-configuration-status]");

  element.querySelector("[data-cybercall-emblem-browse]")?.addEventListener("click", () => {
    if (!game.user?.isGM) return;
    const Picker = getFilePickerClass();
    if (!emblem || !Picker) return;
    const picker = new Picker({
      type: "image",
      current: emblem.value,
      callback: (path: string) => {
        emblem.value = path;
        emblem.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    if (typeof picker.browse === "function") picker.browse();
    else picker.render?.(true);
  });
  element.querySelector("[data-cybercall-save-configuration]")?.addEventListener("click", async () => {
    if (!game.user?.isGM || !numberFormat || !emblem) return;
    const format = numberFormat.value.trim();
    if (!isValidPhoneNumberFormat(format)) {
      numberFormat.setCustomValidity("Use # for digits, A for letters, or * for letters or digits (maximum 32 placeholders). Other printable characters are fixed text. Escape a literal placeholder with a backslash.");
      numberFormat.reportValidity();
      return;
    }
    const imagePath = emblem.value.trim();
    if (imagePath && !normalizeEmblemImage(imagePath)) {
      emblem.setCustomValidity("Choose a PNG, WebP, SVG, JPEG, GIF, or AVIF image.");
      emblem.reportValidity();
      return;
    }
    await game.settings.set(MODULE_ID, "phoneNumberFormat", format);
    await game.settings.set(MODULE_ID, "deviceEmblem", imagePath);
    if (status) status.textContent = "Configuration saved.";
  });
  for (const input of [numberFormat, emblem]) {
    input?.addEventListener("input", () => {
      input.setCustomValidity("");
      if (status) status.textContent = "";
    });
  }
}
