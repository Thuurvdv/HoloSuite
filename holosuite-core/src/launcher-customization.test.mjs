import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("./main.ts", import.meta.url);
const stylesheetUrl = new URL("../styles/holosuite-core.css", import.meta.url);
const redFrameUrl = new URL("../assets/device-styles/red/frame-9slice.svg", import.meta.url);
const corporateFrameUrl = new URL("../assets/device-styles/corporate/frame-9slice.svg", import.meta.url);
const whatsNewUrl = new URL("../data/whats-new.json", import.meta.url);

test("keeps unfinished themes and form factors hidden for this release", async () => {
  const [source, css] = await Promise.all([
    readFile(sourceUrl, "utf8"),
    readFile(stylesheetUrl, "utf8")
  ]);

  assert.match(source, /red:\s*"RED"/);
  assert.match(source, /phone:\s*"Phone"/);
  assert.match(source, /datapad:\s*"Datapad"/);
  assert.match(source, /computer:\s*"Computer"/);
  assert.match(source, /corporate:\s*"Corporate"/);
  assert.match(source, /const RELEASED_DEVICE_STYLE_CHOICES = \{[\s\S]*?base:[\s\S]*?"space-police"[\s\S]*?\} as const/);
  assert.match(source, /SETTING_DEVICE_STYLE[\s\S]*?choices:\s*RELEASED_DEVICE_STYLE_CHOICES/);
  assert.match(source, /SETTING_FORCE_DEVICE_STYLE[\s\S]*?choices:\s*RELEASED_FORCED_DEVICE_STYLE_CHOICES/);
  assert.match(source, /SETTING_FORM_FACTOR[\s\S]*?config:\s*false/);
  assert.match(source, /function normalizeFormFactor\(value: unknown\)[\s\S]*?return "phone"/);
  assert.doesNotMatch(source, /const formFactorOptions =/);
  assert.match(css, /data-holosuite-device-style="red"/);
  assert.match(css, /--hs-cyan:\s*#ff304f/);
  assert.match(css, /--hs-bg-deep:\s*#050103/);
  assert.match(css, /data-holosuite-form-factor="datapad"/);
  assert.match(css, /data-holosuite-form-factor="computer"/);
  assert.match(css, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /repeat\(4, minmax\(0, 1fr\)\)/);
});

test("supports long-press app ordering with client persistence", async () => {
  const [source, css] = await Promise.all([
    readFile(sourceUrl, "utf8"),
    readFile(stylesheetUrl, "utf8")
  ]);

  assert.match(source, /const SETTING_APP_ORDER = "appOrder"/);
  assert.match(source, /scope:\s*"client"[\s\S]*?type:\s*Array[\s\S]*?default:\s*\[\]/);
  assert.match(source, /setTimeout\(\(\) => beginDragging\(event\.pointerId\), 550\)/);
  assert.match(source, /game\.settings\.set\(MODULE_ID, SETTING_APP_ORDER, order\)/);
  assert.match(source, /placeholder\.className = "holosuite-app-placeholder"/);
  assert.match(source, /tile\.style\.left = `\$\{event\.clientX - dragOffsetX\}px`/);
  assert.match(source, /const REORDER_SLOT_HYSTERESIS_PX = 12/);
  assert.match(source, /reorderSlots = tiles\.map\(\(candidate\) => candidate\.getBoundingClientRect\(\)\)/);
  assert.match(source, /closestDistance \+ REORDER_SLOT_HYSTERESIS_PX >= currentDistance/);
  assert.match(source, /grid\.insertBefore\(placeholder, before\)/);
  assert.doesNotMatch(source, /document\.elementFromPoint\(event\.clientX, event\.clientY\)/);
  assert.match(css, /\.is-reordering-apps \.holosuite-app-tile/);
  assert.match(css, /\.holosuite-app-placeholder/);
  assert.match(css, /@keyframes holosuite-app-wiggle/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("uses a scalable nine-slice frame only for RED", async () => {
  const [css, frame] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(redFrameUrl, "utf8")
  ]);

  assert.match(frame, /viewBox="0 0 300 300"/);
  assert.match(frame, /72-unit guides are the CSS border-image slice boundaries/);
  assert.match(css, /data-holosuite-device-style="red"[^}]+border-image-source:\s*url\("\.\.\/assets\/device-styles\/red\/frame-9slice\.svg"\)/s);
  assert.match(css, /border-image-slice:\s*72 fill/);
  assert.match(css, /border-image-width:\s*42px/);
  assert.doesNotMatch(css, /data-holosuite-device-style="space-police"[^}]+frame-9slice/s);
});

test("colors launcher scrollbars from each visual theme", async () => {
  const css = await readFile(stylesheetUrl, "utf8");

  assert.match(css, /--hs-scrollbar-thumb:\s*var\(--hs-cyan\)/);
  assert.match(css, /data-holosuite-device-style="space-police"[^}]+--hs-scrollbar-thumb:\s*#fff15a/s);
  assert.match(css, /data-holosuite-device-style="red"[^}]+--hs-scrollbar-thumb:\s*#ff304f/s);
  assert.match(css, /data-holosuite-device-style="corporate"[^}]+--hs-scrollbar-thumb:\s*#087b8b/s);
  assert.match(css, /scrollbar-color:\s*var\(--hs-scrollbar-thumb\) var\(--hs-scrollbar-track\)/);
  assert.match(css, /::-webkit-scrollbar-thumb\s*{/);
  assert.match(css, /::-webkit-scrollbar-thumb:hover\s*{/);
});

test("gives Corporate an independent scalable frame and light palette", async () => {
  const [css, frame] = await Promise.all([
    readFile(stylesheetUrl, "utf8"),
    readFile(corporateFrameUrl, "utf8")
  ]);

  assert.match(frame, /viewBox="0 0 300 300"/);
  assert.match(css, /data-holosuite-device-style="corporate"[^}]+--hs-bg:\s*#eef2f3/s);
  assert.match(css, /data-holosuite-device-style="corporate"[^}]+color-scheme:\s*light/s);
  assert.match(css, /border-image-source:\s*url\("\.\.\/assets\/device-styles\/corporate\/frame-9slice\.svg"\)/);
  assert.match(css, /\.holosuite-theme-preview--corporate/);
});

test("styles RED launcher controls as compact raised panels with readable labels", async () => {
  const css = await readFile(stylesheetUrl, "utf8");

  assert.match(css, /data-holosuite-device-style="red"[\s\S]*\.holosuite-app-tile[\s\S]*min-height:\s*82px\s*!important/);
  assert.match(css, /\.holosuite-app-icon\s*\{[\s\S]*color:\s*var\(--hs-app-accent\)\s*!important/);
  assert.match(css, /\.holosuite-header-action\s*>\s*i[\s\S]*color:\s*#090507\s*!important/);
  assert.match(css, /holosuite-whats-new-tabs, \.holosuite-whats-new-filters[\s\S]*color:\s*#090507\s*!important/);
  assert.match(css, /\.holosuite-theme-choice,[\s\S]*\.holosuite-form-factor-choice[\s\S]*clip-path:\s*polygon/);
  assert.match(css, /border:\s*1px solid rgba\(255, 48, 79, 0\.96\)\s*!important/);
  assert.match(css, /0 4px 0 rgba\(91, 4, 24, 0\.94\)/);
  assert.match(css, /button\[data-holosuite-action="close"\]\s*\{[^}]*background:\s*transparent\s*!important;[^}]*border-color:\s*transparent\s*!important;[^}]*box-shadow:\s*none\s*!important;[^}]*color:\s*#ff304f\s*!important/s);
  assert.match(css, /button\[data-holosuite-action="close"\] i\s*\{[^}]*drop-shadow\(0 0 3px rgba\(255, 48, 79, 0\.95\)\)/s);
});

test("keeps What's New conversational and limits badges to Foundry compatibility", async () => {
  const [source, catalogText] = await Promise.all([
    readFile(sourceUrl, "utf8"),
    readFile(whatsNewUrl, "utf8")
  ]);
  const catalog = JSON.parse(catalogText);
  const galaxyMap = catalog.modules.find((entry) => entry.moduleId === "galaxy-map");
  const tags = [...catalog.modules, ...catalog.releases]
    .flatMap((entry) => entry.entries)
    .flatMap((entry) => entry.tags ?? []);

  assert.equal(galaxyMap.version, "2.0.0");
  assert.match(galaxyMap.entries[0].title, /Galaxy Map 2\.0/);
  assert.ok(tags.length > 0);
  assert.ok(tags.every((tag) => tag === "Foundry v12-v14"));
  assert.match(source, /hasFoundryCompatibilityTag[\s\S]*\["Foundry v12–14"\]/);
  assert.doesNotMatch(source, /escapeHtml\(tierLabel\)/);
  assert.doesNotMatch(source, /installed \? "Installed" : "Not installed"/);
});
