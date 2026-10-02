import test from "node:test";
import assert from "node:assert/strict";

const opened = [];
globalThis.foundry = {
  applications: {
    apps: {
      FilePicker: class {
        constructor(options) { this.options = options; opened.push(this); }
        browse() {}
      }
    }
  }
};

const { bindFilePickerFields } = await import("../src/dom-utils.ts");

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
