declare const foundry: any;

export function getApplicationBase() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
  return HandlebarsApplicationMixin(ApplicationV2);
}
