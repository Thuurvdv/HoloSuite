import test from "node:test";
import assert from "node:assert/strict";

const opened = [];
globalThis.foundry = {
  applications: {
    apps: {
      FilePicker: {
        implementation: class {
          constructor(options) { this.options = options; opened.push(this); }
          browse() {}
        }
      }
    }
  }
};

const { bindFilePickerFields, getFilePickerClass } = await import("../src/dom-utils.ts");

function fakeField(value) {
  const input = { value, events: [], dispatchEvent(event) { this.events.push(event.type); } };
  const button = dataset => ({ dataset, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; } });
  const browse = button({ browseTarget: "markerImage" });
  const clear = button({ clearTarget: "markerImage" });
  const root = {
    querySelectorAll: selector => selector === "[data-browse-target]" ? [browse] : selector === "[data-clear-target]" ? [clear] : [],
    querySelector: selector => selector === '[name="markerImage"]' ? input : null
  };
  bindFilePickerFields(root);
  const click = target => target.listeners.click({ preventDefault() {} });
  return { input, browse, clear, click };
}

test("Browse opens an image picker on the current value and writes the chosen path back", () => {
  const { input, browse, click } = fakeField("icons/old.webp");
  click(browse);
  const picker = opened.at(-1);
  assert.equal(picker.options.type, "image");
  assert.equal(picker.options.current, "icons/old.webp");
  picker.options.callback("icons/new.webp");
  assert.equal(input.value, "icons/new.webp");
  assert.deepEqual(input.events, ["input", "change"]);
});

test("Clear empties the field and tells listeners it changed", () => {
  const { input, clear, click } = fakeField("icons/old.webp");
  click(clear);
  assert.equal(input.value, "");
  assert.deepEqual(input.events, ["input", "change"]);
});

test("v12 uses the configured implementation exposed by its FilePicker wrapper", () => {
  class ConfiguredFilePicker {}
  class LegacyFilePicker {}
  const scope = {
    foundry: { applications: { apps: { FilePicker: { implementation: ConfiguredFilePicker } } } },
    FilePicker: LegacyFilePicker
  };

  assert.equal(getFilePickerClass(scope), ConfiguredFilePicker);
});

test("legacy installations fall back to the global FilePicker", () => {
  class LegacyFilePicker {}
  const scope = {
    foundry: { applications: { apps: { FilePicker: {} } } },
    FilePicker: LegacyFilePicker
  };

  assert.equal(getFilePickerClass(scope), LegacyFilePicker);
});

test("the browse handler uses v12's bare FilePicker binding when it is absent from the namespace", () => {
  const originalFoundry = globalThis.foundry;
  const originalFilePicker = globalThis.FilePicker;
  class V12FilePicker {
    constructor(options) { this.options = options; opened.push(this); }
    browse() {}
  }

  try {
    globalThis.foundry = { applications: { apps: { FilePicker: {} } } };
    globalThis.FilePicker = V12FilePicker;
    const { browse, click } = fakeField("icons/v12.webp");
    click(browse);
    assert.equal(opened.at(-1).constructor, V12FilePicker);
  } finally {
    globalThis.foundry = originalFoundry;
    if (originalFilePicker === undefined) delete globalThis.FilePicker;
    else globalThis.FilePicker = originalFilePicker;
  }
});

test("v13 and v14 support the namespaced FilePicker constructor", () => {
  class NamespacedFilePicker {}
  class LegacyFilePicker {}
  const scope = {
    foundry: { applications: { apps: { FilePicker: NamespacedFilePicker } } },
    FilePicker: LegacyFilePicker
  };

  assert.equal(getFilePickerClass(scope), NamespacedFilePicker);
});
