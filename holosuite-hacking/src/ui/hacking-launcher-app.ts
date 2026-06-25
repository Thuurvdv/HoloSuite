import { escapeHtml, getActorById, getActorSkillOptions, getPlayerActorOptions, getPlayerUsers } from "../core/actor-skills";
import { getLegacyApplicationBase } from "../../../shared/src/application-base";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/hacking-launcher.html`;
const LegacyApplication = getLegacyApplicationBase();

export class HackingLauncherApp extends LegacyApplication {
  api: any;

  constructor(options: any = {}) {
    super(options);
    this.api = options.api;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: true,
      resizable: true,
      width: 460,
      height: 440,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    const defaultDc = Number(game.settings.get(MODULE_ID, "defaultDc") ?? 15);
    const users = getPlayerUsers();
    const firstUser = users[0] ?? null;
    const actorOptions = getPlayerActorOptions(firstUser?.id);
    const firstActor = actorOptions.length ? getActorById(actorOptions[0].id) : null;
    return {
      defaultDc,
      defaultTestRoll: defaultDc,
      minigames: this.api.getMinigames(),
      actors: actorOptions.map((actor) => ({
        id: actor.id,
        name: actor.name,
        ownerNames: actor.owners.map((user) => user.name).join(", ") || "No active owner"
      })),
      users: users.map((user) => ({
        id: user.id,
        name: user.name
      })),
      skills: getActorSkillOptions(firstActor)
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    const form = html.is("form") ? html[0] : html.find("form")[0];
    html.find("[data-action='start']").on("click", (event) => {
      event.preventDefault();
      this.submit(form);
    });
    html.find("[data-action='test-self']").on("click", (event) => {
      event.preventDefault();
      this.testSelf(form);
    });
    const formElement = html.is("form") ? html : html.find("form");
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
  }

  submit(form: HTMLFormElement | null) {
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!form) {
      ui.notifications?.error?.("HoloSuite Hacking launcher form was not found.");
      console.error(`${MODULE_ID} | Launcher form was not found.`);
      return;
    }

    const minigameSelect = form.querySelector<HTMLSelectElement>("[name='minigameType']");
    const actorSelect = form.querySelector<HTMLSelectElement>("[name='actorId']");
    const userSelect = form.querySelector<HTMLSelectElement>("[name='userId']");
    const skillSelect = form.querySelector<HTMLSelectElement>("[name='skillId']");
    const dcInput = form.querySelector<HTMLInputElement>("[name='dc']");
    const selectedSkill = skillSelect?.selectedOptions?.[0] ?? null;

    const minigameType = String(minigameSelect?.value || "node-intrusion");
    const actorId = String(actorSelect?.value || "");
    const userId = String(userSelect?.value || "");
    const skillId = String(skillSelect?.value || "");
    const skillLabel = String(selectedSkill?.dataset.skillLabel || selectedSkill?.textContent || skillId || "Skill");
    const skillModifier = Number(selectedSkill?.dataset.skillModifier ?? 0);
    const dc = Number(dcInput?.value ?? 15);

    const sent = this.api.sendHackToPlayer({
      minigameType,
      actorId,
      userId,
      skillId,
      skillLabel,
      skillModifier,
      dc,
      onSuccess: () => {},
      onFailure: () => {}
    });
    if (sent) this.close();
  }

  testSelf(form: HTMLFormElement | null) {
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

    this.api.startHack({
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

  syncUserToActor(html: any, actorId: string) {
    const actor = getActorById(actorId);
    const user = getPlayerUsers().find((candidate) => actor?.testUserPermission(candidate, "OWNER"));
    if (user) html.find("[name='userId']").val(user.id);
  }

  syncSkillOptions(html: any, actorId: string) {
    const actor = getActorById(actorId);
    const skills = getActorSkillOptions(actor);
    html.find("[name='skillId']").html(skills.map((skill) => (
      `<option value="${escapeHtml(skill.id)}" data-skill-label="${escapeHtml(skill.name ?? skill.label)}" data-skill-modifier="${Number(skill.modifier ?? 0)}">${escapeHtml(skill.label)}</option>`
    )).join(""));
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
}
