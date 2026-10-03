import { bindFilePickerFields } from "./dom-utils";
import { getPlanetOptionsForShape, normalizePlanetPresetForShape } from "./planet-presets";

export function activateAppearancePanelControls(root: HTMLElement) {
  bindFilePickerFields(root);
  root.querySelectorAll<HTMLInputElement>("[data-use-custom-marker]").forEach((toggle) => {
    const field: HTMLElement | null = (toggle.closest("form") ?? root).querySelector("[data-custom-marker-field]");
    const input: HTMLInputElement | null = field?.querySelector('[name="markerImage"]') ?? null;
    const buttons = field?.querySelectorAll<HTMLButtonElement>("button") ?? [];
    const sync = () => {
      const enabled = toggle.checked;
      field?.classList.toggle("is-disabled", !enabled);
      if (input) input.disabled = !enabled;
      buttons.forEach(button => { button.disabled = !enabled; });
      if (!enabled && input?.value) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    toggle.addEventListener("change", sync);
    sync();
  });

  const texturePanel = root.querySelector<HTMLElement>("[data-texture-upload-fields]");
  const textureInput = root.querySelector<HTMLInputElement>('[name="planetTexture"]');
  const appearanceInput = root.querySelector<HTMLSelectElement>('[name="planetPreset"]');
  const shapeInput = root.querySelector<HTMLSelectElement>('[name="planetShape"]');
  const finishInput = root.querySelector<HTMLSelectElement>('[name="planetFinish"]');
  const colorInput = root.querySelector<HTMLInputElement>('[name="planetColor"]');
  const textureGuide = root.querySelector<HTMLElement>("[data-texture-guide]");
  const textureGuideSection = root.querySelector<HTMLElement>("[data-texture-guide-section]");
  const texturePreviews = root.querySelectorAll<HTMLImageElement>("[data-texture-guide-preview]");

  const updateAppearanceOptions = () => {
    if (!appearanceInput || !shapeInput) return;
    const selected = normalizePlanetPresetForShape(appearanceInput.value, shapeInput.value);
    appearanceInput.replaceChildren(...getPlanetOptionsForShape(shapeInput.value).map(option => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      return element;
    }));
    appearanceInput.value = selected;
  };

  const updateCustomTextureState = () => {
    const custom = appearanceInput?.value === "custom";
    const noDetail = appearanceInput?.value === "none";
    if (texturePanel) texturePanel.hidden = !custom;
    if (textureGuideSection) textureGuideSection.hidden = !custom;
    if (textureInput) textureInput.required = custom;
    if (shapeInput) shapeInput.disabled = noDetail;
    if (finishInput) finishInput.disabled = noDetail;
    if (colorInput) colorInput.disabled = appearanceInput?.value !== "color";
    return custom;
  };

  const updateTexturePreview = () => {
    if (!textureGuide) return;
    const path = textureInput?.value?.trim();
    if (path) textureGuide.dataset.hasTexture = "true";
    else delete textureGuide.dataset.hasTexture;
    texturePreviews.forEach((preview) => {
      preview.onerror = path ? () => { preview.hidden = true; } : null;
      preview.hidden = !path;
      if (path) preview.src = path;
      else preview.removeAttribute("src");
    });
  };

  appearanceInput?.addEventListener("change", () => {
    const custom = updateCustomTextureState();
    if (!custom && textureInput?.value) {
      textureInput.value = "";
      textureInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  textureInput?.addEventListener("change", updateTexturePreview);
  shapeInput?.addEventListener("change", () => {
    if (textureGuide) textureGuide.dataset.shape = shapeInput.value;
    updateAppearanceOptions();
    updateCustomTextureState();
  });
  updateAppearanceOptions();
  updateCustomTextureState();
  updateTexturePreview();
}
