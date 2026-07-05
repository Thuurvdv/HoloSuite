import {
  renderComposerFallbackTemplate,
  renderContactsFallbackTemplate,
  renderFallbackTemplate,
  renderMessagesFallbackTemplate
} from "./fallback-templates";
import { normalizeCallData } from "./call-model";
import { shouldUseApplicationV2 } from "../../shared/src/application-base";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const $: any;

function getLegacyApplicationBase(): any {
  const appv1 = (globalThis as any).foundry?.appv1?.api ?? foundry?.appv1?.api ?? null;
  const applications = (globalThis as any).foundry?.applications?.api ?? foundry?.applications?.api ?? null;
  return (globalThis as any).Application
    ?? appv1?.Application
    ?? applications?.ApplicationV1
    ?? (globalThis as any).FormApplication
    ?? appv1?.FormApplication
    ?? applications?.FormApplication
    ?? applications?.ApplicationV2;
}

export function createCyberCallAppClasses(deps: any) {
  const {
    moduleId,
    templatePath,
    composerTemplatePath,
    contactsTemplatePath,
    messagesTemplatePath,
    phoneTemplatePath,
    escapeHTML,
    getDefaultComposerData,
    getActorChoices,
    getPlayerChoices,
    getContacts,
    getGroupContacts,
    getMessageContext,
    getRingtoneChoices,
    getSoundPath,
    getActiveContactsTab,
    canEditContactImages,
    bindCallControls,
    bindComposerControls,
    bindContactsControls,
    bindMessagesControls,
    stopRinging,
    clearActiveCall,
    clearActiveComposer,
    clearActiveContacts,
    clearActiveMessages,
    clearActivePhone
  } = deps;

  const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry?.applications?.api?.HandlebarsApplicationMixin;
  const LegacyApplication = getLegacyApplicationBase();
  const useApplicationV2 = shouldUseApplicationV2();

  function getContactsContext() {
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
      canManageNpcContacts: canEditContactImages(),
      actors: getActorChoices(),
      unreadMessageCount: getMessageContext().unreadCount,
      hasUnreadMessages: getMessageContext().unreadCount > 0,
      ringtoneChoices: getRingtoneChoices(),
      currentRingtone: getSoundPath()
    };
  }

  function getComposerContext() {
    return {
      call: getDefaultComposerData(),
      actors: getActorChoices(),
      players: getPlayerChoices(),
      ringtoneChoices: getRingtoneChoices()
    };
  }

  function getPhoneContext(mode: string, contact: any = null) {
    const isMessagesMode = mode === "messages";
    const isComposerMode = !isMessagesMode && game.user?.isGM;
    const isContactsMode = !isMessagesMode && !game.user?.isGM;
    const data = isMessagesMode ? getMessageContext(contact) : isComposerMode ? getComposerContext() : getContactsContext();
    return {
      ...data,
      mode,
      isMessagesMode,
      isComposerMode,
      isContactsMode,
      isCallsMode: !isMessagesMode
    };
  }

  function renderPhoneFallback(mode: string, data: any) {
    if (mode === "messages") return renderMessagesFallbackTemplate(data, escapeHTML);
    if (game.user?.isGM) return renderComposerFallbackTemplate(data, escapeHTML);
    return renderContactsFallbackTemplate(data, escapeHTML);
  }

  function renderFallbackPart(html: string) {
    const wrapper = document.createElement("template");
    wrapper.innerHTML = html.trim();
    const element = wrapper.content.firstElementChild;
    return {
      main: element instanceof HTMLElement ? element : document.createElement("div")
    };
  }

  function bindPhoneControls(app: any, html: any = null) {
    if (app.mode === "messages") {
      bindMessagesControls(app, html);
      return;
    }
    if (game.user?.isGM) bindComposerControls(app, html);
    else bindContactsControls(app, html);
  }

  class CyberCallApplicationV1 extends LegacyApplication {
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
        height: 460
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

  class CyberCallComposerV1 extends LegacyApplication {
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

  class CyberCallContactsV1 extends LegacyApplication {
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
      return getContactsContext();
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

  class CyberCallPhoneV1 extends LegacyApplication {
    mode: string;
    contact: any;

    constructor(mode = "calls", contact: any = null, options: any = {}) {
      super(options);
      this.mode = mode;
      this.contact = contact;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: phoneTemplatePath,
        classes: ["cybercall-phone-app"],
        popOut: true,
        resizable: true,
        width: 720,
        height: 640
      });
    }

    getData() {
      return getPhoneContext(this.mode, this.contact);
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Phone template render failed, using inline fallback.`, error);
        return $(renderPhoneFallback(this.mode, data));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindPhoneControls(this, html);
    }

    async close(options: any) {
      clearActivePhone(this);
      return super.close(options);
    }
  }

  class CyberCallMessagesV1 extends LegacyApplication {
    contact: any;

    constructor(contact: any = null, options: any = {}) {
      super(options);
      this.contact = contact;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-messages",
        title: "CyberCall Messages",
        template: messagesTemplatePath,
        classes: ["cybercall-messages-app"],
        popOut: true,
        resizable: true,
        width: 720,
        height: 640
      });
    }

    getData() {
      return getMessageContext(this.contact);
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Messages template render failed, using inline fallback.`, error);
        return $(renderMessagesFallbackTemplate(data, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindMessagesControls(this, html);
    }

    async close(options: any) {
      clearActiveMessages(this);
      return super.close(options);
    }
  }

  function createApplicationV2Class() {
    if (!useApplicationV2 || !ApplicationV2 || !HandlebarsApplicationMixin) return null;

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
          height: 460
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
          return renderFallbackPart(renderFallbackTemplate(this.callData, escapeHTML));
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
    if (!useApplicationV2 || !ApplicationV2 || !HandlebarsApplicationMixin) return null;

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
          return renderFallbackPart(renderComposerFallbackTemplate(context, escapeHTML));
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
    if (!useApplicationV2 || !ApplicationV2 || !HandlebarsApplicationMixin) return null;

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
        return {
          ...(await super._prepareContext(options)),
          ...getContactsContext()
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Contacts template render failed, using inline fallback.`, error);
          return renderFallbackPart(renderContactsFallbackTemplate(context, escapeHTML));
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

  function createPhoneV2Class() {
    if (!useApplicationV2 || !ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CyberCallPhoneV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      mode: string;
      contact: any;

      static DEFAULT_OPTIONS = {
        id: "cybercall-phone",
        tag: "section",
        classes: ["cybercall-phone-app"],
        window: {
          title: "CyberCall",
          resizable: true
        },
        position: {
          width: 720,
          height: 640
        }
      };

      static PARTS = {
        main: {
          template: phoneTemplatePath
        }
      };

      constructor(mode = "calls", contact: any = null, options: any = {}) {
        super(options);
        this.mode = mode;
        this.contact = contact;
      }

      async _prepareContext(options: any) {
        return {
          ...(await super._prepareContext(options)),
          ...getPhoneContext(this.mode, this.contact)
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Phone template render failed, using inline fallback.`, error);
          return renderFallbackPart(renderPhoneFallback(this.mode, context));
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindPhoneControls(this);
      }

      async close(options: any) {
        clearActivePhone(this);
        return super.close(options);
      }
    };
  }

  function createMessagesV2Class() {
    if (!useApplicationV2 || !ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CyberCallMessagesV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      contact: any;

      static DEFAULT_OPTIONS = {
        id: "cybercall-messages",
        tag: "section",
        classes: ["cybercall-messages-app"],
        window: {
          title: "CyberCall Messages",
          resizable: true
        },
        position: {
          width: 720,
          height: 640
        }
      };

      static PARTS = {
        main: {
          template: messagesTemplatePath
        }
      };

      constructor(contact: any = null, options: any = {}) {
        super(options);
        this.contact = contact;
      }

      async _prepareContext(options: any) {
        return {
          ...(await super._prepareContext(options)),
          ...getMessageContext(this.contact)
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Messages template render failed, using inline fallback.`, error);
          return renderFallbackPart(renderMessagesFallbackTemplate(context, escapeHTML));
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindMessagesControls(this);
      }

      async close(options: any) {
        clearActiveMessages(this);
        return super.close(options);
      }
    };
  }

  return {
    CyberCallApplication: createApplicationV2Class() ?? CyberCallApplicationV1,
    CyberCallComposer: createComposerV2Class() ?? CyberCallComposerV1,
    CyberCallContacts: createContactsV2Class() ?? CyberCallContactsV1,
    CyberCallMessages: createMessagesV2Class() ?? CyberCallMessagesV1,
    CyberCallPhone: createPhoneV2Class() ?? CyberCallPhoneV1
  };
}
