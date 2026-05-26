# Security Camera System

A sci-fi/cyberpunk security camera manager and still-feed monitor module for Foundry VTT v12/v13.

This module uses Foundry-native data only. No AI, external services, backend, or database.

## Features

- GM Camera Manager window
- GM-only scene toolbar button
- Create, edit, delete, and duplicate cameras
- Scene dropdown using world scenes
- Foundry v13 Scene Region targeting
- Feed sources: live canvas or static image
- Camera statuses: online, offline, corrupted, restricted
- Display modes: window, picture-in-picture
- GM broadcast to all players with `game.socket`
- Close all player feeds
- Cyberpunk feed UI with scanlines, REC indicator, access denied, signal loss, and corrupted glitch states

## Camera Manager

As GM, open the manager from the left scene toolbar. The button uses a video camera icon and appears inside the token controls.

The **New** button opens an empty camera draft and defaults the Scene field to the currently active scene.

From the manager, the GM can:

- Add a new camera
- Edit the selected camera
- Duplicate or delete the selected camera
- Pick a scene from the world scene list
- Link a Foundry v13 Scene Region
- Choose **Live Canvas** or **Static Image**
- Pick a static image with Foundry FilePicker when Static Image is selected
- Set status and display mode
- Show the selected camera to players
- Close all player feeds

## Global API

```js
game.securityCameras.openMonitor();
game.securityCameras.closeMonitor();
game.securityCameras.showFeed(cameraId);
game.securityCameras.registerCamera(cameraData);
game.securityCameras.deleteCamera(cameraId);
game.securityCameras.duplicateCamera(cameraId);
game.securityCameras.getCameras();
game.securityCameras.closeFeed();
```

## Camera Data Model

```js
{
  id: "lobby-cam-01",
  name: "Lobby Camera 01",
  sceneId: "abc123",
  location: "Corporate Lobby",
  image: "path/to/static-image.webp",
  feedSource: "live", // live, image
  status: "online", // online, offline, corrupted, restricted
  displayMode: "window", // window, picture-in-picture
  regionId: "",
  regionX: 2000,
  regionY: 1600,
  regionWidth: 1200,
  regionHeight: 675,
  notes: "Optional GM notes"
}
```

## Live View

Live view is client-local. When the GM shows a camera whose feed source is **Live Canvas**, each recipient opens a feed window and that client captures its own rendered canvas.

If canvas extraction returns black, the feed falls back to cropping the linked Region from the scene background image and overlays visible tokens whose bounds overlap the Region.

Important behavior:

- Each viewing client must be on the camera's configured scene for local live canvas updates.
- Region size is read from the linked Foundry Region.
- The feed shows the full Region, letterboxed if needed.
- Static Image mode does not show the image path field unless selected.
- The module does not create lights, reveal fog, move tokens, or alter scene vision.

## Known Limitations

- Background fallback does not include lighting, weather, walls, templates, or other canvas effects.
- Token overlays are approximate and use token art plus token scene bounds.
- Region crops use Region bounds, not exact polygon masks.
- There is no custom camera lighting or line-of-sight logic yet.
