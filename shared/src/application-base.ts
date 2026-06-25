type FoundryApplicationConstructor = any;

function getFoundryApplicationsApi(): any {
  return (globalThis as any).foundry?.applications?.api ?? foundry?.applications?.api ?? null;
}

function getFoundryAppV1Api(): any {
  return (globalThis as any).foundry?.appv1?.api ?? foundry?.appv1?.api ?? null;
}

function mergeOptions(base: any = {}, override: any = {}) {
  const mergeObject = (globalThis as any).foundry?.utils?.mergeObject ?? foundry?.utils?.mergeObject;
  if (typeof mergeObject === "function") return mergeObject(base, override, { inplace: false });
  return { ...base, ...override };
}

function randomId() {
  return (globalThis as any).foundry?.utils?.randomID?.(8)
    ?? foundry?.utils?.randomID?.(8)
    ?? Math.random().toString(36).slice(2, 10);
}

function normalizeV1OptionsForV2(options: any = {}) {
  return {
    id: String(options.id ?? `legacy-application-${randomId()}`),
    tag: options.tag ?? "section",
    classes: Array.isArray(options.classes) ? options.classes : [],
    window: {
      title: options.title ?? "",
      icon: options.icon,
      resizable: options.resizable === true
    },
    position: {
      width: Number(options.width ?? 600),
      height: options.height === "auto" ? "auto" : Number(options.height ?? 600)
    }
  };
}

export function getFoundryGeneration(): number | null {
  const generation = Number((globalThis as any).game?.release?.generation ?? game?.release?.generation);
  return Number.isFinite(generation) ? generation : null;
}

export function shouldUseApplicationV2(): boolean {
  const generation = getFoundryGeneration();
  return generation === null || generation >= 13;
}

function wrapV2WithV1Compat(AppV2: any): any {
  return class V1CompatApplication extends AppV2 {
    static get defaultOptions() {
      return {};
    }

    static get DEFAULT_OPTIONS() {
      return normalizeV1OptionsForV2((this as any).defaultOptions ?? {});
    }

    _v1Options: any;

    constructor(options: any = {}) {
      const v1Options = mergeOptions((new.target as any).defaultOptions ?? {}, options);
      super(normalizeV1OptionsForV2(v1Options));
      this._v1Options = v1Options;
    }

    activateListeners(_html: any) {}

    async _renderHTML(_context: any, _options: any) {
      const data = typeof this.getData === "function" ? await this.getData() : {};
      const template = this._v1Options?.template
        ?? this.options?.template
        ?? (this.constructor as any).defaultOptions?.template;
      if (!template) return document.createDocumentFragment();
      const html = await (globalThis as any).renderTemplate(template, data);
      const el = document.createElement("template");
      el.innerHTML = html.trim();
      return el.content;
    }

    _activateV1Form(content: HTMLElement) {
      if (typeof (this as any)._updateObject !== "function") return;
      const form = content.matches?.("form") ? content : content.querySelector?.("form");
      if (!(form instanceof HTMLFormElement)) return;
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const formData = new FormData(form);
        await (this as any)._updateObject(event, formData);
        if (this._v1Options?.closeOnSubmit === true) await this.close();
      });
    }

    _replaceHTML(result: any, content: HTMLElement, _options: any) {
      content.replaceChildren(result);
      const jq = (globalThis as any).jQuery ?? (globalThis as any).$;
      const appRoot = content.closest?.(".window-app, .app, .application") ?? content;
      const legacyElement = jq ? jq(appRoot) : appRoot;
      try {
        Object.defineProperty(this, "element", {
          value: legacyElement,
          configurable: true,
          writable: true
        });
      } catch (_error) {
        try {
          (this as any).element = legacyElement;
        } catch (_assignmentError) {
          // Some ApplicationV2 builds expose element as a read-only accessor.
        }
      }
      const classes = this._v1Options?.classes;
      if (Array.isArray(classes) && classes.length) {
        content.classList.add(...classes);
        content.closest?.(".window-app, .app, .application")?.classList.add(...classes);
      }
      this._activateV1Form(content);
      if (typeof this.activateListeners === "function") {
        this.activateListeners(jq ? jq(content) : content);
      }
    }
  };
}

export function getLegacyApplicationBase(): FoundryApplicationConstructor {
  const applications = getFoundryApplicationsApi();
  const appv1 = getFoundryAppV1Api();
  const v1 = (globalThis as any).Application
    ?? appv1?.Application
    ?? applications?.ApplicationV1
    ?? (globalThis as any).FormApplication
    ?? appv1?.FormApplication
    ?? applications?.FormApplication;
  if (v1) return v1;
  const v2 = applications?.ApplicationV2;
  if (v2) return wrapV2WithV1Compat(v2);
  return null;
}

export function getLegacyFormApplicationBase(): FoundryApplicationConstructor {
  const applications = getFoundryApplicationsApi();
  const appv1 = getFoundryAppV1Api();
  const v1 = (globalThis as any).FormApplication
    ?? appv1?.FormApplication
    ?? applications?.FormApplication
    ?? (globalThis as any).Application
    ?? appv1?.Application
    ?? applications?.ApplicationV1;
  if (v1) return v1;
  const v2 = applications?.ApplicationV2;
  if (v2) return wrapV2WithV1Compat(v2);
  return getLegacyApplicationBase();
}
