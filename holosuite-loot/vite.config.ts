import { defineConfig } from "vite";
import { copyFileSync, readFileSync } from "node:fs";
const version = JSON.parse(readFileSync(new URL("./module.json", import.meta.url), "utf8")).version;
export default defineConfig({ plugins: [{ name: "legacy-bundle-path", closeBundle() {
  copyFileSync(new URL(`./dist/main-${version}.js`, import.meta.url), new URL("./dist/main.js", import.meta.url));
} }], build: { emptyOutDir: true, lib: {
  entry: "src/main.ts", formats: ["es"], fileName: () => `main-${version}.js`
}, rollupOptions: { output: { inlineDynamicImports: true } } } });
