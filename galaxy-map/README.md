# Galaxy Map Framework

Galaxy Map Framework is a system-agnostic Foundry VTT module for campaign-scale, cinematic sci-fi star maps. It is deliberately original: holographic, readable, and space-opera inspired without copying UI, names, icons, fonts, colors, terminology, or assets from any existing game.

## Public Beta Features

- Foundry VTT v12/v13 target.
- JavaScript-first module with no backend, database, external service, AI feature, Canvas, or WebGL.
- World-setting persistence through `game.settings`.
- Global API at `game.galaxyMap`.
- Left scene-controls toolbar button for opening the galaxy map experience.
- Player map chooser for switching between player-visible galaxy maps.
- GM map manager for creating, importing, installing samples, and opening maps.
- Map-local CRUD forms for map metadata, systems, routes, and factions.
- CSI-style right-click context menu on the map for adding, editing, deleting, revealing, and exporting map content.
- Interactive HTML/CSS/SVG map view with clickable star systems and route lines.
- Resizable galaxy map window.
- Drag-and-drop GM star positioning with saved `x` and `y` coordinates.
- Per-system icon style, size, color, and pulse controls.
- Procedural galaxy-style backdrop when no background image is configured.
- Zoom and pan for map navigation.
- Clickable route lines with travel details.
- GM actions to reveal selected systems or selected routes to players.
- Current location tracking plus **Travel To** animation along direct routes.
- Player-started travel requests with accept/decline prompts for the GM and other active players.
- GM discovery notification push: **New System Discovered**.
- Player-facing filtered view via `game.socket`.
- Linked Scene and Journal buttons on visible system details.
- Included polished sample map: **The Aster Veil**.

## File Layout

Place the folder in your Foundry user data modules directory:

```text
Data/modules/galaxy-map/
  module.json
  dist/main.js
  styles/galaxy-map-framework.css
  templates/map-manager.hbs
  templates/galaxy-map.hbs
  templates/system-details.hbs
  samples/aster-veil.sample.json
  README.md
```

## Install Instructions

1. Copy this `galaxy-map` folder into `FoundryVTT/Data/modules/`.
2. Restart Foundry VTT.
3. Open your world.
4. Enable **Galaxy Map** in **Manage Modules**.
5. As GM, run:

```js
game.galaxyMap.openMapManager();
```

## Local Development

For local development, keep this folder symlinked or copied into your Foundry `Data/modules` directory.

After changing JavaScript, templates, CSS, or `module.json`:

1. Refresh the Foundry browser tab.
2. If the manifest changed, restart Foundry.
3. Open the browser developer console and check for errors.
4. Open a map and use right-click CRUD actions to verify data saves to world settings.

## Global API

```js
game.galaxyMap.openMap(mapId);
game.galaxyMap.openMapManager();
game.galaxyMap.openGalaxyMapFromSceneControls();
game.galaxyMap.openPlayerMapChooser();
game.galaxyMap.createMap(mapData);
game.galaxyMap.getMaps();
game.galaxyMap.showMapToPlayers(mapId);
game.galaxyMap.closePlayerMap();
game.galaxyMap.revealSystemToPlayers(mapId, systemId);
game.galaxyMap.revealRouteToPlayers(mapId, routeId);
game.galaxyMap.notifySystemDiscovered(mapId, systemId);
game.galaxyMap.requestTravelToSystem(mapId, systemId);
game.galaxyMap.exportMap(mapId);
game.galaxyMap.importMapData(mapData);
game.galaxyMap.installSampleMap();
```

The module also exposes `updateMap`, `deleteMap`, `duplicateMap`, and `saveSystemPosition` for convenience during development.

## Example Macros

### Install the Included Sample Galaxy Map

```js
await game.galaxyMap.installSampleMap();
```

### Open Map Manager

```js
game.galaxyMap.openMapManager();
```

### Open a Specific Map

