import { MODULE_ID, MODULE_TITLE, SETTINGS, TEMPLATE_PATH, getPlayerConfigs, getThreshold, savePlayerConfigs, setSetting, setting } from "./settings.js";

const BaseFormApplication = globalThis.FormApplication ?? globalThis.foundry?.appv1?.api?.FormApplication;

function targetKey(type, id) {
  return `${type}:${id}`;
}

function gmTargetKey() {
  return targetKey("gm", "default");
}

function userOwnsActor(user, actor) {
  const ownerLevel = globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return Number(actor?.ownership?.[user.id] ?? actor?.ownership?.default ?? 0) >= ownerLevel;
}

function normalizeConfig(config = {}) {
  const threshold = Number(config.threshold);
  const animationStyle = ["strike", "breach", "signal"].includes(config.animationStyle) ? config.animationStyle : "strike";
  return {
    enabled: config.enabled !== false,
    threshold: Number.isInteger(threshold) && threshold >= 1 && threshold <= 20 ? threshold : "",
    animationStyle,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: animationStyle === "strike" },
      { value: "breach", label: "Panel Breach", selected: animationStyle === "breach" },
      { value: "signal", label: "Signal Bloom", selected: animationStyle === "signal" }
    ],
    imagePath: String(config.imagePath ?? ""),
    audioPath: String(config.audioPath ?? ""),
    overlayText: String(config.overlayText ?? ""),
    accentColor: String(config.accentColor ?? "#69e8ff")
  };
}

function buildTargets() {
  const gm = game.users?.find((user) => user.isGM && user.active) ?? game.users?.find((user) => user.isGM) ?? game.user;
  const targets = [{
    key: gmTargetKey(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: gm?.avatar || "icons/svg/mystery-man.svg"
  }];

  for (const actor of game.actors ?? []) {
    const owners = game.users?.filter((user) => !user.isGM && userOwnsActor(user, actor)).map((user) => user.name) ?? [];
    if (!owners.length) continue;
    targets.push({
      key: targetKey("actor", actor.id),
      type: "actor",
      typeLabel: "Actor",
      id: actor.id,
      name: `${actor.name} (${owners.join(", ")})`,
      portrait: actor.img || "icons/svg/mystery-man.svg"
    });
  }

  return targets.sort((a, b) => {
    if (a.type === "gm") return -1;
    if (b.type === "gm") return 1;
    return a.name.localeCompare(b.name);
  });
}

export class PlayerConfigApp extends BaseFormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${MODULE_TITLE} Configuration`,
      template: TEMPLATE_PATH,
      classes: ["hcci-config-window"],
      width: 1120,
      height: "auto",
      resizable: true,
      closeOnSubmit: false,
      submitOnChange: false
    });
  }

  async getData() {
    const configs = getPlayerConfigs();
    const rows = buildTargets().map((target) => {
      const config = normalizeConfig(configs[target.key]);
      const preview = config.imagePath || target.portrait;
      return {
        ...target,
        ...config,
        preview,
        imageStatus: config.imagePath ? "Custom image configured." : "No custom image configured.",
        audioStatus: config.audioPath ? "Audio sample configured." : "No audio sample configured."
      };
    });

    return {
      moduleId: MODULE_ID,
      threshold: getThreshold(),
      duration: setting(SETTINGS.duration),
      defaultText: setting(SETTINGS.defaultText),
      rows
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[data-hcci-browse]").on("click", (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const target = button.closest("[data-hcci-row]");
      const field = button.dataset.hcciBrowse;
      const input = target?.querySelector(`[data-hcci-field="${field}"]`);
      if (!input) return;

      const picker = new FilePicker({
        type: field === "audioPath" ? "audio" : "image",
        current: input.value,
        callback: (path) => {
          input.value = path;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          if (field === "imagePath") {
            const img = target.querySelector("[data-hcci-preview]");
            if (img) img.src = path || img.dataset.fallbackSrc || "icons/svg/mystery-man.svg";
          }
        }
      });
      picker.browse();
    });

    html.find("[data-hcci-action='reset']").on("click", async (event) => {
      event.preventDefault();
      await savePlayerConfigs({});
      ui.notifications?.info("Critical Cut-In player configuration reset.");
      this.render(false);
    });
  }

  async _updateObject(event) {
    const form = event.currentTarget;
    const configs = {};

    for (const row of form.querySelectorAll("[data-hcci-row]")) {
      const key = row.dataset.hcciRow;
      configs[key] = {
        enabled: row.querySelector('[data-hcci-field="enabled"]')?.checked === true,
        threshold: (() => {
          const value = Number(row.querySelector('[data-hcci-field="threshold"]')?.value);
          return Number.isInteger(value) && value >= 1 && value <= 20 ? value : "";
        })(),
        animationStyle: row.querySelector('[data-hcci-field="animationStyle"]')?.value || "strike",
        imagePath: row.querySelector('[data-hcci-field="imagePath"]')?.value?.trim() ?? "",
        audioPath: row.querySelector('[data-hcci-field="audioPath"]')?.value?.trim() ?? "",
        overlayText: row.querySelector('[data-hcci-field="overlayText"]')?.value?.trim() ?? "",
        accentColor: row.querySelector('[data-hcci-field="accentColor"]')?.value || "#69e8ff"
      };
    }

    const threshold = Number(form.querySelector('[name="threshold"]')?.value ?? getThreshold());
    const duration = Number(form.querySelector('[name="duration"]')?.value ?? setting(SETTINGS.duration));
    await setSetting(SETTINGS.threshold, Math.min(20, Math.max(1, threshold)));
    await setSetting(SETTINGS.duration, Math.min(8000, Math.max(800, duration)));
    await savePlayerConfigs(configs);
    ui.notifications?.info("Critical Cut-In configuration saved.");
    this.render(false);
  }
}

export function openPlayerConfig() {
  if (!game.user?.isGM) {
    ui.notifications?.warn("Only the GM can configure Critical Cut-In.");
    return null;
  }
  return new PlayerConfigApp().render(true);
}
