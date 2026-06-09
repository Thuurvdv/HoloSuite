// @ts-nocheck
import { labelize } from "./text-utils";

export function registerHandlebarsHelpers(): void {
  Handlebars.registerHelper("csiEq", (left, right) => left === right);
  Handlebars.registerHelper("csiLabel", value => labelize(value));
  Handlebars.registerHelper("csiCount", value => Array.isArray(value) ? value.length : 0);
  Handlebars.registerHelper("csiFallback", (value, fallback) => value || fallback);
  Handlebars.registerHelper("csiJoin", value => Array.isArray(value) ? value.join(", ") : "");
  Handlebars.registerHelper("csiOption", (value, selected) => value === selected ? "selected" : "");
  Handlebars.registerHelper("csiChecked", value => value === "players" ? "checked" : "");
}
