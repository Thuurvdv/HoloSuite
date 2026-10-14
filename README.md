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
4. Open **Settings** inside the launcher to choose a device style.
5. Use Foundry's module settings for world-wide themes, player access, and debugging options.

HoloSuite Core is a launcher, not a data store. Contacts, cases, maps, terminals, and other content remain in the modules that created them.

## Video

[Watch the HoloSuite Core overview](https://raw.githubusercontent.com/Thuurvdv/HoloSuite/main/docs/assets/videos/HoloSuite-clip.mp4).

## Legal

HoloSuite Core is released under the [GNU Lesser General Public License](LICENSE).
