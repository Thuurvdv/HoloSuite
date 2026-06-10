// @ts-nocheck
import { MODULE_ID } from "./constants";

export function registerSettings(): void {
  game.settings.register(MODULE_ID, "cases", {
    name: "CSI Toolkit Cases",
    hint: "Stores all investigation cases for this world.",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
}
