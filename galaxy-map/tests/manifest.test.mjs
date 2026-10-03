import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const url = path => new URL(`../${path}`, import.meta.url);
const read = path => fs.readFileSync(url(path), "utf8");
const manifest = JSON.parse(read("module.json"));

test("module.json and package.json carry the same version", () => {
  const packageVersion = JSON.parse(read("package.json")).version;
  const lockVersion = JSON.parse(read("../package-lock.json")).packages["galaxy-map"].version;
  assert.equal(manifest.version, packageVersion);
  assert.equal(manifest.version, lockVersion);
});

test("release metadata points to the HoloSuite repository and matching versioned archive", () => {
  assert.equal(manifest.url, "https://github.com/Thuurvdv/HoloSuite/tree/main/galaxy-map");
  assert.equal(manifest.manifest, "https://raw.githubusercontent.com/Thuurvdv/HoloSuite/main/galaxy-map/module.json");
  assert.equal(
    manifest.download,
    `https://github.com/Thuurvdv/HoloSuite/releases/download/galaxy-map-v${manifest.version}/galaxy-map.zip`
  );
  assert.equal(manifest.compatibility.minimum, "12");
  assert.equal(manifest.compatibility.verified, "14");
});

test("every stylesheet in the manifest exists, including its imports", () => {
  for (const style of manifest.styles) {
    assert.ok(fs.existsSync(url(style)), `${style} is missing`);
    for (const [, imported] of read(style).matchAll(/@import url\("\.\/([^"]+)"\)/g)) {
      assert.ok(fs.existsSync(url(`styles/${imported}`)), `${imported} is missing`);
    }
  }
});

test("every template main.ts preloads exists", () => {
  const templates = [...read("src/main.ts").matchAll(/\$\{TEMPLATE_ROOT\}\/([\w-]+\.hbs)/g)].map(match => match[1]);
  assert.ok(templates.length > 0);
  for (const template of templates) assert.ok(fs.existsSync(url(`templates/${template}`)), `${template} is missing`);
});
