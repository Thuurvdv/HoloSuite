import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "shared", "styles", "holosuite-tokens.css");
const modules = [
  "bounty-board",
  "csi-toolkit",
  "galaxy-map",
  "holocall",
  "holosuite-core",
  "holosuite-critical-cutin",
  "holosuite-hacking",
  "pulse-scanner",
  "security-cameras"
];

for (const moduleId of modules) {
  const target = join(root, moduleId, "styles", "holosuite-tokens.css");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}
