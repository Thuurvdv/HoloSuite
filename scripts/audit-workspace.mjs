import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const modules = [
  "bounty-board",
  "csi-toolkit",
  "galaxy-map",
  "cybercall",
  "holosuite-core",
  "holosuite-critical-cutin",
  "holosuite-hacking",
  "security-cameras"
];

const allowedTsNocheckDebt = new Set();

const failures = [];
const warnings = [];
const VERIFIED_FOUNDRY_GENERATION = 14;

for (const moduleId of modules) {
  const moduleRoot = join(root, moduleId);
  const manifestPath = join(moduleRoot, "module.json");
  const packagePath = join(moduleRoot, "package.json");
  const tokenPath = join(moduleRoot, "styles", "holosuite-tokens.css");
  const srcPath = join(moduleRoot, "src", "main.ts");

  if (!existsSync(manifestPath)) {
    failures.push(`${moduleId}: missing module.json`);
    continue;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const esmodules = manifest.esmodules ?? [];
  const styles = manifest.styles ?? [];
  const verifiedGeneration = Number.parseInt(String(manifest.compatibility?.verified ?? ""), 10);

  if (!esmodules.includes("dist/main.js")) failures.push(`${moduleId}: manifest must load dist/main.js`);
  if (styles[0] !== "styles/holosuite-tokens.css") failures.push(`${moduleId}: shared tokens must be the first stylesheet`);
  if (verifiedGeneration < VERIFIED_FOUNDRY_GENERATION) {
    failures.push(`${moduleId}: manifest compatibility.verified must target Foundry VTT v${VERIFIED_FOUNDRY_GENERATION}`);
  }
  if (!existsSync(tokenPath)) failures.push(`${moduleId}: missing synced holosuite-tokens.css`);
  if (!existsSync(packagePath)) failures.push(`${moduleId}: missing package.json`);

  if (existsSync(srcPath) && readFileSync(srcPath, "utf8").startsWith("// @ts-nocheck")) {
    const message = `${moduleId}: src/main.ts still uses @ts-nocheck`;
    if (allowedTsNocheckDebt.has(moduleId)) warnings.push(`${message} (tracked debt)`);
    else failures.push(message);
  }
}

if (warnings.length) {
  console.log("Workspace audit tracked debt:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length) {
  console.error("Workspace audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Workspace audit passed.");
