import { FATE_STYLE } from "./shattered-fate";
import { MODULE_ID, MODULE_TITLE, SETTINGS, TEMPLATE_PATH, getDieSides, getFailureThreshold, getPlayerConfigs, getThreshold, lowRollsAreGood, normalizeDurationOverride, savePlayerConfigs, setSetting, setting } from "./settings";
import { getLegacyFormApplicationBase } from "../../shared/src/application-base";
import { getCriticalRollEndpoints, getDieOptions } from "../../shared/src/dice-checks";
import { previewCutin } from "./cutin-animation";
import { EFFECT_PRESETS, normalizeEffectId, getEffectPreset } from "./effect-presets";
import { MANGA_ACCENT, MANGA_STYLE } from "./manga-overdrive";

declare const foundry: any;
declare const game: any;
declare const ui: any;
const FALLBACK_PORTRAIT = "icons/svg/mystery-man.svg";

const BaseFormApplication = getLegacyFormApplicationBase();

export async function confirmRollThresholdReset(dieSides: number, rollDirection: string, targetCount: number) {
  const { success, failure } = getCriticalRollEndpoints(dieSides, rollDirection);
  const content = `<p>Change to <strong>d${dieSides}</strong> with <strong>${rollDirection === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${targetCount} listed character and GM entries, for both outcomes, and the global thresholds:</p>
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
  const animationStyle = normalizeEffectId(config.animationStyle);
  return {
    enabled: config.enabled !== false,
    threshold: Number.isInteger(threshold) && threshold >= 1 && threshold <= getDieSides() ? threshold : "",
    duration: normalizeDurationOverride(config.duration),
    animationStyle,
    effectDescription: getEffectPreset(animationStyle).description,
    animationStyles: EFFECT_PRESETS.map(preset => ({ value: preset.id, label: preset.label, description: preset.description, selected: animationStyle === preset.id })),
    imagePath: String(config.imagePath ?? ""),
    audioPath: String(config.audioPath ?? ""),
    overlayText: String(config.overlayText ?? ""),
    accentColor: String(config.accentColor ?? (animationStyle === MANGA_STYLE ? MANGA_ACCENT : defaultAccent))
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
    if (!game.users?.some((user) => !user.isGM && userOwnsActor(user, actor))) continue;
    targets.push({
      key: targetKey("actor", actor.id),
      type: "actor",
      typeLabel: "Actor",
      id: actor.id,
      name: actor.name,
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
  selectedPlayer = "gm";
  selectedCharacters = new Map<string, string>();
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
    const targets = buildTargets();
    const players = [
      { id: "gm", name: "GM", avatar: targets[0].portrait, targets: [targets[0]] },
      ...Array.from<any>(game.users ?? []).filter(user => !user.isGM).map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar || FALLBACK_PORTRAIT,
        targets: targets.filter(target => target.type === "actor" && userOwnsActor(user, game.actors.get(target.id)))
      }))
    ];
    const rows = targets.map(target => {
      const config = normalizeConfig(configs[target.key]);
      return {
        ...target, ...config,
        actorId: target.type === "actor" ? target.id : "",
        outcomes: [
          { ...config.success, kind: "success", defaultText: setting(SETTINGS.defaultText) },
          { ...config.failure, kind: "failure", defaultText: setting(SETTINGS.defaultFailureText) }
        ]
      };
    });

    return {
      players: players.map(player => ({
        ...player,
        characterHeading: player.id === "gm" ? "GM Configuration" : `${player.name}’s Characters`,
        tabDetail: player.id === "gm" ? "Global" : `${player.targets.length} ${player.targets.length === 1 ? "character" : "characters"}`
      })),
      featuredStyles: ["strike", "breach", "signal", "rift", MANGA_STYLE, FATE_STYLE].map(getEffectPreset),
      dieSides: getDieSides(),
      dice: getDieOptions(getDieSides()),
      lowRollsGood: lowRollsAreGood(),
      threshold: setting(SETTINGS.threshold) ?? 0,
      failureThreshold: setting(SETTINGS.failureThreshold) ?? 0,
      duration: setting(SETTINGS.duration),
      rows
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const root: HTMLElement = html instanceof HTMLElement ? html : html[0];
    const form = root.matches(".hcci-config") ? root as HTMLFormElement : root.querySelector<HTMLFormElement>(".hcci-config")!;
    const query = <T extends HTMLElement = HTMLElement>(selector: string) => form.querySelector<T>(selector)!;
    const all = <T extends HTMLElement = HTMLElement>(selector: string) => Array.from(form.querySelectorAll<T>(selector));
    const playerTabs = all<HTMLButtonElement>("[data-hcci-player]");
    const lists = all("[data-hcci-characters]");
    const characters = all<HTMLButtonElement>("[data-hcci-character]");
    const outcomes = all<HTMLButtonElement>("[data-hcci-tab]");
    const rows = all("[data-hcci-row]");
    const panels = all("[data-hcci-panel]");
    const workspace = query("[data-hcci-workspace]");
    const art = query<HTMLImageElement>("[data-hcci-art]");
    const cards = all<HTMLButtonElement>("[data-hcci-style]");
    let row: HTMLElement | undefined;
    let panel: HTMLElement | undefined;
    let kind = "success";
    let artworkSource = "";
    let portrait = "";
    const field = (name: string) => panel?.querySelector<HTMLInputElement>(`[data-hcci-field="${name}"]`);

    const syncPreview = () => {
      if (!row || !panel) return;
      const image = field("imagePath")!.value.trim();
      const fallback = row.dataset.hcciPortrait || FALLBACK_PORTRAIT;
      if (image !== artworkSource || fallback !== portrait) {
        artworkSource = image;
        portrait = fallback;
        art.src = image || fallback;
      }
      art.parentElement!.style.setProperty("--hcci-preview-accent", field("accentColor")!.value);
      query("[data-hcci-caption]").textContent = field("overlayText")!.value.trim() || field("overlayText")!.placeholder;
      const style = getEffectPreset(field("animationStyle")!.value);
      query("[data-hcci-effect-description]").textContent = style.description;
      cards.forEach(card => card.setAttribute("aria-pressed", String(card.dataset.hcciStyle === style.id)));
    };
    art.addEventListener("error", () => {
      const src = art.getAttribute("src");
      if (src !== portrait && src !== FALLBACK_PORTRAIT) art.src = portrait;
      else if (src !== FALLBACK_PORTRAIT) art.src = FALLBACK_PORTRAIT;
    });

    const selectTab = (tab: HTMLButtonElement, selected: boolean) => {
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    };
    const navigate = (player: string, character = this.selectedCharacters.get(player), scope?: string) => {
      this.selectedPlayer = player;
      const list = lists.find(item => item.dataset.hcciCharacters === player);
      const choices = characters.filter(button => list?.contains(button));
      const selected = choices.find(button => button.dataset.hcciCharacter === character) ?? choices[0];
      const key = selected?.dataset.hcciCharacter;
      kind = scope ?? this.activeTabs.get(key) ?? "success";
      if (key) {
        this.selectedCharacters.set(player, key);
        this.activeTabs.set(key, kind);
      }
      row = rows.find(item => item.dataset.hcciRow === key);
      panel = row?.querySelector<HTMLElement>(`[data-hcci-panel="${kind}"]`);
      playerTabs.forEach(tab => selectTab(tab, tab.dataset.hcciPlayer === player));
      lists.forEach(item => { item.hidden = item !== list; });
      characters.forEach(button => button.setAttribute("aria-pressed", String(button === selected)));
      outcomes.forEach(tab => selectTab(tab, tab.dataset.hcciTab === kind));
      rows.forEach(item => { item.hidden = item !== row; });
      panels.forEach(item => { item.hidden = item !== panel; });
      query("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${kind}-tab`);
      workspace.hidden = !row;
      workspace.dataset.hcciKind = kind;
      query("[data-hcci-preview-kind]").textContent = kind === "failure" ? "Critical Failure" : "Critical Success";
      syncPreview();
    };

    playerTabs.forEach(tab => tab.addEventListener("click", () => navigate(tab.dataset.hcciPlayer!)));
    characters.forEach(button => button.addEventListener("click", () => navigate(this.selectedPlayer, button.dataset.hcciCharacter)));
    outcomes.forEach(tab => tab.addEventListener("click", () => navigate(this.selectedPlayer, undefined, tab.dataset.hcciTab)));
    for (const tabs of [playerTabs, outcomes]) for (const [index, tab] of tabs.entries()) {
      tab.addEventListener("keydown", event => {
        const next = { Home: 0, End: tabs.length - 1, ArrowLeft: (index - 1 + tabs.length) % tabs.length,
          ArrowRight: (index + 1) % tabs.length }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        tabs[next].focus();
        tabs[next].click();
      });
    }
    cards.forEach(card => card.addEventListener("click", () => {
      const select = field("animationStyle")!;
      select.value = card.dataset.hcciStyle!;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }));
    navigate(playerTabs.some(tab => tab.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");

    // Reveal the first invalid input before the browser tries to focus it.
    let revealingInvalid = false;
    form.addEventListener("invalid", event => {
      if (revealingInvalid) return;
      revealingInvalid = true;
      queueMicrotask(() => { revealingInvalid = false; });
      const input = event.target as HTMLElement;
      const drawer = input.closest("details");
      if (drawer) drawer.open = true;
      const target = input.closest<HTMLElement>("[data-hcci-row]")?.dataset.hcciRow;
      if (!target) return;
      const owners = characters.filter(button => button.dataset.hcciCharacter === target);
      const owner = owners.find(button => button.closest<HTMLElement>("[data-hcci-characters]")?.dataset.hcciCharacters === this.selectedPlayer) ?? owners[0];
      const player = owner?.closest<HTMLElement>("[data-hcci-characters]")?.dataset.hcciCharacters;
      if (player) navigate(player, target, input.closest<HTMLElement>("[data-hcci-panel]")?.dataset.hcciPanel);
    }, true);

    const markDirty = () => { query("[data-hcci-dirty]").hidden = false; };
    const die = query<HTMLSelectElement>('[name="dieSides"]');
    const directionInput = query<HTMLSelectElement>('[name="rollDirection"]');
    const successInput = query<HTMLInputElement>('[name="threshold"]');
    const failureInput = query<HTMLInputElement>('[name="failureThreshold"]');
    const thresholds = all<HTMLInputElement>('[data-hcci-field="threshold"]');
    const syncRollControls = () => {
      const sides = Number(die.value);
      const low = directionInput.value === "low";
      all("[data-hcci-success-label]").forEach(label => { label.textContent = low ? "Success ≤" : "Success ≥"; });
      all("[data-hcci-failure-label]").forEach(label => { label.textContent = low ? "Failure ≥" : "Failure ≤"; });
      if (!Number.isInteger(sides) || sides < 2 || sides > 10000) return;
      const success = Number(successInput.value) || (low ? 1 : sides);
      const failure = Number(failureInput.value) || (low ? sides : 1);
      for (const input of [successInput, failureInput, ...thresholds]) input.max = String(sides);
      for (const input of thresholds) {
        input.placeholder = String(input.closest('[data-hcci-panel="success"]') ? success : failure);
      }
    };
    syncRollControls();

    let acceptedSides = Number(die.value);
    let acceptedDirection = directionInput.value;
    const changeRollRule = () => {
      if (this.rollRuleChange) return;
      const sides = Number(die.value);
      const direction = directionInput.value;
      if (sides === acceptedSides && direction === acceptedDirection) return;
      const controls = [die, directionInput, query<HTMLButtonElement>('[type="submit"]')];
      controls.forEach(control => { control.disabled = true; });
      this.rollRuleChange = (async () => {
        try {
          if (!await confirmRollThresholdReset(sides, direction, rows.length)) return;
          const { success, failure } = getCriticalRollEndpoints(sides, direction);
          successInput.value = String(success);
          failureInput.value = String(failure);
          for (const input of thresholds) {
            input.value = String(input.closest('[data-hcci-panel="success"]') ? success : failure);
          }
          acceptedSides = sides;
          acceptedDirection = direction;
          markDirty();
        } catch (error) {
          console.error(`${MODULE_ID} | Could not confirm dice change.`, error);
          ui.notifications?.error?.("Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          die.value = String(acceptedSides);
          directionInput.value = acceptedDirection;
          syncRollControls();
          controls.forEach(control => { control.disabled = false; });
          this.rollRuleChange = null;
        }
      })();
    };
    die.addEventListener("change", changeRollRule);
    directionInput.addEventListener("change", changeRollRule);

    for (const eventName of ["input", "change"]) form.addEventListener(eventName, event => {
      const input = event.target as HTMLElement;
      if (!input.matches("input, select") || input === die || input === directionInput) return;
      markDirty();
      if (input === successInput || input === failureInput) syncRollControls();
      if (panel?.contains(input)) syncPreview();
    });

    for (const button of all<HTMLButtonElement>("[data-hcci-browse]")) button.addEventListener("click", () => {
      const name = button.dataset.hcciBrowse;
      const input = field(name);
      if (!input) return;
      const Picker = foundry?.applications?.apps?.FilePicker?.implementation ?? (globalThis as any).FilePicker;
      const picker = new Picker({
        type: name === "audioPath" ? "audio" : "image",
        current: input.value,
        callback: (path: string) => {
          input.value = path;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
      picker.browse();
    });

    const test = query<HTMLButtonElement>("[data-hcci-test]");
    test.addEventListener("click", async () => {
      if (!game.user?.isGM || !row || !panel || test.getAttribute("aria-disabled") === "true") return;
      const endpoints = getCriticalRollEndpoints(acceptedSides, acceptedDirection);
      const scope = kind === "failure" ? "failure" : "success";
      const threshold = scope === "failure" ? failureInput.value : successInput.value;
      const animationStyle = field("animationStyle")!.value;
      test.setAttribute("aria-disabled", "true");
      try {
        const played = await previewCutin({
          actorId: row.dataset.hcciActorId || null,
          actorName: row.dataset.hcciActorId ? row.dataset.hcciName : "",
          triggerKind: scope,
          naturalResult: endpoints[scope],
          threshold: Number(field("threshold")?.value) || Number(threshold) || endpoints[scope],
          animationStyle,
          imagePath: field("imagePath")!.value.trim() || portrait,
          fallbackImagePath: portrait,
          audioPath: field("audioPath")!.value.trim(),
          overlayText: field("overlayText")!.value.trim() || field("overlayText")!.placeholder,
          accentColor: field("accentColor")!.value,
          textEnabled: !["rift", MANGA_STYLE, FATE_STYLE].includes(animationStyle) || setting(SETTINGS.textEnabled) !== false,
          duration: normalizeDurationOverride(field("duration")?.value)
            ?? normalizeDurationOverride(query<HTMLInputElement>('[name="duration"]').value)
            ?? setting(SETTINGS.duration),
          volume: setting(SETTINGS.volume)
        });
        if (!played) ui.notifications?.info?.("A cut-in is already playing.");
      } finally {
        test.removeAttribute("aria-disabled");
      }
    });

    query("[data-hcci-action='reset']").addEventListener("click", async () => {
      const DialogV2 = foundry?.applications?.api?.DialogV2;
      const confirmed = DialogV2?.confirm
        ? await DialogV2.confirm({
            window: { title: "Reset All Character Cut-Ins?" },
            content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
            modal: true,
            rejectClose: false,
            yes: { label: "Reset Overrides" },
            no: { label: "Cancel", default: true }
          }) === true
        : globalThis.confirm("Reset every GM and actor cut-in override?");
      if (!confirmed) return;
      await savePlayerConfigs({});
      ui.notifications?.info("Critical Cut-In player configuration reset.");
      this.render(false);
    });
  }

  async _updateObject(event: Event) {
    if (!game.user?.isGM || this.rollRuleChange) return;
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    const dieSides = Number(form.querySelector<HTMLSelectElement>('[name="dieSides"]')?.value ?? getDieSides());
    const rollDirection = form.querySelector<HTMLSelectElement>('[name="rollDirection"]')?.value === "low" ? "low" : "high";
    const configs: Record<string, any> = getPlayerConfigs();

    const readPanel = (row: HTMLElement, scope: string) => {
      const panel = row.querySelector<HTMLElement>(`[data-hcci-panel="${scope}"]`);
      const field = (name: string) => panel?.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-hcci-field="${name}"]`);
      const duration = normalizeDurationOverride(field("duration")?.value);
      return {
        ...(duration === undefined ? {} : { duration }),
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
