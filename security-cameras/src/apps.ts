import {
  renderFallbackFeed,
  renderFallbackMonitor
} from "./fallback-templates";

declare const foundry: any;
declare const Application: any;
declare const $: any;

export function createSecurityCameraAppClasses(deps: any) {
  const {
    moduleId,
    monitorTemplatePath,
    feedTemplatePath,
    escapeHTML,
    getMonitorContext,
    prepareCamera,
    bindMonitorControls,
    bindFeedControls,
    getElement,
    liveFrameController,
    clearActiveMonitor,
    clearActiveFeed
  } = deps;

  const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry?.applications?.api?.HandlebarsApplicationMixin;

  function isObjectUrl(value: string) {
    return typeof value === "string" && value.startsWith("blob:");
  }

  function releaseLiveFrameUrl(app: any) {
    if (isObjectUrl(app?.liveFrameObjectUrl) && typeof URL !== "undefined") {
      URL.revokeObjectURL(app.liveFrameObjectUrl);
    }
    if (app) app.liveFrameObjectUrl = null;
  }

  function setLiveFrame(app: any, frame: string) {
    if (app.liveFrame === frame) return;
    releaseLiveFrameUrl(app);
    app.liveFrame = frame;
    app.liveFrameObjectUrl = isObjectUrl(frame) ? frame : null;
  }

  class SecurityMonitorV1 extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-monitor",
        title: "Security Camera Manager",
        template: monitorTemplatePath,
        classes: ["security-camera-window"],
        popOut: true,
        resizable: true,
        width: 1060,
        height: 760
      });
    }

    getData() {
      return getMonitorContext();
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Monitor template render failed, using inline fallback.`, error);
        return $(renderFallbackMonitor(data, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindMonitorControls(this, html);
    }

    async close(options: any) {
      clearActiveMonitor(this);
      return super.close(options);
    }
  }

  class CameraFeedV1 extends Application {
    camera: any;
    liveFrame: string;
    liveFrameObjectUrl: string | null;
    liveFrameTimer: any;

    constructor(cameraData: any, options: any = {}) {
      super(options);
      this.camera = prepareCamera(cameraData);
      this.liveFrame = options.liveFrame ?? "";
      this.liveFrameObjectUrl = isObjectUrl(this.liveFrame) ? this.liveFrame : null;
      this.liveFrameTimer = null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-feed",
        title: "Camera Feed",
        template: feedTemplatePath,
        classes: ["security-camera-feed-window"],
        popOut: true,
        resizable: true,
        width: 720,
        height: 520
      });
    }

    getData() {
      this.camera = prepareCamera(this.camera);
      return {
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: Boolean(this.liveFrame)
        }
      };
    }

    async _renderInner(data: any) {
      try {
        return await super._renderInner(data);
      } catch (error) {
        console.warn(`${moduleId} | Feed template render failed, using inline fallback.`, error);
        return $(renderFallbackFeed({
          ...this.camera,
          liveFrame: this.liveFrame
        }, escapeHTML));
      }
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      bindFeedControls(this, html);
    }

    async updateLiveFrame(frame: string) {
      setLiveFrame(this, frame);
      const element = getElement(this);
      const image = element?.querySelector?.("[data-security-camera-live-frame]");
      const waiting = element?.querySelector?.("[data-security-camera-live-waiting]");

      if (image) {
        image.src = frame;
        image.hidden = false;
        if (waiting) waiting.hidden = true;
        return;
      }

      await this.render(true);
    }

    async close(options: any) {
      liveFrameController.stopLocalLiveRefresh(this);
      releaseLiveFrameUrl(this);
      clearActiveFeed(this);
      return super.close(options);
    }
  }

  function createSecurityMonitorV2Class() {
    if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class SecurityMonitorV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      static DEFAULT_OPTIONS = {
        id: "security-camera-monitor",
        tag: "section",
        classes: ["security-camera-window"],
        window: {
          title: "Security Camera Manager",
          resizable: true
        },
        position: {
          width: 1060,
          height: 760
        }
      };

      static PARTS = {
        main: {
          template: monitorTemplatePath
        }
      };

      async _prepareContext(options: any) {
        return {
          ...(await super._prepareContext(options)),
          ...getMonitorContext()
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Monitor template render failed, using inline fallback.`, error);
          const wrapper = document.createElement("template");
          wrapper.innerHTML = renderFallbackMonitor(context, escapeHTML).trim();
          return wrapper.content;
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindMonitorControls(this);
      }

      async close(options: any) {
        clearActiveMonitor(this);
        return super.close(options);
      }
    };
  }

  function createCameraFeedV2Class() {
    if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

    return class CameraFeedV2 extends HandlebarsApplicationMixin(ApplicationV2) {
      camera: any;
      liveFrame: string;
      liveFrameObjectUrl: string | null;
      liveFrameTimer: any;

      static DEFAULT_OPTIONS = {
        id: "security-camera-feed",
        tag: "section",
        classes: ["security-camera-feed-window"],
        window: {
          title: "Camera Feed",
          resizable: true
        },
        position: {
          width: 720,
          height: 520
        }
      };

      static PARTS = {
        main: {
          template: feedTemplatePath
        }
      };

      constructor(cameraData: any, options: any = {}) {
        super(options);
        this.camera = prepareCamera(cameraData);
        this.liveFrame = options.liveFrame ?? "";
        this.liveFrameObjectUrl = isObjectUrl(this.liveFrame) ? this.liveFrame : null;
        this.liveFrameTimer = null;
      }

      async _prepareContext(options: any) {
        this.camera = prepareCamera(this.camera);
        return {
          ...(await super._prepareContext(options)),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: Boolean(this.liveFrame)
          }
        };
      }

      async _renderHTML(context: any, options: any) {
        try {
          return await super._renderHTML(context, options);
        } catch (error) {
          console.warn(`${moduleId} | Feed template render failed, using inline fallback.`, error);
          const wrapper = document.createElement("template");
          wrapper.innerHTML = renderFallbackFeed({
            ...this.camera,
            liveFrame: this.liveFrame
          }, escapeHTML).trim();
          return wrapper.content;
        }
      }

      _onRender(context: any, options: any) {
        super._onRender?.(context, options);
        bindFeedControls(this);
      }

      async updateLiveFrame(frame: string) {
        setLiveFrame(this, frame);
        const element = getElement(this);
        const image = element?.querySelector?.("[data-security-camera-live-frame]");
        const waiting = element?.querySelector?.("[data-security-camera-live-waiting]");

        if (image) {
          image.src = frame;
          image.hidden = false;
          if (waiting) waiting.hidden = true;
          return;
        }

        await this.render(true);
      }

      async close(options: any) {
        liveFrameController.stopLocalLiveRefresh(this);
        releaseLiveFrameUrl(this);
        clearActiveFeed(this);
        return super.close(options);
      }
    };
  }

  return {
    SecurityMonitor: createSecurityMonitorV2Class() ?? SecurityMonitorV1,
    CameraFeed: createCameraFeedV2Class() ?? CameraFeedV1
  };
}