```js
game.galaxyMap.openMap("sample-aster-veil");
```

### Show Map to Players

```js
game.galaxyMap.showMapToPlayers("sample-aster-veil");
```

### Close Player Map

```js
game.galaxyMap.closePlayerMap();
```

### Reveal Content to Players

```js
await game.galaxyMap.revealSystemToPlayers("sample-aster-veil", "red-wake");
await game.galaxyMap.revealRouteToPlayers("sample-aster-veil", "route-kestral-redwake");
game.galaxyMap.notifySystemDiscovered("sample-aster-veil", "red-wake");
```

### Export One Map

```js
game.galaxyMap.exportMap("sample-aster-veil");
```

## Example Sample Galaxy Map JSON

The included sample JSON lives at `samples/aster-veil.sample.json`. You can import it from the map manager with **Import JSON**, or install/reset it instantly with **Install Sample**.

## Testing Checklist

- Enable the module in a Foundry v12 or v13 world.
- Confirm `game.galaxyMap` exists in the console.
- Open the manager as GM.
- Click the **Galaxy Map** button in the left scene-controls toolbar.
- Click **Install Sample**.
- Create a new system without changing visibility and confirm it defaults to player-visible.
- Open the map and click each star system.
- Resize the galaxy map window and confirm the map area and detail panel adapt.
- Right-click empty map space, or use the map toolbar menu button, to add a system, add a route, add/manage factions, edit map details, or export the map.
- Right-click a system to edit, create a route from it, reveal it, or delete it.
- Right-click a route to edit, reveal, or delete it.
- Edit a system and confirm icon style, size, color, and pulse controls update the map.
- Select a non-current system connected by a direct route and click **Travel To**.
- As a player, select a non-current system connected by a visible route and click **Request Travel**.
- Confirm the GM and other active players receive an accept/decline popup.
- Accept on all prompted clients and confirm the ship animation plays before the current location updates.
- Decline on one prompted client and confirm travel is cancelled.
- Confirm system and map image path fields include a **Browse** button and match the module color scheme.
- Drag a star system as GM and confirm the new position persists after closing and reopening the map.
- Use the toolbar buttons and mouse wheel to zoom; drag empty map space to pan.
- Click route lines and confirm the route detail panel shows type, travel time, fuel cost, and notes.
- Confirm GM-only systems, routes, and notes are visible to the GM.
- Select a GM-only system and click **Reveal System**.
- Select a GM-only route and click **Reveal Route**.
- Click **Notify Discovery** and confirm players receive the notification.
- Use **Export** and confirm a single-map JSON file downloads.
- Use **Import JSON** to import one galaxy map JSON file.
- Log in as a player or use a second browser session.
- Click the **Galaxy Map** toolbar button as a player and confirm the player-visible map chooser opens.
- Use **Show** or `game.galaxyMap.showMapToPlayers(mapId)` as GM.
- Confirm player view hides GM-only systems, routes, factions, and notes.
- Confirm undiscovered player-visible systems display as `???`.
- Confirm linked Scene and Journal buttons work when valid IDs are supplied.
- Confirm `game.galaxyMap.closePlayerMap()` closes player map windows.

## Known Limitations

- Import/export remains JSON-based by design, but day-to-day editing happens inside the map through right-click dialogs.
- Dragging only moves existing systems; it does not create routes or snap to a grid.
- Zoom and pan are per-window view state and are not persisted.
- No procedural generation.
- No route pathfinding.
- No economy, faction simulation, or clock system.
- No Canvas or WebGL rendering.
- No AI or external services.

## Roadmap

- Form-based editors for map metadata, systems, routes, and factions.
- Snap, coordinate readout, and keyboard nudging for node placement.
- Optional scene/journal pickers.
- Fog-of-war style discovery workflow.
- Route filtering by type, faction, and visibility.
- Persisted view presets per map.
- Compendium packs for sample maps and reusable visual presets.
