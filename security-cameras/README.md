# Security Cameras

Show players camera feeds from live scenes or static images.

Supports Foundry v12-v14. Requires **HoloSuite Core**.

## Installation

1. In Foundry's Setup screen, open **Add-on Modules > Install Module**. Install **Security Cameras** and **HoloSuite Core**.
2. Launch your world as a GM. Open **Game Settings > Manage Modules**, enable both modules, and save.
3. Open **Security Cameras** from the HoloSuite launcher.

## Quick Start

1. Click **New** and enter a camera name and location.
2. Choose a **Feed Source**:
   - **Live Canvas:** Select a Scene and, optionally, a Scene Region to crop the view. Scene Regions require Foundry v13 or later.
   - **Static Image:** Choose an image with **Browse**. Scene and Scene Region are disabled for this source.
3. Choose a status and display mode: **Window** or **Picture-in-Picture**.
4. Click **Save Camera**. The manager shows a preview automatically.
5. Click **Show Saved Feed** to broadcast it to players, or **Save & Show** to save your changes and broadcast together.
6. Use **Close Feeds** to close the camera windows for everyone.

Players receive the feed automatically. Drag the top-center handle to move it, resize from the bottom-right corner, or close it with the bottom-center X.

## Camera Status

| Status | What players see |
| --- | --- |
| Online | The camera view with screen effects. |
| Clean | The camera view without screen effects or filters. |
| Offline | A no-signal screen. |
| Corrupted | A glitched camera view. |
| Restricted | An access-denied screen. |

Save a status change to update open feeds.

## Video Effects

In **Configure Settings > Security Cameras > Video Effect Intensity**, adjust the effects from **0%** (off) to **200%**. The default is **50%**. Changes apply immediately for all viewers. Clean feeds always have no effects.

## Performance

In **Configure Settings > Security Cameras**:

- **Camera Quality:** Low uses 480px frames every 2.5 seconds, Balanced uses 640px every 1.5 seconds, and High uses 960px every 1.25 seconds. Balanced is the default. Still scenes reuse their last frame until something changes.
- **Reduced Screen Effects:** Remove animated effects and image filters on your own computer. Each player can choose this independently.
- **Animate Video Tiles:** Turn this off to use still frames from video backgrounds and tiles, reducing work on the GM's computer.

## Video

[Watch the Security Cameras overview on our website](https://www.magetowerstudios.com/docs/module.html?id=security-cameras#videos).
