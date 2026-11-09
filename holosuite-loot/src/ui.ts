import { getLegacyApplicationBase } from "../../shared/src/application-base";
import { MODULE_ID, resolveCharacter, actorKey, configFor } from "./model.mjs";
declare const canvas: any;
import { LootPopupPresentation, OutsideDismissal } from "./popup";
import { canRefreshInventory, editRules, refreshInventory, ruleRows } from "./persistence";
import { postQuantityRoll } from "./chat.mjs";
import { parseRule } from "./rules.mjs";
import { isAuthority } from "./permissions";
declare const game: any;
declare const ui: any;
declare const foundry: any;
const Base = getLegacyApplicationBase();
const template = (name: string) => `modules/${MODULE_ID}/templates/${name}.hbs`;
export const t = (key: string) => game.i18n.localize(`HL.${key}`);
export function report(error: any) {
  const message = t(error?.code ?? "TransferFailed");
  ui.notifications.warn(message); return message;
}
const rootOf = (html: any): HTMLElement => html instanceof HTMLElement ? html : html[0];

export class LootPanel extends Base {
  token: any;
  send: any;
  adapter: any;
  data: any = { entries: [] };
  destination = "";
  busy = false;
  message = "";
  loading = false;
  firstDraw: Promise<void> | null = null;
  resolveFirstDraw: (() => void) | null = null;
  refreshing: Promise<any> | null = null;
  refreshAgain = false;
  disposed = false;
  presentation: LootPopupPresentation | null = null;
  constructor(token: any, send: any, adapter: any) {
    super({ id: `hololoot-${token.id}` }); this.token = token; this.send = send; this.adapter = adapter;
    const assigned = game.user.character;
    if (assigned && adapter.destination(assigned) && assigned.testUserPermission(game.user, "OWNER")) this.destination = assigned.id;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot", classes: ["holosuite-loot-window", "holosuite-loot-popup"], template: template("loot"),
      width: 340, height: "auto", resizable: false
    });
  }
  show(initialData?: any) {
    if (!this.firstDraw) {
      this.firstDraw = new Promise<void>(resolve => { this.resolveFirstDraw = resolve; });
      this.loading = initialData === undefined;
      if (!this.loading) this.data = initialData;
      this.render(true);
    }
    return this.firstDraw;
  }
  async refresh() {
    if (this.disposed) return;
    if (this.busy) { this.refreshAgain = true; return; }
    if (this.refreshing) { this.refreshAgain = true; return this.refreshing; }
    this.refreshAgain = false;
    this.refreshing = (async () => {
      try {
        this.data = await this.send({ action: "view", tokenUuid: this.token.uuid });
        this.message = "";
      } catch (error) {
        if (this.disposed) return;
        if (error?.code === "OutOfRange") {
          report(error);
          await this.close();
          return;
        }
        this.data = { entries: [] }; this.message = report(error);
      }
      this.loading = false;
      if (!this.disposed) this.render(true);
    })().finally(() => {
      this.refreshing = null;
      if (this.refreshAgain && !this.disposed && !this.busy) void this.refresh();
    });
    return this.refreshing;
  }
  getData() {
    const showSelector = game.settings.get(MODULE_ID, "characterSelector");
    const theme = game.settings.get(MODULE_ID, "panelTheme");
    const actors = game.actors.contents.filter((actor: any) => this.adapter.destination(actor)
      && actor.testUserPermission(game.user, "OWNER"));
    // One unassigned character is unambiguous; multiple require an explicit choice.
    let resolutionError = "";
    if (!showSelector) {
      try { this.destination = actorKey(resolveCharacter(game.user, game.actors.contents, canvas.scene?.tokens, this.adapter)); }
      catch (error) { this.destination = ""; resolutionError = t(error.code); }
    }
    else if (!this.destination && actors.length === 1) this.destination = actors[0].id;
    const selected = showSelector ? actors.some((actor: any) => actor.id === this.destination) : !!this.destination;
    return { ...this.data, name: this.data.name ?? this.token.name, img: this.data.img ?? this.token.texture.src,
      actors: actors.map((actor: any) => ({ id: actor.id, name: actor.name, selected: actor.id === this.destination })),
      disabled: this.loading || this.busy || !selected || !this.data.entries.length,
      loading: this.loading, showSelector, theme,
      busy: this.busy, message: this.message || resolutionError || (!actors.length && showSelector ? t("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message };
  }
  activateListeners(html: any) {
    super.activateListeners(html);
    if (this.disposed) return;
    const root = rootOf(html);
    this.presentation?.destroy();
    const window = root.closest<HTMLElement>(".window-app, .application")
      ?? root.closest<HTMLElement>(".holosuite-loot-popup") ?? root;
    this.presentation = new LootPopupPresentation(window, this.token,
      (left, top) => this.setPosition({ left, top }), () => void this.close());
    root.querySelector("select")?.addEventListener("change", (event: any) => { this.destination = event.target.value; this.render(true); });
    root.querySelectorAll<HTMLButtonElement>("button[data-loot]").forEach(button => {
      button.addEventListener("click", () => void this.take(button.dataset.loot));
    });
    root.querySelectorAll<HTMLButtonElement>("[data-inspect]").forEach(button => {
      button.addEventListener("click", () => void this.inspect(button.dataset.inspect));
    });
    this.resolveFirstDraw?.(); this.resolveFirstDraw = null;
  }
  async inspect(entryId?: string) {
    try {
      const result = await this.send({ action: "inspect", entryId, tokenUuid: this.token.uuid });
      const data = { ...result.item, ownership: { default: 0, [game.user.id]: 2 } };
      const ItemClass = (globalThis as any).CONFIG.Item.documentClass;
      const item = new ItemClass(data, { temporary: true });
      item.sheet.render(true, { editable: false });
    } catch (error) { report(error); }
  }
  async take(entryId?: string) {
    if (this.busy) return;
    this.getData(); // Re-resolve the assigned character if it changed while the panel was open.
    if (!this.destination) { this.message = this.getData().message || t("NoActor"); this.render(true); return; }
    this.busy = true; this.message = ""; this.render(true);
    try {
      this.data = await this.send({ action: entryId === "all" ? "all" : "take", entryId,
        actorId: this.destination, tokenUuid: this.token.uuid });
      const failures = this.data.failures ?? [];
      this.message = failures.map((failure: any) => `${failure.name}: ${t(failure.code)}`).join(" · ");
      if (this.message) ui.notifications.warn(this.message);
    } catch (error) { this.message = report(error); }
    finally {
      this.busy = false;
      if (!this.disposed) { this.render(true); if (this.refreshAgain) void this.refresh(); }
    }
  }
  async close(options?: any) {
    this.disposed = true; this.presentation?.destroy(); this.presentation = null;
    this.resolveFirstDraw?.(); this.resolveFirstDraw = null;
    return super.close(options);
  }
}

export class LootConfig extends Base {
  token: any;
  adapter: any;
  queue: any;
  config: any;
  scope = "token";
  busy = false;
  dismissal: OutsideDismissal | null = null;
  constructor(token: any, adapter: any, queue: any) {
    super({ id: `hololoot-config-${token.id}` }); this.token = token; this.adapter = adapter; this.queue = queue;
    this.config = structuredClone(configFor(token));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, { title: t("Title"), classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: template("config"), width: 480, height: "auto", resizable: false });
  }
  getData() {
    const automatic = game.settings.get(MODULE_ID, "zeroHP");
    const selectedMode = !automatic && this.config.mode === "automatic" ? "disabled" : this.config.mode;
    const ruleLabel = (rule: any) => rule?.quantity ?? (rule ? t(`Rule.${rule.mode}`) : "");
    const rows = ruleRows(this.token, this.adapter).map(({ entry, effective, overrides, ...row }) => ({
      ...row, configured: ruleLabel(effective.rule), effectiveScope: effective.scope,
      tokenRule: ruleLabel(overrides.token), actorRule: ruleLabel(overrides.actor), globalRule: ruleLabel(overrides.global),
      ruleScope: t(`Scope.${effective.scope}`),
      original: entry?.originalQuantity ?? row.quantity,
      remaining: entry ? (entry.taken ? 0 : entry.formula ?? entry.data.system.quantity) : "—",
      rollResult: !entry?.taken && Number.isSafeInteger(entry?.rolledQuantity)
        ? game.i18n.format("HL.QuantityRollResult", { roll: entry.rolledQuantity, quantity: entry.data.system.quantity }) : "",
      pending: !!entry?.claim && !entry?.taken
    }));
    const canEdit = isAuthority();
    return { name: this.token.name, theme: game.settings.get(MODULE_ID, "panelTheme"), busy: this.busy, automatic, rows, canEdit,
      canRefresh: canEdit && canRefreshInventory(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map(value => ({ value, label: t(`Scope.${value}`), selected: this.scope === value })),
      modes: (automatic ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"])
        .map(value => ({ value, label: t(value), selected: value === selectedMode })) };
  }
  activateListeners(html: any) {
    super.activateListeners(html); const root = rootOf(html);
    this.dismissal?.destroy();
    this.dismissal = new OutsideDismissal(root.closest<HTMLElement>(".window-app, .application") ?? root, () => { if (!this.busy) void this.close(); });
    root.querySelector<HTMLSelectElement>('[name="mode"]')?.addEventListener("change", (event: any) => { this.config.mode = event.target.value; });
    root.querySelector("[data-save]")?.addEventListener("click", () => void this.save());
    root.querySelector("[data-close]")?.addEventListener("click", () => void this.close());
    const scope = root.querySelector<HTMLSelectElement>('[name="scope"]');
    const behavior = root.querySelector<HTMLSelectElement>('[name="behavior"]');
    const formula = root.querySelector<HTMLInputElement>('[name="formula"]');
    const apply = root.querySelector<HTMLButtonElement>("[data-apply]");
    const refresh = root.querySelector<HTMLButtonElement>("[data-refresh-inventory]");
    const selectAll = root.querySelector<HTMLInputElement>("[data-select-all]");
    if (!scope || !behavior || !formula || !apply || !selectAll) return;
    const checks = Array.from(root.querySelectorAll<HTMLInputElement>("input[data-rule-item]"));
    const sync = () => {
      this.scope = scope.value;
      scope.disabled = behavior.disabled = formula.disabled = this.busy;
      if (refresh) refresh.disabled = this.busy;
      const eligible = checks.filter(check => {
        const available = check.dataset[this.scope] === "true";
        check.disabled = this.busy || !available;
        if (!available) check.checked = false;
        const row = check.closest("label");
        const reason = row?.querySelector<HTMLElement>("[data-rule-unavailable]");
        const unavailable = check.dataset[`${this.scope}Unavailable`];
        if (reason) reason.textContent = !available && unavailable ? t(unavailable) : "";
        const scoped = row?.querySelector<HTMLElement>("[data-scoped-rule]");
        const rule = check.dataset[`${this.scope}Rule`];
        if (scoped) scoped.textContent = rule && check.dataset.effectiveScope !== this.scope
          ? ` · ${t(`Scope.${this.scope}`)} ${rule}` : "";
        return available;
      });
      const selected = eligible.filter(check => check.checked).length;
      selectAll.disabled = this.busy || !eligible.length;
      selectAll.checked = !!selected && selected === eligible.length;
      selectAll.indeterminate = !!selected && !selectAll.checked;
      apply.disabled = this.busy || !selected;
      formula.hidden = behavior.value !== "quantity";
    };
    scope.addEventListener("change", sync);
    behavior.addEventListener("change", sync);
    for (const check of checks) check.addEventListener("change", sync);
    selectAll.addEventListener("change", () => {
      for (const check of checks) if (!check.disabled) check.checked = selectAll.checked;
      sync();
    });
    refresh?.addEventListener("click", async () => {
      if (!isAuthority() || this.busy) return;
      this.busy = true;
      sync();
      try {
        await this.queue.run(this.token.uuid, () => refreshInventory(this.token, this.adapter));
        ui.notifications.info(t("InventoryRefreshed"));
      } catch (error) { report(error); return; }
      finally { this.busy = false; sync(); }
      if (this.rendered) this.render(true);
    });
    apply.addEventListener("click", async () => {
      if (!isAuthority() || this.busy) return;
      try {
        const rule = parseRule(behavior.value, formula.value);
        const ids = checks.filter(check => check.checked && !check.disabled).map(check => check.value);
        const selectedScope = this.scope;
        this.busy = true;
        sync();
        const rolls = await this.queue.run(this.token.uuid, () => editRules(this.token, this.adapter, selectedScope, ids, rule));
        for (const result of rolls ?? []) {
          void postQuantityRoll(result).catch(error => console.warn("HoloSuite Loot | Could not post quantity roll", error));
        }
      } catch (error) { report(error); return; }
      finally { this.busy = false; sync(); }
      this.render(true);
    });
    sync();
  }
  async save() {
    if (!game.user.isGM || this.busy) return;
    this.busy = true; this.render(true);
    try {
      const mode = this.config.mode === "automatic" && !game.settings.get(MODULE_ID, "zeroHP") ? "disabled" : this.config.mode;
      await this.queue.run(this.token.uuid, () => this.token.setFlag(MODULE_ID, "config", { ...configFor(this.token), mode }));
      await this.close();
    } catch (error) { report(error); }
    finally { this.busy = false; if (this.rendered) this.render(true); }
  }
  async close(options?: any) {
    this.dismissal?.destroy(); this.dismissal = null;
    return super.close(options);
  }
}
