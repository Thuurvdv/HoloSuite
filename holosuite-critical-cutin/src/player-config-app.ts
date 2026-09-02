import { MODULE_ID, MODULE_TITLE, SETTINGS, TEMPLATE_PATH, getDieSides, getFailureThreshold, getPlayerConfigs, getThreshold, lowRollsAreGood, savePlayerConfigs, setSetting, setting } from "./settings";
import { getLegacyFormApplicationBase } from "../../shared/src/application-base";
import { getCriticalRollEndpoints, getDieOptions } from "../../shared/src/dice-checks";

declare const foundry: any;
declare const game: any;
declare const ui: any;
declare const FilePicker: any;

const BaseFormApplication = getLegacyFormApplicationBase();

export async function confirmRollThresholdReset(dieSides: number, rollDirection: string, targetCount: number) {
  const { success, failure } = getCriticalRollEndpoints(dieSides, rollDirection);
  const content = `<p>Change to <strong>d${dieSides}</strong> with <strong>${rollDirection === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${targetCount} listed players/GM entries, in both tabs, and the global thresholds:</p>
    <ul><li>Success: <strong>${success}</strong></li><li>Failure: <strong>${failure}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`;
  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (DialogV2?.confirm) {
    return await DialogV2.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content, modal: true, rejectClose: false,
      yes: { label: "Change and Reset Rolls" }, no: { label: "Cancel", default: true }
    }) === true;
  }
  const DialogV1 = (globalThis as any).Dialog ?? foundry?.appv1?.api?.Dialog;
  if (!DialogV1?.confirm) throw new Error("Foundry confirmation dialog is unavailable.");
  return await DialogV1.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content, defaultYes: false, rejectClose: false }) === true;
}

function targetKey(type: string, id: string) {
  return `${type}:${id}`;
}

function gmTargetKey() {
  return targetKey("gm", "default");
}

function userOwnsActor(user: any, actor: any) {
  const ownerLevel = (globalThis as any).CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return Number(actor?.ownership?.[user.id] ?? actor?.ownership?.default ?? 0) >= ownerLevel;
}

function normalizeTriggerConfig(config: any = {}, { defaultAccent = "#69e8ff" } = {}) {
  const threshold = Number(config.threshold);
  const animationStyle = ["strike", "breach", "signal"].includes(config.animationStyle) ? config.animationStyle : "strike";
  return {
    enabled: config.enabled !== false,
    threshold: Number.isInteger(threshold) && threshold >= 1 && threshold <= getDieSides() ? threshold : "",
    animationStyle,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: animationStyle === "strike" },
      { value: "breach", label: "Panel Breach", selected: animationStyle === "breach" },
      { value: "signal", label: "Signal Bloom", selected: animationStyle === "signal" }
    ],
    imagePath: String(config.imagePath ?? ""),
    audioPath: String(config.audioPath ?? ""),
    overlayText: String(config.overlayText ?? ""),
    accentColor: String(config.accentColor ?? defaultAccent)
  };
}

