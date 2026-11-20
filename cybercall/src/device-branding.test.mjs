import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";
const source = buildSync({ entryPoints: [fileURLToPath(new URL("./device-branding.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const { resolveDeviceEmblem, normalizeEmblemImage } = await import(`data:text/javascript;base64,${Buffer.from(source + "\n//# sourceURL=device-branding-test.mjs").toString("base64")}`);

test("released Core without branding, and incompatible branding APIs, keep CyberCall's configured emblem", () => {
  assert.deepEqual(resolveDeviceEmblem(undefined, "assets/logo.svg"), { image: "assets/logo.svg", icon: "" });
  assert.deepEqual(resolveDeviceEmblem({}, "assets/logo.png"), { image: "assets/logo.png", icon: "" });
  assert.deepEqual(resolveDeviceEmblem({ getBranding: () => { throw Error("Unavailable API"); } }, "assets/logo.webp"), { image: "assets/logo.webp", icon: "" });
  assert.deepEqual(resolveDeviceEmblem({}, ""), { image: "", icon: "" });
});
test("Core app artwork takes priority over device branding and the compatible local setting", () => {
  const core = { getBranding: (id) => id === "cybercall" ? { iconImage: "app.png" } : { logo: "device.webp" } };
  assert.equal(resolveDeviceEmblem(core, "local.svg").image, "app.png");
  core.getBranding = (id) => id === "holosuite-core" ? { logo: "device.webp" } : {};
  assert.equal(resolveDeviceEmblem(core, "local.svg").image, "device.webp");
  core.getBranding = () => ({ icon: "fa-cube" });
  assert.equal(resolveDeviceEmblem(core, "").icon, "fa-cube");
});
test("emblem image paths reject scripts and unsafe URLs while accepting image assets", () => {
  for (const path of ["javascript:alert(1)", "data:image/svg+xml,test", "//remote/logo.png", "file:///logo.svg", "https://user:pass@example.com/logo.png", "logo.html", "bad\nname.svg"]) assert.equal(normalizeEmblemImage(path), "");
  assert.equal(normalizeEmblemImage("assets/Custom emblem.svg"), "assets/Custom emblem.svg");
  assert.equal(normalizeEmblemImage("https://example.com/logo.png?v=2"), "https://example.com/logo.png?v=2");
});
