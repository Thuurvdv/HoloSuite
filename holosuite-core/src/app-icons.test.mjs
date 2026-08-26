import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetUrl = new URL("../styles/holosuite-core.css", import.meta.url);
const vendingIconUrl = new URL("../assets/device-styles/space-police/icons/holosuite-vending-machines.svg", import.meta.url);

test("wires the Vending Machines SVG and purple accent into every launcher path", async () => {
  const [css, svg] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(vendingIconUrl, "utf8")
  ]);

  assert.match(svg, /viewBox="0 0 16\.933332 16\.933332"/);
  assert.match(css, /data-holosuite-app="holosuite-vending-machines"/);
  assert.match(css, /--hs-app-accent:\s*#d966ff/);
  assert.match(css, /mask-image:\s*url\("\.\.\/assets\/device-styles\/space-police\/icons\/holosuite-vending-machines\.svg"\)/);
  assert.match(css, /-webkit-mask-image:\s*url\("\.\.\/assets\/device-styles\/space-police\/icons\/holosuite-vending-machines\.svg"\)/);
  assert.match(css, /data-holosuite-foundry-generation="12"[^}]+data-holosuite-app-icon="holosuite-vending-machines"/s);
});
