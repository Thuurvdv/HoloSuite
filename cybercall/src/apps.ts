import {
  renderComposerFallbackTemplate,
  renderContactsFallbackTemplate,
  renderFallbackTemplate
} from "./fallback-templates";
import { normalizeCallData } from "./call-model";

declare const foundry: any;
declare const Application: any;
declare const $: any;

export function createCyberCallAppClasses(deps: any) {
  const {
    moduleId,
    templatePath,
    composerTemplatePath,
    contactsTemplatePath,
    escapeHTML,
    getDefaultComposerData,
    getActorChoices,
    getPlayerChoices,
    getContacts,
    getGroupContacts,
    getRingtoneChoices,
    getSoundPath,
    getActiveContactsTab,
    canEditContactImages,
    bindCallControls,
    bindComposerControls,
    bindContactsControls,
    stopRinging,
    clearActiveCall,
    clearActiveComposer,
    clearActiveContacts
  } = deps;

  const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry?.applications?.api?.HandlebarsApplicationMixin;

  class CyberCallApplicationV1 extends Application {
    callData: any;

    constructor(callData: any, options: any = {}) {
      super(options);
      this.callData = normalizeCallData(callData);
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-overlay",
        title: "CyberCall",
        template: templatePath,
        classes: ["cybercall-app"],
        popOut: true,
        resizable: true,
        width: 440,
        height: 420
      });
    }

    getData() {
      return {
        call: this.callData
      };
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Template render failed, using inline fallback.`, error);
        return $(renderFallbackTemplate(this.callData, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindCallControls(this, html);
    }

    async close(options: any) {
      clearActiveCall(this);
      stopRinging();
      return super.close(options);
    }
  }

  class CyberCallComposerV1 extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: composerTemplatePath,
        classes: ["cybercall-composer-app"],
        popOut: true,
        resizable: true,
        width: 560,
        height: 560
      });
    }

    getData() {
      return {
        call: getDefaultComposerData(),
        actors: getActorChoices(),
        players: getPlayerChoices(),
        ringtoneChoices: getRingtoneChoices()
      };
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Composer template render failed, using inline fallback.`, error);
        return $(renderComposerFallbackTemplate(data, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindComposerControls(this, html);
    }

    async close(options: any) {
      clearActiveComposer(this);
      return super.close(options);
    }
  }

  class CyberCallContactsV1 extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: contactsTemplatePath,
        classes: ["cybercall-contacts-app"],
        popOut: true,
        resizable: true,
        width: 500,
        height: 620
      });
    }

    getData() {
      const contacts = getContacts();
      const groupContacts = getGroupContacts();
      const activeContactsTab = getActiveContactsTab();
      return {
        contacts,
        groupContacts,
        hasContacts: contacts.length > 0,
        hasGroupContacts: groupContacts.length > 0,
        activeTab: activeContactsTab,
        isPersonalTab: activeContactsTab !== "group",
        isGroupTab: activeContactsTab === "group",
        canEditContactImages: canEditContactImages(),
        ringtoneChoices: getRingtoneChoices(),
        currentRingtone: getSoundPath()
      };
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Contacts template render failed, using inline fallback.`, error);
        return $(renderContactsFallbackTemplate(data, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindContactsControls(this, html);
    }

    async close(options: any) {
      clearActiveContacts(this);
      return super.close(options);
    }
  }

  function createApplicationV2Class() {
    if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CyberCallApplicationV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      callData: any;

      static DEFAULT_OPTIONS = {
        id: "cybercall-overlay",
        tag: "section",
        classes: ["cybercall-app"],
        window: {
          title: "CyberCall",
          resizable: true
        },
        position: {
          width: 440,
          height: 420
        }
      };

      static PARTS = {
        main: {
          template: templatePath
        }
      };

      constructor(callData: any, options: any = {}) {
        super(options);
        this.callData = normalizeCallData(callData);
      }

      async _prepareContext(options: any) {
        return {
          ...(await super._prepareContext(options)),
          call: this.callData
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Template render failed, using inline fallback.`, error);
          const wrapper = document.createElement("template");
          wrapper.innerHTML = renderFallbackTemplate(this.callData, escapeHTML).trim();
          return wrapper.content;
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindCallControls(this);
      }

      async close(options: any) {
        clearActiveCall(this);
        stopRinging();
        return super.close(options);
      }
    };
  }

  function createComposerV2Class() {
    if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CyberCallComposerV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      static DEFAULT_OPTIONS = {
        id: "cybercall-composer",
        tag: "section",
        classes: ["cybercall-composer-app"],
        window: {
          title: "CyberCall Composer",
          resizable: true
        },
        position: {
          width: 560,
          height: 560
        }
      };

      static PARTS = {
        main: {
          template: composerTemplatePath
        }
      };

      async _prepareContext(options: any) {
        return {
          ...(await super._prepareContext(options)),
          call: getDefaultComposerData(),
          actors: getActorChoices(),
          players: getPlayerChoices(),
          ringtoneChoices: getRingtoneChoices()
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Composer template render failed, using inline fallback.`, error);
          const wrapper = document.createElement("template");
          wrapper.innerHTML = renderComposerFallbackTemplate(context, escapeHTML).trim();
          return wrapper.content;
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindComposerControls(this);
      }

      async close(options: any) {
        clearActiveComposer(this);
        return super.close(options);
      }
    };
  }

  function createContactsV2Class() {
    if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CyberCallContactsV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      static DEFAULT_OPTIONS = {
        id: "cybercall-contacts",
        tag: "section",
        classes: ["cybercall-contacts-app"],
        window: {
          title: "CyberCall Contacts",
          resizable: true
        },
        position: {
          width: 500,
          height: 620
        }
      };

      static PARTS = {
        main: {
          template: contactsTemplatePath
        }
      };

      async _prepareContext(options: any) {
        const contacts = getContacts();
        const groupContacts = getGroupContacts();
        const activeContactsTab = getActiveContactsTab();
        return {
          ...(await super._prepareContext(options)),
          contacts,
          groupContacts,
          hasContacts: contacts.length > 0,
          hasGroupContacts: groupContacts.length > 0,
          activeTab: activeContactsTab,
          isPersonalTab: activeContactsTab !== "group",
          isGroupTab: activeContactsTab === "group",
          canEditContactImages: canEditContactImages(),
          ringtoneChoices: getRingtoneChoices(),
          currentRingtone: getSoundPath()
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Contacts template render failed, using inline fallback.`, error);
          const wrapper = document.createElement("template");
          wrapper.innerHTML = renderContactsFallbackTemplate(context, escapeHTML).trim();
          return wrapper.content;
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindContactsControls(this);
      }

      async close(options: any) {
        clearActiveContacts(this);
        return super.close(options);
      }
    };
  }

  return {
    CyberCallApplication: createApplicationV2Class() ?? CyberCallApplicationV1,
    CyberCallComposer: createComposerV2Class() ?? CyberCallComposerV1,
    CyberCallContacts: createContactsV2Class() ?? CyberCallContactsV1
  };
}
