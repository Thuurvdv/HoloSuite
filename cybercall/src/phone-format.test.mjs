import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ entryPoints: [fileURLToPath(new URL("./phone-format.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const { formatPhoneNumber, matchesPhoneNumberFormat, isValidPhoneNumberFormat, bindPhoneNumberInputs } = await import(`data:text/javascript;base64,${Buffer.from(source + "\n//# sourceURL=phone-format-test.mjs").toString("base64")}`);

test("phone masks insert separators and preserve partial input without adding digits", () => {
  assert.equal(formatPhoneNumber("1234567890", "###-###-####"), "123-456-7890");
  assert.equal(formatPhoneNumber("1234", "###-###-####"), "123-4");
  assert.equal(formatPhoneNumber("", "(###) ###"), "");
  assert.equal(formatPhoneNumber("1234567", "+## (###) ##"), "+12 (345) 67");
  assert.equal(formatPhoneNumber("123", "(###)"), "(123)");
  assert.equal(formatPhoneNumber("FED-071", ""), "FED-071");
  assert.equal(formatPhoneNumber("1234567", "###-###"), "123-456");
});

test("phone validation requires the complete mask and treats punctuation literally", () => {
  assert.equal(matchesPhoneNumberFormat("+12 (345) 67", "+## (###) ##"), true);
  assert.equal(matchesPhoneNumberFormat("123-4", "###-###"), false);
  assert.equal(matchesPhoneNumberFormat("123x456", "###.###"), false);
  assert.equal(matchesPhoneNumberFormat("123.456", "###.###"), true);
  assert.equal(matchesPhoneNumberFormat("FED-071", ""), true);
  assert.equal(isValidPhoneNumberFormat(""), true);
  assert.equal(isValidPhoneNumberFormat("+## (###) ###-####"), true);
  for (const mask of ["(a+)+", "FED", "123-456", "#".repeat(33), "AAA\\"]) assert.equal(isValidPhoneNumberFormat(mask), false);
});

test("letter and alphanumeric placeholders preserve case and reject the wrong character types", () => {
  assert.equal(isValidPhoneNumberFormat("AAA-####"), true);
  assert.equal(isValidPhoneNumberFormat("***-###"), true);
  assert.equal(isValidPhoneNumberFormat("AAA"), true);
  assert.equal(formatPhoneNumber("FED0071", "AAA-####"), "FED-0071");
  assert.equal(formatPhoneNumber("fed-0071", "AAA-####"), "fed-0071");
  assert.equal(formatPhoneNumber("A7B123", "***-###"), "A7B-123");
  assert.equal(formatPhoneNumber("FE", "AAA-####"), "FE");
  assert.equal(matchesPhoneNumberFormat("FED-0071", "AAA-####"), true);
  assert.equal(matchesPhoneNumberFormat("F3D-0071", "AAA-####"), false);
  assert.equal(matchesPhoneNumberFormat("FED-00A1", "AAA-####"), false);
  assert.equal(matchesPhoneNumberFormat("A7B-123", "***-###"), true);
  assert.equal(matchesPhoneNumberFormat("A_B-123", "***-###"), false);
  assert.equal(matchesPhoneNumberFormat("abC", "AAA"), true);
  assert.equal(isValidPhoneNumberFormat("A".repeat(33)), false);
});

test("fixed prefixes and escaped placeholders format raw and already formatted values", () => {
  assert.equal(formatPhoneNumber("123", "FED-###"), "FED-123");
  assert.equal(formatPhoneNumber("FED-123", "FED-###"), "FED-123");
  assert.equal(formatPhoneNumber("1", "123-###"), "123-1");
  assert.equal(formatPhoneNumber("123-123", "123-###"), "123-123");
  assert.equal(formatPhoneNumber("3", "+31 (###)"), "+31 (3");
  assert.equal(formatPhoneNumber("+31 (345)", "+31 (###)"), "+31 (345)");
  assert.equal(formatPhoneNumber("11", "#1#"), "111");
  assert.equal(formatPhoneNumber("123", "\\A-###"), "A-123");
  assert.equal(matchesPhoneNumberFormat("A-123", "\\A-###"), true);
  assert.equal(matchesPhoneNumberFormat("B-123", "\\A-###"), false);
  assert.equal(matchesPhoneNumberFormat("#*A-123", "\\#\\*\\A-###"), true);
  assert.equal(matchesPhoneNumberFormat("[123].", "[###]."), true);
  assert.equal(matchesPhoneNumberFormat("123x", "[###]."), false);
});

test("contact inputs use text keyboards for letters and retain the caret across formatting and mask changes", () => {
  let mask = "***-###";
  globalThis.game = { settings: { get: () => mask } };
  const listeners = [];
  const input = {
    dataset: {}, value: "Ab7123", selectionStart: 6,
    setCustomValidity() {}, removeAttribute(name) { delete this[name]; },
    addEventListener(name, listener) { listeners.push(listener); },
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
  };
  const root = { querySelectorAll: () => [input] };
  bindPhoneNumberInputs(root);
  assert.equal(input.type, "text");
  assert.equal(input.inputMode, "text");
  listeners[0]();
  assert.equal(input.value, "Ab7-123");
  assert.equal(input.selectionStart, 7);

  input.value = "Ab7-4123";input.selectionStart = 5;listeners[0]();
  assert.equal(input.value, "Ab7-412");
  assert.equal(input.selectionStart, 5);

  mask = "\\A-###";bindPhoneNumberInputs(root);
  assert.equal(input.inputMode, "numeric");
  assert.equal(input.maxLength, 5);
  assert.equal(listeners.length, 1);
  input.value = "123";input.selectionStart = 3;listeners[0]();
  assert.equal(input.value, "A-123");
  assert.equal(input.selectionStart, 5);
});
