# HoloSuite Core

HoloSuite Core gives GMs one launcher for opening the other HoloSuite modules.

## Installation

1. In Foundry's Setup screen, open **Add-on Modules → Install Module**, search for **HoloSuite Core**, and click **Install**.
2. Open your world as a GM. In **Manage Modules**, enable HoloSuite Core, then save and reload.
3. Install and enable the other HoloSuite modules you want to use.
4. Open HoloSuite from its button in the scene controls.

## Quick Start

1. Reload the world after changing modules so every app can register with Core.
2. Open HoloSuite from the scene-control button, the configured keybinding, the module settings menu, or a macro that calls `game.holosuite.openLauncher()`.
3. Choose **Apps** and select a tile. GMs see every registered app; players see only apps that allow player access.
4. Open **Settings** inside the launcher to choose HoloSuite, Space Police, or Cassette Futurism and select the Compact, Datapad, or Computer size.
5. Open **Foundry → Configure Settings → Module Settings → HoloSuite Core** and enable **Use Themed App Colors** to tint the app icons and buttons with the active theme. App colors are used by default. Uploaded branding images keep their own colors.
6. Use Foundry's module settings for world-wide themes, player access, and debugging options. When the GM forces a theme, each player still controls their own size and app color preference.

HoloSuite Core is a launcher, not a data store. Contacts, cases, maps, terminals, and other content remain in the modules that created them.

Supported app tiles also have a right-click menu. For example, Pulse Scanner offers **Create hotbar macro**. Keyboard users can focus the tile and press **Shift+F10**.

The star in the launcher opens **What's New**. Its Releases and Updates tabs show new modules and changes to existing modules.

## Editing theme artwork

The launcher bezel, inlays, and other hardware can be edited or replaced as SVG files. See the [device artwork guide](assets/device-styles/README.md) for the file names and dimensions.

## World branding

As GM, open **Settings → Open HoloSuite Branding** in the launcher, or use the branding button under **Configure Settings → Module Settings → HoloSuite Core**. Choose the device or an installed app, then edit and save its branding. Browse or upload a PNG or WebP using Foundry’s file picker. Use **Reset fields** and save to restore that entry’s defaults.

## Video

[Watch the HoloSuite Core overview](https://raw.githubusercontent.com/Thuurvdv/HoloSuite/main/docs/assets/videos/HoloSuite-clip.mp4).

## Legal

HoloSuite Core is released under the [GNU Lesser General Public License](LICENSE).
