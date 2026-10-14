import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetUrl = new URL("../styles/holosuite-core.css", import.meta.url);
const vendingIconUrl = new URL("../assets/device-styles/space-police/icons/holosuite-vending-machines.svg", import.meta.url);
const sourceUrl = new URL("main.ts", import.meta.url);
const bundleUrl = new URL("../dist/main.js", import.meta.url);

test("launcher tiles omit the repeated HoloSuite prefix", async () => {
  const [source, bundle] = await Promise.all([
    readFile(sourceUrl, "utf8"),
    readFile(bundleUrl, "utf8")
  ]);
  assert.match(source, /replace\(\/\^HoloSuite\\s\*:\?\\s\*\/i, ""\)/);
  assert.match(source, /const title = appDisplayTitle\(app\.title\)/);
  assert.match(bundle, /replace\(\/\^HoloSuite\\s\*:\?\\s\*\/i,\s*""\)/);
});

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

test("wires the Blueprint SVG and its deep blue accent into every launcher path", async () => {
  const blueprintIconUrl = new URL("../assets/device-styles/space-police/icons/holosuite-blueprint.svg", import.meta.url);
  const [css, svg] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(blueprintIconUrl, "utf8")
  ]);

  // The mask only reads alpha, so the artwork has to be opaque and self-contained.
  assert.match(svg, /<svg/);
  assert.match(svg, /fill:#000000/);
  assert.doesNotMatch(svg, /xlink:href|<image/, "a mask cannot resolve an external reference");

  const url = 'url("../assets/device-styles/space-police/icons/holosuite-blueprint.svg")';
  // Default launcher, Space Police device style, and the v12 fallback path all need it.
  assert.match(css, /\.holosuite-app-tile\[data-holosuite-app="holosuite-blueprint"\]/);
  assert.match(css, /--hs-app-accent:\s*#2a46b8/);
  assert.match(css, /--hs-app-accent-rgb:\s*42, 70, 184/);
  assert.equal(css.split(url).length - 1, 8, "every mask path needs the icon, prefixed and unprefixed");
  assert.match(css, /data-holosuite-device-style="space-police"\] \.holosuite-app-icon\[data-holosuite-app-icon="holosuite-blueprint"\]/);
  assert.match(css, /data-holosuite-foundry-generation="12"[^}]+data-holosuite-app-icon="holosuite-blueprint"/s);

  // The id has to match what the Blueprint module registers with Core, or nothing binds.
  assert.match(css, /data-holosuite-app="holosuite-blueprint"/);
});

test("wires the Galactic Records SVG and blue accent into every launcher path", async () => {
  const iconUrl = new URL("../assets/device-styles/space-police/icons/galactic-records.svg", import.meta.url);
  const [css, svg] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(iconUrl, "utf8")
  ]);

  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(css, /\.holosuite-app-tile\[data-holosuite-app="holosuite-galactic-records"\]/);
  assert.match(css, /--hs-app-accent:\s*#046bdf/);
  assert.match(css, /--hs-app-accent-rgb:\s*4, 107, 223/);
  assert.match(css, /data-holosuite-app-icon="holosuite-galactic-records"[^}]+galactic-records\.svg/s);
  assert.match(css, /data-holosuite-foundry-generation="12"[^}]+data-holosuite-app-icon="holosuite-galactic-records"/s);
});
