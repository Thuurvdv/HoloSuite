# Galaxy Map

Galaxy Map is a system-agnostic Foundry VTT module for campaign-scale star maps. It gives your sci-fi game a holographic, space-opera-inspired galaxy map where star systems are clickable, routes are traversable, and discoveries unfold over the course of a campaign. Everything runs inside Foundry with no external services.

![Galaxy Map Manager](../images/Galaxy%20Map%20Manager.png)

## What Does It Do?

- Provides an interactive star map that the GM builds and the players explore over time.
- Star systems are clickable nodes with custom icons, colors, sizes, and pulse effects. Each system can hold a description, multiple tagged Foundry scenes, a linked journal entry, and faction affiliation.
- Routes connect systems and display travel time, fuel cost, and route type. Players can travel along routes with a ship animation.
- The GM controls which systems and routes are visible to players. Hidden systems can be revealed one at a time for dramatic discovery moments, complete with a "New System Discovered" notification.
- Players can request travel to a system, prompting the GM and other players to accept or decline.
- A current location marker tracks where the party is on the map.
- Maps can be zoomed, panned, and the window can be resized to fit your setup.
- Full JSON import and export for sharing maps between worlds.

## Tutorial: Using Galaxy Map as a DM

### Getting Started

1. Enable **Galaxy Map** & **Holosuite-core** in your Foundry world.
2. Open the **Map Manager** from the HoloSuite launcher.
3. In the Map Manager, click **Create Map** to start a new map, or **Import JSON** to load an exported map.
4. Click **Open** on a map to view it.

### Building Your Own Map

1. In the Map Manager, click **New Map** and give it a name and optional description.
2. Open the map. Right-click on empty space to add your first star system.
3. Fill in the system name, description, and optional image. Choose an icon style, color, size, and whether it pulses.
4. Add more systems by right-clicking empty space again.
5. To create a route, right-click a system and choose **Create Route From Here**, then select the destination system. Fill in the route type, travel time, fuel cost, and notes.
6. Drag systems around to arrange the map. Positions are saved automatically.
7. Right-click systems or routes to edit, reveal, or delete them.

### Managing Visibility

- By default, new systems are visible to players. You can change any system or route to GM-only through its edit form.
- To reveal a hidden system during a session, right-click it and choose **Reveal System**. It becomes visible to players immediately.
- Click **Notify Discovery** to push a "New System Discovered" notification to all players at the same time.
- Undiscovered systems that are set to player-visible show up as "???" on the player map until you choose to reveal their details.

### Travel

1. Click on a system that is connected to the party's current location by a direct route.
2. Click **Travel To** in the system details panel. The ship marker animates along the route to the destination.
3. Players can also request travel. When they do, you and all other active players receive an accept/decline prompt. If everyone accepts, the ship moves. If anyone declines, travel is cancelled.

### Showing the Map to Players

- Click **Show** in the Map Manager or use a macro to push the map to all player screens.
- Players see only systems, routes, and factions that you have made visible. GM-only content stays hidden.
- Close all player map windows from the Map Manager when you are done.

## Tutorial: Using Galaxy Map as a Player

### Viewing the Map

1. Open **Galaxy Map** from the HoloSuite launcher.
2. A map chooser opens showing all maps the GM has shared with players. Pick one to view.
3. Click on any visible star system to see its details: name, description, faction, and linked journal entry.
4. Click on route lines between systems to see travel details like travel time and fuel cost.
5. Use the scroll wheel to zoom in and out. Click and drag on empty space to pan around the map.

### Requesting Travel

1. Click on a system that is connected to your current location by a visible route.
2. Click **Request Travel** in the system details panel.
3. The participants required by the map's approval rule receive a prompt to accept or decline.
4. When that rule passes, the ship animates along the route to the new system. A request is cancelled when its rule can no longer pass or after 60 seconds.

The GM chooses the approval rule separately for each map under **Edit Map → Player Travel Approval**:

- **GM approval** asks only the primary online GM.
- **Majority vote** counts the requester as an approval and proceeds after more than half of the active participants approve. Declines only cancel the request once a majority can no longer be reached.
- **Unanimous agreement** asks every other active participant and cancels on the first decline. Existing maps use this mode by default.

