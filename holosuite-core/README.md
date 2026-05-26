# HoloSuite Core

Free Foundry VTT module that provides the GM-only HoloSuite phone launcher and app registration API.

Feature modules register with:

```js
game.modules.get("holosuite-core")?.api?.registerApp({
  id: "example-module",
  title: "Example App",
  icon: "fa-solid fa-rocket",
  premium: false,
  open: () => game.modules.get("example-module").api.open()
});
```

See the repository root `README.md` for build, installation, and licensing notes.
