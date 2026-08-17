import { MODULE_ID } from "./constants.js";

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function sourceFromStack(stack?: string | null): string {
  const text = String(stack ?? "");
  const moduleMatches = [...text.matchAll(/(?:^|[\\/])modules[\\/]([^\\/?#:\s)]+)/gim)];
  for (const match of moduleMatches) {
    const id = decode(match[1]).toLowerCase();
    if (id && id !== MODULE_ID) return id;
  }
  if (moduleMatches.length) return MODULE_ID;

  const systemMatch = text.match(/(?:^|[\\/])systems[\\/]([^\\/?#:\s)]+)/im);
  if (systemMatch) return `system:${decode(systemMatch[1]).toLowerCase()}`;

  if (/foundry(?:\.mjs|\.js)|client(?:\.mjs|\.js)/i.test(text)) return "foundry-core";
  return "unattributed";
}

export function sourceFromUrl(url?: string | null): string {
  const text = String(url ?? "");
  const moduleMatch = text.match(/(?:^|[\\/])modules[\\/]([^\\/?#:\s)]+)/i);
  if (moduleMatch) return decode(moduleMatch[1]).toLowerCase();
  const systemMatch = text.match(/(?:^|[\\/])systems[\\/]([^\\/?#:\s)]+)/i);
  if (systemMatch) return `system:${decode(systemMatch[1]).toLowerCase()}`;
  if (text) return "external-or-world";
  return "inline-or-core";
}

export function captureSource(): string {
  return sourceFromStack(new Error().stack);
}
