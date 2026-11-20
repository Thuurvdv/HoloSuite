import { MODULE_ID } from "./constants";

export function getPhoneNumberFormat() {
  return String(game.settings.get(MODULE_ID, "phoneNumberFormat") ?? "").trim();
}

type MaskToken = { literal?: string; pattern?: RegExp };

function parseMask(format: string): MaskToken[] | null {
  if (format.length > 64 || /[^\x20-\x7e]/.test(format)) return null;
  const tokens: MaskToken[] = [];
  const literal = (text: string) => {
    const last = tokens[tokens.length - 1];
    if (last?.literal !== undefined) last.literal += text;
    else tokens.push({ literal: text });
  };
  for (let index = 0; index < format.length; index++) {
    const character = format[index];
    if (character === "\\") {
      if (++index === format.length) return null;
      literal(format[index]);
    } else if (character === "#") tokens.push({ pattern: /[0-9]/ });
    else if (character === "A") tokens.push({ pattern: /[A-Za-z]/ });
    else if (character === "*") tokens.push({ pattern: /[A-Za-z0-9]/ });
    else literal(character);
  }
  return tokens;
}

export function isValidPhoneNumberFormat(format: string) {
  if (!format) return true;
  const tokens = parseMask(format);
  const slots = tokens?.filter((token) => token.pattern).length ?? 0;
  return tokens !== null && slots > 0 && slots <= 32;
}

export function formatPhoneNumber(value: string, format: string) {
  if (!format) return value;
  const tokens = parseMask(format);
  if (!tokens) return value;
  let result = "", pending = "", index = 0, filled = 0;
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex];
    if (token.literal !== undefined) {
      pending += token.literal;
      const slotsAhead = tokens.slice(tokenIndex + 1).some((entry) => entry.pattern);
      if (value.startsWith(token.literal, index) && (!slotsAhead || value.length - index > token.literal.length)) index += token.literal.length;
      continue;
    }
    while (index < value.length && !token.pattern!.test(value[index])) index++;
    if (index >= value.length) break;
    result += pending + value[index++];
    pending = "";
    filled++;
  }
  // Preserve closing punctuation only once all placeholders are filled.
  if (filled && filled === tokens.filter((token) => token.pattern).length) result += pending;
  return filled ? result : "";
}

export function matchesPhoneNumberFormat(value: string, format: string) {
  if (!format) return true;
  const tokens = parseMask(format);
  if (!tokens) return false;
  const pattern = tokens.map((token) => token.pattern?.source ?? token.literal!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("");
  return new RegExp(`^${pattern}$`).test(value);
}

export function bindPhoneNumberInputs(root: ParentNode) {
  root.querySelectorAll<HTMLInputElement>('[data-cybercall-contacts-form] input[name="number"]').forEach((input) => {
    const format = getPhoneNumberFormat();
    const tokens = parseMask(format);
    const acceptsLetters = tokens?.some((token) => token.pattern?.test("A"));
    input.type = acceptsLetters ? "text" : "tel";
    input.inputMode = acceptsLetters ? "text" : format ? "numeric" : "tel";
    input.placeholder = format || "Phone number";
    input.title = format ? `Format: ${format} (# = digit, A = letter, * = letter or digit)` : "Phone number";
    if (format) input.maxLength = tokens?.reduce((length, token) => length + (token.literal?.length ?? 1), 0) ?? format.length;
    else input.removeAttribute("maxlength");
    input.setCustomValidity("");
    if (input.dataset.cybercallNumberBound) return;
    input.dataset.cybercallNumberBound = "true";
    input.addEventListener("input", () => {
      const mask = getPhoneNumberFormat();
      if (mask) {
        const position = input.selectionStart ?? input.value.length;
        const beforeCaret = formatPhoneNumber(input.value.slice(0, position), mask);
        input.value = formatPhoneNumber(input.value, mask);
        const caret = Math.min(beforeCaret.length, input.value.length);
        input.setSelectionRange(caret, caret);
      }
      input.setCustomValidity("");
    });
  });
}
