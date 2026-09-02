import { escapeHtml, getActorById, getActorSkillOptions, getMissingSkillsWarning, getPlayerActorOptions, getPlayerUsers } from "../core/actor-skills";
import { getLegacyApplicationBase } from "../../../shared/src/application-base";
import { getRollOptions } from "../core/check-roll";
import { supportsSystemSkillRoll } from "../core/system-roll";
import { getDieOptions } from "../../../shared/src/dice-checks";
import { bindPersistentTooltip } from "../../../shared/src/persistent-tooltip";
import { DIFFICULTY_PROFILES, normalizeQuickOutcome } from "../core/difficulty";
import { createHackConfiguration, getConfigurationSkills } from "../core/hack-configuration";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/hacking-launcher.html`;
const LegacyApplication = getLegacyApplicationBase();
const LABEL_HELP: Record<string, string> = {
  minigameType: "Choose the puzzle the player will attempt.",
  userId: "Choose who receives the hacking challenge.",
  actorId: "Choose the character attempting the hack.",
  skillId: "Choose the character skill used for the check.",
  dieSides: "Choose the die used for custom rolls. Your choice is remembered.",
  diceCount: "Roll this many dice, then keep one result.",
  keepResult: "Keep the best or worst die, based on Positive rolls.",
  staticModifier: "Add this number to custom rolls. Negative numbers subtract.",
  rollDirection: "Choose whether high or low rolls are positive. System rolls may use their own rules.",
  dc: "Target number for the check. System rolls may use their own difficulty.",
  liveAudience: "Choose who can watch the minigame live.",
  testRollTotal: "Use this pretend roll total when clicking Test Yourself. No dice are rolled."
};
const ROLL_SOURCE_HELP: Record<string, string> = {
  system: "Uses the character's skill check and roll dialog, including system modifiers and dice rules.",
  sheet: "Opens the character sheet. Roll normally, then click Use for hacking on the chat result.",
  custom: "Uses your dice settings, the detected skill modifier, and your static modifier."
};

function getModuleAssetPath(path: string) {
  const modulePath = `modules/${MODULE_ID}/${path.replace(/^\/+/, "")}`;
  const getRoute = foundry?.utils?.getRoute;
  if (typeof getRoute === "function") return getRoute(modulePath);

  const routePrefix = String((globalThis as any).ROUTE_PREFIX ?? game?.data?.options?.routePrefix ?? "").replace(/^\/?/, "/").replace(/\/$/, "");
  return `${routePrefix}/${modulePath}`;
}

export class HackingLauncherApp extends LegacyApplication {
  api: any;
  preferenceSave: Promise<any> = Promise.resolve();
  quickHack: boolean;
  quickSending = false;
  modeSave: Promise<any> = Promise.resolve();
  configurationMode: boolean;
  configuration: ReturnType<typeof createHackConfiguration> | null;
  configurationResult: ((value: any) => void) | null;
  selectedOutcome: string | null = null;
  editingConfiguration: boolean;
  fieldIdPrefix: string;

  constructor(options: any = {}) {
    super(options);
    this.api = options.api;
    this.configurationMode = options.configurationMode === true;
    this.fieldIdPrefix = this.configurationMode ? `hh-config-${foundry.utils.randomID()}` : "hh";
    this.configuration = this.configurationMode ? createHackConfiguration(options.configuration ?? {}) : null;
    this.configurationResult = options.onConfigured ?? null;
    this.editingConfiguration = options.editingConfiguration === true;
    this.selectedOutcome = this.configuration?.quickOutcome ?? null;
    this.quickHack = this.configurationMode ? !!this.selectedOutcome : Boolean(game.settings.get(MODULE_ID, "quickHackMode"));
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: true,
      resizable: true,
      width: 560,
      height: 680,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    const defaultDc = this.configuration?.dc ?? Number(game.settings.get(MODULE_ID, "defaultDc") ?? 15);
    const defaultLiveAudience = this.configuration?.liveAudience ?? String(game.settings.get(MODULE_ID, "defaultLiveAudience") ?? "everyone");
    const users = getPlayerUsers();
    const firstUser = users[0] ?? null;
    const actorOptions = getPlayerActorOptions(firstUser?.id);
    const firstActor = actorOptions.length ? getActorById(actorOptions[0].id) : null;
    const rules = getRollOptions(this.configuration ?? {});
    const minigames = this.api.getMinigames().map(minigame => ({ ...minigame, selected: minigame.id === this.configuration?.minigameType }));
    if (this.configuration && !minigames.some(minigame => minigame.selected)) {
      minigames.push({ id: this.configuration.minigameType, title: `${this.configuration.minigameType} (unavailable)`, selected: true });
    }
    return {
      ...rules,
      configurationMode: this.configurationMode,
      fieldIdPrefix: this.fieldIdPrefix,
      configurationAction: this.editingConfiguration ? "Save" : "Add",
      quickHack: this.quickHack,
      quickOutcomes: Object.entries(DIFFICULTY_PROFILES).map(([id, profile]) => ({ id, label: id === "failure_but_playable" ? "Failure" : profile.label })),
      missingSkillsWarning: getMissingSkillsWarning(),
      systemRollSupported: supportsSystemSkillRoll(),
      systemRoll: rules.rollSource === "system",
      customRoll: rules.rollSource === "custom",
      sheetRoll: rules.rollSource === "sheet",
      keepWorst: rules.keepResult === "worst",
      diceCounts: Array.from({ length: 10 }, (_, index) => ({ value: index + 1, selected: rules.diceCount === index + 1 })),
      dice: getDieOptions(rules.dieSides),
      lowRollsGood: rules.rollDirection === "low",
      frameAssetBase: getModuleAssetPath("assets/frame"),
      defaultDc,
      liveAudiences: [
        { value: "everyone", label: "GM and players", selected: defaultLiveAudience === "everyone" },
        { value: "gm", label: "GM only", selected: defaultLiveAudience === "gm" },
        { value: "none", label: "Nobody", selected: defaultLiveAudience === "none" }
      ],
      defaultTestRoll: defaultDc,
      minigames,
      actors: actorOptions.map((actor) => ({
        id: actor.id,
        name: actor.name,
        ownerNames: actor.owners.map((user) => user.name).join(", ") || "No active owner"
      })),
      users: users.map((user) => ({
        id: user.id,
        name: user.name
      })),
      skills: this.configurationMode ? getConfigurationSkills() : getActorSkillOptions(firstActor)
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const form = (html.is("form") ? html[0] : html.find("form")[0]) as HTMLFormElement | null;
    this.quickSending = false;
    html.find("[data-action='quick-toggle']").on("click", () => {
      this.quickHack = !this.quickHack;
      this.syncQuickControls(form);
      if (this.configurationMode) return;
      const mode = this.quickHack;
      this.modeSave = this.modeSave.catch(() => {}).then(() => game.settings.set(MODULE_ID, "quickHackMode", mode));
      this.modeSave.catch(() => ui.notifications?.warn?.("Could not remember the launcher mode."));
    });
    html.find("[data-quick-outcome]").on("click", event => this.submitQuick(form, event.currentTarget.dataset.quickOutcome));
    html.find("[data-action='start'], [data-action='save-quick-configuration']").on("click", (event) => {
      event.preventDefault();
      this.submit(form);
    });
    html.find("[data-action='test-self']").on("click", (event) => {
      event.preventDefault();
      this.testSelf(form);
    });
    const formElement = html.is("form") ? html : html.find("form");
    bindPersistentTooltip(form?.querySelector("[data-skill-warning]"), getMissingSkillsWarning);
    for (const label of form?.querySelectorAll<HTMLElement>("[data-label-help]") ?? []) {
      bindPersistentTooltip(label, () => label.dataset.labelHelp === "rollSource"
        ? ROLL_SOURCE_HELP[form?.querySelector<HTMLSelectElement>("[name='rollSource']")?.value ?? "custom"]
        : LABEL_HELP[label.dataset.labelHelp ?? ""]);
    }
    html.find("[name='rollSource'], [name='dieSides'], [name='rollDirection'], [name='diceCount'], [name='keepResult'], [name='staticModifier']").on("change", () => {
      this.syncRollControls(form);
      if (form?.querySelector<HTMLSelectElement>("[name='dieSides']")?.checkValidity()
        && (form.querySelector<HTMLInputElement>("[name='staticModifier']")?.checkValidity() ?? true)) {
        this.saveRollPreferences(form).catch(() => {});
      }
    });
    html.find("[data-action='cancel-configuration']").on("click", () => this.close());
    formElement.on("submit", (event) => {
      event.preventDefault();
      this.submit(event.currentTarget);
    });
    html.find("[name='actorId']").on("change", (event) => {
      this.syncUserToActor(html, event.currentTarget.value);
      this.syncSkillOptions(html, event.currentTarget.value);
    });
    html.find("[name='userId']").on("change", (event) => {
      this.syncActorsForUser(html, event.currentTarget.value);
    });
    this.syncSkillOptions(html, html.find("[name='actorId']").val());
    this.syncRollControls(form);
    this.syncQuickControls(form);
  }

  syncQuickControls(form: HTMLFormElement | null) {
    if (!form) return;
    const full = form.querySelector<HTMLFieldSetElement>("[data-full-setup]");
    if (full) { full.hidden = this.quickHack; full.disabled = this.quickHack; }
    const quick = form.querySelector<HTMLElement>("[data-quick-setup]");
    if (quick) quick.hidden = !this.quickHack;
    const fullActions = form.querySelector<HTMLElement>("[data-full-configuration-actions]");
    if (fullActions) fullActions.hidden = this.quickHack;
    const toggle = form.querySelector<HTMLButtonElement>("[data-action='quick-toggle']");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(this.quickHack));
      toggle.textContent = this.quickHack ? "Full setup" : "Quick Hack";
    }
    const heading = form.querySelector("[data-launcher-heading]");
    if (heading) heading.textContent = this.configurationMode ? "Configure Hack" : this.quickHack ? "Quick Hack" : "Launch Minigame";
    if (this.configurationMode) {
      for (const button of form.querySelectorAll<HTMLButtonElement>("[data-quick-outcome]")) {
        button.setAttribute("aria-pressed", String(button.dataset.quickOutcome === this.selectedOutcome));
      }
    }
    document.dispatchEvent(new Event("holosuite-close-skill-help"));
    form.scrollTop = 0;
  }

  async submitQuick(form: HTMLFormElement | null, value: string) {
    if (!game.user?.isGM || !this.quickHack || this.quickSending || !form) return;
    const quickOutcome = normalizeQuickOutcome(value);
    if (!quickOutcome) return;
    if (this.configurationMode) {
      this.selectedOutcome = quickOutcome;
      this.syncQuickControls(form);
      return;
    }
    const user = form.querySelector<HTMLSelectElement>("[name='userId']");
    if (!user?.value || !user.reportValidity()) {
      ui.notifications?.warn?.("Choose a player for Quick Hack.");
      return;
    }
    this.quickSending = true;
    const buttons = [...form.querySelectorAll<HTMLButtonElement>("[data-quick-outcome]")];
    buttons.forEach(button => { button.disabled = true; });
    try {
      const sent = this.api.sendHackToPlayer({
        minigameType: String(form.querySelector<HTMLSelectElement>("[name='minigameType']")?.value || "node-intrusion"),
        actorId: String(form.querySelector<HTMLSelectElement>("[name='actorId']")?.value || ""),
        userId: user.value,
        quickOutcome,
        liveAudience: String(game.settings.get(MODULE_ID, "defaultLiveAudience") ?? "everyone")
      });
      if (sent) { await this.close(); return; }
    } catch (error) { ui.notifications?.warn?.(`Could not send Quick Hack: ${error.message}`); }
    this.quickSending = false;
    buttons.forEach(button => { button.disabled = false; });
  }

  async submit(form: HTMLFormElement | null) {
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!form) {
      ui.notifications?.error?.("HoloSuite Hacking launcher form was not found.");
      console.error(`${MODULE_ID} | Launcher form was not found.`);
      return;
    }

    if (this.configurationMode) return this.saveConfiguration(form);

    if (this.quickHack) {
      ui.notifications?.info?.("Choose a Quick Hack outcome to send the minigame.");
      return;
    }

    const minigameSelect = form.querySelector<HTMLSelectElement>("[name='minigameType']");
    const actorSelect = form.querySelector<HTMLSelectElement>("[name='actorId']");
    const userSelect = form.querySelector<HTMLSelectElement>("[name='userId']");
    const skillSelect = form.querySelector<HTMLSelectElement>("[name='skillId']");
    const dcInput = form.querySelector<HTMLInputElement>("[name='dc']");
    const liveAudienceSelect = form.querySelector<HTMLSelectElement>("[name='liveAudience']");
    const selectedSkill = skillSelect?.selectedOptions?.[0] ?? null;

    const minigameType = String(minigameSelect?.value || "node-intrusion");
    const actorId = String(actorSelect?.value || "");
    const userId = String(userSelect?.value || "");
    const skillId = String(skillSelect?.value || "");
    const skillLabel = skillId ? String(selectedSkill?.dataset.skillLabel || selectedSkill?.textContent || skillId)
      : form.querySelector<HTMLSelectElement>("[name='rollSource']")?.value === "sheet" ? "the requested skill" : "Custom check";
    const skillModifier = Number(selectedSkill?.dataset.skillModifier ?? 0);
    const dc = Number(dcInput?.value ?? 15);
    const liveAudience = String(liveAudienceSelect?.value || "everyone");
    if (!skillId && form.querySelector<HTMLSelectElement>("[name='rollSource']")?.value === "system") {
      ui.notifications?.warn?.(getMissingSkillsWarning());
      return;
    }

    if (!form.querySelector<HTMLSelectElement>("[name='dieSides']")?.reportValidity()) return;
    if (form.querySelector<HTMLInputElement>("[name='staticModifier']")?.reportValidity() === false) return;
    let rules;
    try { rules = await this.saveRollPreferences(form); } catch { return; }

    const sent = this.api.sendHackToPlayer({
      ...rules,
      minigameType,
      actorId,
      userId,
      skillId,
      skillLabel,
      skillModifier,
      dc,
      liveAudience,
      onSuccess: () => {},
      onFailure: () => {}
    });
    if (sent) this.close();
  }

  async testSelf(form: HTMLFormElement | null) {
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!form) {
      ui.notifications?.error?.("HoloSuite Hacking launcher form was not found.");
      return;
    }

    const minigameType = String(form.querySelector<HTMLSelectElement>("[name='minigameType']")?.value || "node-intrusion");
    const actorId = String(form.querySelector<HTMLSelectElement>("[name='actorId']")?.value || "");
    const dc = Number(form.querySelector<HTMLInputElement>("[name='dc']")?.value ?? game.settings.get(MODULE_ID, "defaultDc") ?? 15);
    const rollTotal = Number(form.querySelector<HTMLInputElement>("[name='testRollTotal']")?.value ?? dc);
    if (!Number.isFinite(rollTotal)) {
      ui.notifications?.warn?.("Enter a fake roll result before testing the minigame.");
      return;
    }
    const actor = getActorById(actorId);
    if (!form.querySelector<HTMLSelectElement>("[name='dieSides']")?.reportValidity()) return;
    if (form.querySelector<HTMLInputElement>("[name='staticModifier']")?.reportValidity() === false) return;
    let rules;
    try { rules = await this.saveRollPreferences(form); } catch { return; }

    this.api.startHack({
      ...rules,
      type: minigameType,
      dc,
      rollTotal,
      actorName: actor?.name ?? game.user?.name ?? "GM",
      userId: game.user?.id ?? "",
      onSuccess: () => {},
      onFailure: () => {}
    });
    this.close();
  }

  saveRollPreferences(form: HTMLFormElement) {
    const rules = getRollOptions({
      rollSource: form.querySelector<HTMLSelectElement>("[name='rollSource']")?.value,
      diceCount: form.querySelector<HTMLSelectElement>("[name='diceCount']")?.value,
      keepResult: form.querySelector<HTMLSelectElement>("[name='keepResult']")?.value,
      staticModifier: form.querySelector<HTMLInputElement>("[name='staticModifier']")?.value,
      dieSides: form.querySelector<HTMLSelectElement>("[name='dieSides']")?.value,
      rollDirection: form.querySelector<HTMLSelectElement>("[name='rollDirection']")?.value
    });
    if (this.configurationMode) return Promise.resolve(rules);
    this.preferenceSave = this.preferenceSave.catch(() => {}).then(async () => {
      if (!game.user?.isGM) return rules;
      try {
        await game.settings.set(MODULE_ID, "defaultDieSides", rules.dieSides);
        await game.settings.set(MODULE_ID, "defaultRollDirection", rules.rollDirection);
        await game.settings.set(MODULE_ID, "defaultDiceCount", rules.diceCount);
        await game.settings.set(MODULE_ID, "defaultKeepResult", rules.keepResult);
        await game.settings.set(MODULE_ID, "defaultStaticModifier", rules.staticModifier);
        await game.settings.set(MODULE_ID, "defaultRollSource", rules.rollSource);
        return rules;
      } catch (error) {
        ui.notifications?.error?.("Could not save the hacking dice preferences.");
        throw error;
      }
    });
    return this.preferenceSave;
  }

  syncRollControls(form: HTMLFormElement | null) {
    if (!form) return;
    const source = form.querySelector<HTMLSelectElement>("[name='rollSource']")?.value;
    if (this.configurationMode) {
      const emptySkill = form.querySelector<HTMLOptionElement>("[name='skillId'] option[value='']");
      if (emptySkill) emptySkill.textContent = source === "system" ? "Choose a skill" : source === "sheet" ? "Player chooses on sheet" : "No skill modifier";
    }
    for (const row of form.querySelectorAll<HTMLElement>("[data-custom-roll]")) row.hidden = source !== "custom";
    const staticModifier = form.querySelector<HTMLInputElement>("[name='staticModifier']");
    if (staticModifier) staticModifier.disabled = source !== "custom";
    const keep = form.querySelector<HTMLSelectElement>("[name='keepResult']");
    if (keep) keep.disabled = form.querySelector<HTMLSelectElement>("[name='diceCount']")?.value === "1";
  }

  syncUserToActor(html: any, actorId: string) {
    const actor = getActorById(actorId);
    const user = getPlayerUsers().find((candidate) => actor?.testUserPermission(candidate, "OWNER"));
    if (user) html.find("[name='userId']").val(user.id);
  }

  syncSkillOptions(html: any, actorId: string) {
    if (this.configurationMode) {
      const skills = getConfigurationSkills();
      const selectedId = this.configuration?.skillId ?? "";
      let selected = skills.find(skill => skill.id === selectedId || skill.name.toLocaleLowerCase() === selectedId.toLocaleLowerCase());
      if (!selected && selectedId) {
        selected = { id: selectedId, name: this.configuration.skillLabel || selectedId, label: `${this.configuration.skillLabel || selectedId} (saved skill)`, modifier: 0 };
        skills.push(selected);
      }
      const select = html.find("[name='skillId']");
      select.html('<option value="">No skill modifier</option>' + skills.map(skill =>
        `<option value="${escapeHtml(skill.id)}" data-skill-label="${escapeHtml(skill.name)}">${escapeHtml(skill.label)}</option>`).join(""));
      select.val(selected?.id ?? "").prop("disabled", false).prop("required", false);
      html.find("[data-skill-warning]").prop("hidden", !!skills.length);
      return;
    }
    const actor = getActorById(actorId);
    const skills = getActorSkillOptions(actor);
    const select = html.find("[name='skillId']");
    select.html(skills.length ? skills.map((skill) => (
      `<option value="${escapeHtml(skill.id)}" data-skill-label="${escapeHtml(skill.name ?? skill.label)}" data-skill-modifier="${Number(skill.modifier ?? 0)}">${escapeHtml(skill.label)}</option>`
    )).join("") : '<option value="">No skills detected</option>');
    select.prop("disabled", !skills.length).prop("required", !!skills.length);
    html.find("[data-skill-warning]").prop("hidden", !!skills.length);
  }

  syncActorsForUser(html: any, userId: string) {
    const actors = getPlayerActorOptions(userId);
    const actorRows = actors.length
      ? actors.map((actor) => (
        `<option value="${escapeHtml(actor.id)}">${escapeHtml(actor.name)} (${escapeHtml(actor.owners.map((user) => user.name).join(", ") || "No owner")})</option>`
      )).join("")
      : '<option value="">Use assigned character</option>';
    html.find("[name='actorId']").html(actorRows);
    this.syncSkillOptions(html, html.find("[name='actorId']").val());
  }

  async saveConfiguration(form: HTMLFormElement) {
    if (!game.user?.isGM) return;
    const minigameType = form.querySelector<HTMLSelectElement>("[name='minigameType']")?.value;
    if (!this.api.getMinigames().some(game => game.id === minigameType)) {
      ui.notifications?.warn?.("Choose an available minigame.");
      return;
    }
    if (this.quickHack && !this.selectedOutcome) {
      ui.notifications?.warn?.("Choose a Quick Hack outcome first.");
      return;
    }
    const source = form.querySelector<HTMLSelectElement>("[name='rollSource']")?.value;
    const skill = form.querySelector<HTMLSelectElement>("[name='skillId']");
    if (!this.quickHack && source === "system" && (!supportsSystemSkillRoll() || !skill?.value)) {
      ui.notifications?.warn?.("Choose a skill for the system roll, or use another roll source.");
      return;
    }
    if (!form.reportValidity()) return;
    try {
      const configuration = createHackConfiguration({
        ...(this.quickHack ? this.configuration : await this.saveRollPreferences(form)), minigameType,
        skillId: skill?.value ?? "", skillLabel: skill?.selectedOptions[0]?.dataset.skillLabel ?? "",
        dc: this.quickHack ? this.configuration?.dc : form.querySelector<HTMLInputElement>("[name='dc']")?.value,
        liveAudience: form.querySelector<HTMLSelectElement>("[name='liveAudience']")?.value,
        quickOutcome: this.quickHack ? this.selectedOutcome : null
      });
      const resolve = this.configurationResult;
      this.configurationResult = null;
      resolve?.(configuration);
      await this.close();
    } catch (error) { ui.notifications?.warn?.(error.message); }
  }

  async close(options: any = {}) {
    const resolve = this.configurationResult;
    this.configurationResult = null;
    resolve?.(null);
    return super.close(options);
  }
}

export function openHackConfiguration(api: any, configuration: any = null, options: any = {}): Promise<any> {
  if (!game.user?.isGM) return Promise.reject(new Error("Only the GM can configure attached hacks."));
  return new Promise((resolve, reject) => {
    try {
      const app = new HackingLauncherApp({ api, configurationMode: true, configuration,
        editingConfiguration: !!configuration, onConfigured: resolve,
        id: `holosuite-hack-config-${foundry.utils.randomID()}`,
        title: options.title ? `Configure Hack: ${String(options.title)}` : "Configure Hack" });
      app.render(true);
    } catch (error) { reject(error); }
  });
}