Travel prompts show the number of approvals needed and the participants who have not answered. The requester receives progress notifications. The approval rule and its current request electorate are fixed when the request begins; changing map settings affects the next request.

### Things to Know

- You can only see systems and routes the GM has revealed. Hidden content does not appear on your map.
- Some systems may show as "???" until the GM reveals their details.
- You cannot add, edit, or move systems and routes. Map building is a GM tool.
- Scene associations are organizational tags for the GM and are not buttons in the system details panel.

## Map appearance

The map includes a subdued nebula and dust-lane background, with stronger glows reserved for selected systems, the party location, destinations, and alerts. Custom background images remain supported.

Use the layers button beside the zoom controls to toggle faction influence regions for the current window. Regions are generated from affiliated systems; they are visual approximations, not manually drawn political borders. Player regions use only visible systems with known details and visible factions. Regions update after system positions are saved.

## Planet close-up

Select a planet on the galaxy map and choose **Inspect Planet**. The same window opens a large rotating 3D sphere with survey information beside it. Drag or use arrow keys to rotate, scroll or use the zoom buttons to move closer, and pause rotation when desired. **Back to Galaxy** restores your map position, zoom, search, and selection.

In **Edit System → Planet close-up**, choose a **Sphere**, **Cube**, **Donut**, **Asteroid**, **Crystal**, or **Cylinder** and one of three bundled appearances: **Cartoon · Acid Seas**, **Painterly · Golden Frontier**, or **Realistic · Blue Marble**. The GM's **Compare appearance** selector previews these looks locally without saving; use Edit System to save a choice.

Choose **Custom texture** under Appearance to reveal the custom texture picker and a shape-specific UV guide. The selected image is shown directly beneath the translucent guide. The guide documents the recommended canvas and the exact regions used by the renderer: 2:1 wrapped maps for spheres, donuts, asteroids, and crystals; a 4×3 cube cross; and a square cylinder atlas with a central side strip and separate end caps. The custom controls remain hidden for bundled appearances.

To use your own surface, use **Planet Texture → Browse** to select a PNG, JPEG, or WebP. A seamless 2:1 equirectangular image (an unwrapped world map, preferably 2048 × 1024) fits best. This field is separate from the existing system portrait image. Clear the texture path to return to a preset. Custom paths and preset choices are included in JSON map import/export; external images must also be copied when moving between worlds.

“System” remains a generic location: stations and anomalies do not automatically become planets. An explicit planet preset or custom texture enables a close-up; **No planet view** disables it. Player close-ups are available only for visible, discovered entries on shared maps.

The 3D renderer loads on demand and permits one active planet viewer per client. Rotation is capped at 30 FPS, the render buffer's longest edge at 1200 pixels, and uploaded textures at 2048 pixels. Pause, background tabs, minimized windows, reduced motion, and HoloSuite's no-effects preference stop automatic rotation. **Static view** releases the renderer; devices without WebGL 2 use a static preview automatically. Leaving the viewer frees its graphics resources. Large custom images still need to download and decode before being reduced for the GPU.

The build now includes a lazy renderer under `dist/chunks/`. Distribute the **entire module directory**, including chunks and `assets/planets`, rather than copying only `dist/main.js`.

## Scene Tag API

Normalized system data stores scene associations in `system.sceneIds` as an array of Foundry scene IDs. Existing maps that used the older `system.sceneId` field are converted automatically when read or saved.

- `game.galaxyMap.getSceneIdsForSystem(mapId, systemId)` returns the scene ID array for one system.
- `game.galaxyMap.getSystemsForScene(sceneId)` returns every matching `{ mapId, mapTitle, system }` association across galaxy maps.

## Map Focus API

Integrations can focus a visible system without accessing Galaxy Map internals:

```js
await game.galaxyMap.focusSystem(mapId, systemId, {
  focusId: "signal-id",
  kind: "distress",
  label: "Distress signal",
  color: "#ff5c7a",
  zoom: 1.45,
  duration: 0
});

game.galaxyMap.clearSystemFocus(mapId, "signal-id");
```

`kind` accepts `distress`, `warning`, `objective`, or `custom`. A duration of `0` leaves the marker active until it is explicitly cleared or the map closes. Player clients can focus only maps and systems already visible to them; the API never reveals hidden map data.
