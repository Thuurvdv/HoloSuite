import { MODULE_ID, SETTING_DETAIL_COLOR } from "./bounty-constants";

declare const game: any;

const DETAIL_COLORS = new Map([
  ["pink", "#ff4f9a"],
  ["yellow", "#ffe600"],
  ["green", "#39ff14"]
]);

export function applyDetailColor(value: string = game.settings.get(MODULE_ID, SETTING_DETAIL_COLOR)) {
  const color = DETAIL_COLORS.get(value) ?? DETAIL_COLORS.get("pink")!;
  document.documentElement.style.setProperty("--bb-detail-color", color);
}