function normalizeConfig(config: any = {}) {
  return {
    success: normalizeTriggerConfig(config, { defaultAccent: "#69e8ff" }),
    failure: normalizeTriggerConfig(config.failure, { defaultAccent: "#ff4d7d" })
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
  activeTabs: Map<string, string>;
  rollRuleChange: Promise<void> | null = null;

  constructor(options: any = {}) {
    super(options);
    this.activeTabs = new Map();
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${MODULE_TITLE} Configuration`,
      template: TEMPLATE_PATH,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: true,
      closeOnSubmit: false,
      submitOnChange: false
    });
  }

  async getData() {
    const configs = getPlayerConfigs();
    const rows = buildTargets().map((target) => {
      const config = normalizeConfig(configs[target.key]);
      const successPreview = config.success.imagePath || target.portrait;
      const failurePreview = config.failure.imagePath || target.portrait;
      const activeTab = this.activeTabs.get(target.key) === "failure" ? "failure" : "success";
      return {
        ...target,
        successActive: activeTab === "success",
        failureActive: activeTab === "failure",
        success: {
          ...config.success,
          preview: successPreview,
          imageStatus: config.success.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: config.success.audioPath ? "Audio sample configured." : "No audio sample configured."
        },
        failure: {
          ...config.failure,
          preview: failurePreview,
          imageStatus: config.failure.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: config.failure.audioPath ? "Audio sample configured." : "No audio sample configured."
        }
      };
    });

    return {
      moduleId: MODULE_ID,
      dieSides: getDieSides(),
      dice: getDieOptions(getDieSides()),
      lowRollsGood: lowRollsAreGood(),
      threshold: setting(SETTINGS.threshold) ?? 0,
      failureThreshold: setting(SETTINGS.failureThreshold) ?? 0,
      effectiveThreshold: getThreshold(),
      effectiveFailureThreshold: getFailureThreshold(),
      duration: setting(SETTINGS.duration),
      defaultText: setting(SETTINGS.defaultText),
      defaultFailureText: setting(SETTINGS.defaultFailureText),
      rows
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const markDirty = () => {
      html.closest(".app")?.addClass("hcci-config-dirty");
      html.find("[data-hcci-dirty]").prop("hidden", false);
    };
    const syncRollControls = () => {
      const sides = Number(html.find("[name='dieSides']").val());
      const low = html.find("[name='rollDirection']").val() === "low";
      html.find("[data-hcci-success-label]").text(low ? "Success ≤" : "Success ≥");
      html.find("[data-hcci-failure-label]").text(low ? "Failure ≥" : "Failure ≤");
      if (!Number.isInteger(sides) || sides < 2 || sides > 10000) return;
      html.find("[name='threshold'], [name='failureThreshold'], [data-hcci-field='threshold']").attr("max", sides);
      const success = Number(html.find("[name='threshold']").val()) || (low ? 1 : sides);
      const failure = Number(html.find("[name='failureThreshold']").val()) || (low ? sides : 1);
      html.find("[data-hcci-panel='success'] [data-hcci-field='threshold']").attr("placeholder", success);
      html.find("[data-hcci-panel='failure'] [data-hcci-field='threshold']").attr("placeholder", failure);
    };
    html.find("[name='threshold'], [name='failureThreshold']").on("input change", syncRollControls);
    syncRollControls();

    let acceptedSides = Number(html.find("[name='dieSides']").val());
    let acceptedDirection = String(html.find("[name='rollDirection']").val());
    html.find("[name='dieSides'], [name='rollDirection']").on("change", () => {
      if (this.rollRuleChange) return;
      const sides = Number(html.find("[name='dieSides']").val());
      const direction = String(html.find("[name='rollDirection']").val());
      if (sides === acceptedSides && direction === acceptedDirection) return;
      const controls = html.find("[name='dieSides'], [name='rollDirection'], [type='submit']");
      controls.prop("disabled", true);
      this.rollRuleChange = (async () => {
        try {
          const confirmed = await confirmRollThresholdReset(sides, direction, html.find("[data-hcci-row]").length);
          if (!confirmed) return;
          const { success, failure } = getCriticalRollEndpoints(sides, direction);
          html.find("[name='threshold'], [data-hcci-panel='success'] [data-hcci-field='threshold']").val(success);
          html.find("[name='failureThreshold'], [data-hcci-panel='failure'] [data-hcci-field='threshold']").val(failure);
          acceptedSides = sides;
          acceptedDirection = direction;
          markDirty();
        } catch (error) {
          console.error(`${MODULE_ID} | Could not confirm dice change.`, error);
          ui.notifications?.error?.("Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          html.find("[name='dieSides']").val(acceptedSides);
          html.find("[name='rollDirection']").val(acceptedDirection);
          syncRollControls();
          controls.prop("disabled", false);
          this.rollRuleChange = null;
        }
      })();
    });

    html.find("input, select").on("input change", (event) => {
      if (["dieSides", "rollDirection"].includes(event.currentTarget.name)) return;
      markDirty();
      if (event.currentTarget.dataset.hcciField !== "imagePath") return;
      const panel = event.currentTarget.closest("[data-hcci-panel]");
      const preview = panel?.querySelector("[data-hcci-preview]");
      if (preview) preview.src = event.currentTarget.value || preview.dataset.fallbackSrc || "icons/svg/mystery-man.svg";
    });

    html.find("[data-hcci-browse]").on("click", (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const panel = button.closest("[data-hcci-panel]");
      const field = button.dataset.hcciBrowse;
      const input = panel?.querySelector(`[data-hcci-field="${field}"]`);
      if (!input) return;

      const picker = new FilePicker({
        type: field === "audioPath" ? "audio" : "image",
        current: input.value,
        callback: (path: string) => {
          input.value = path;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          if (field === "imagePath") {
            const img = panel.querySelector("[data-hcci-preview]");
            if (img) img.src = path || img.dataset.fallbackSrc || "icons/svg/mystery-man.svg";
          }
        }
      });
      picker.browse();
    });

    html.find("[data-hcci-tab]").on("click", (event) => {
      event.preventDefault();
      const tab = event.currentTarget.dataset.hcciTab;
      const row = event.currentTarget.closest("[data-hcci-row]");
      if (row?.dataset.hcciRow) this.activeTabs.set(row.dataset.hcciRow, tab);
      row?.querySelectorAll("[data-hcci-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.hcciTab === tab));
      row?.querySelectorAll("[data-hcci-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.hcciPanel === tab));
    });

    html.find("[data-hcci-action='reset']").on("click", async (event) => {
      event.preventDefault();
      await savePlayerConfigs({});
      ui.notifications?.info("Critical Cut-In player configuration reset.");
      this.render(false);
    });
  }

  async _updateObject(event: Event) {
    if (this.rollRuleChange) return;
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    const dieSides = Number(form.querySelector<HTMLSelectElement>('[name="dieSides"]')?.value ?? getDieSides());
    const rollDirection = form.querySelector<HTMLSelectElement>('[name="rollDirection"]')?.value === "low" ? "low" : "high";
    const configs: Record<string, any> = getPlayerConfigs();

    const readPanel = (row: HTMLElement, scope: string) => {
      const panel = row.querySelector<HTMLElement>(`[data-hcci-panel="${scope}"]`);
      const field = (name: string) => panel?.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-hcci-field="${name}"]`);
      return {
        enabled: panel?.querySelector<HTMLInputElement>('[data-hcci-field="enabled"]')?.checked === true,
        threshold: (() => {
          const value = Number(field("threshold")?.value);
          return Number.isInteger(value) && value >= 1 && value <= dieSides ? value : "";
        })(),
        animationStyle: field("animationStyle")?.value || "strike",
        imagePath: field("imagePath")?.value?.trim() ?? "",
        audioPath: field("audioPath")?.value?.trim() ?? "",
        overlayText: field("overlayText")?.value?.trim() ?? "",
        accentColor: field("accentColor")?.value || (scope === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };

    for (const row of form.querySelectorAll<HTMLElement>("[data-hcci-row]")) {
      const key = row.dataset.hcciRow;
      const activePanel = row.querySelector<HTMLElement>("[data-hcci-panel].is-active")?.dataset.hcciPanel;
      if (activePanel) this.activeTabs.set(key, activePanel);
      configs[key] = readPanel(row, "success");
      configs[key].failure = readPanel(row, "failure");
    }

    const threshold = Number(form.querySelector<HTMLInputElement>('[name="threshold"]')?.value ?? getThreshold());
    const failureThreshold = Number(form.querySelector<HTMLInputElement>('[name="failureThreshold"]')?.value ?? getFailureThreshold());
    const duration = Number(form.querySelector<HTMLInputElement>('[name="duration"]')?.value ?? setting(SETTINGS.duration));
    await setSetting(SETTINGS.dieSides, dieSides);
    await setSetting(SETTINGS.rollDirection, rollDirection);
    await setSetting(SETTINGS.threshold, Math.min(dieSides, Math.max(0, threshold)));
    await setSetting(SETTINGS.failureThreshold, Math.min(dieSides, Math.max(0, failureThreshold)));
    await setSetting(SETTINGS.duration, Math.min(8000, Math.max(800, duration)));
    await savePlayerConfigs(configs);
    ui.notifications?.info("Critical Cut-In configuration saved.");
    this.element?.removeClass("hcci-config-dirty");
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
