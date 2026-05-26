# HoloSuite

HoloSuite is a Foundry VTT sci-fi module suite built around a free core module:

- `holosuite-core` - GM-only in-world phone/tablet launcher and public registration API.
- `holocall` - holographic calls and broadcasts.
- `security-cameras` - camera feed manager and surveillance broadcast tools.
- `csi-toolkit` - case files, evidence boards, and investigation tooling.
- `galaxy-map` - cinematic star map and travel framework.
- `pulse-scanner` - scan pulses, hidden targets, and scene signatures.
- `shared` - TypeScript interfaces shared by suite packages.

## Local Development

Install dependencies from the repository root:

```bash
npm install
```

Each Foundry module keeps authoring code in `src/` and Foundry-loaded output in `dist/`.
The current refactor preserves the existing single-file module implementations while making `src/main.ts` the source of truth for future modularization.

## Build

Build every workspace:

```bash
npm run build
```

Or build one module:

```bash
npm run build -w @holosuite/core
npm run build -w @holosuite/holocall
```

Each module's `module.json` points Foundry at `dist/main.js`.

## Foundry Installation

During development, symlink or copy these module folders into Foundry's `Data/modules` directory:

```text
holosuite-core
holocall
security-cameras
csi-toolkit
galaxy-map
pulse-scanner
```

Enable `HoloSuite Core` first, then enable any feature modules you want. Feature modules still expose their legacy scene controls and APIs when the core module is not active.

## Registering Apps With HoloSuite Core

Feature modules register during `ready` by calling:

```js
game.modules.get("holosuite-core")?.api?.registerApp({
  id: "example-module",
  title: "Example App",
  icon: "fa-solid fa-rocket",
  premium: false,
  description: "Short launcher description.",
  open: () => game.modules.get("example-module").api.open()
});
```

Registered app fields:

- `id`: stable app id.
- `title`: launcher label.
- `icon`: Font Awesome class string.
- `premium`: whether the app should be gated by the license service.
- `featureId`: optional premium feature id; defaults to `id`.
- `description`: optional launcher text.
- `open`: callback invoked when the GM launches the app.

The core API is available at:

```js
game.modules.get("holosuite-core").api
game.holosuite
```

## License Model

`holosuite-core` stores a license key in a world setting and exposes:

```js
await game.holosuite.checkLicense();
game.holosuite.isFeatureAllowed("security-cameras");
```

The current checker is a local mock. It returns allowed premium feature ids from the `Mock Allowed Premium Features` setting, and treats license keys containing `supporter` or `valid` as allowing registered premium apps.

Foundry modules run client-side, so this is not secure DRM. Treat licensing as supporter validation plus download/update access control. Future premium enforcement should happen outside the client, for example:

- account-backed manifest/download endpoints,
- signed release downloads,
- private package access,
- optional supporter status checks that only affect convenience UI.

Do not put real secrets, private API keys, or irreversible entitlement logic in frontend module code.
