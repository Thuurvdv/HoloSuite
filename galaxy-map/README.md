# Galaxy Map

Galaxy Map is a system-agnostic Foundry VTT module for campaign-scale star maps. It gives your sci-fi game a holographic, space-opera-inspired galaxy map where star systems are clickable, routes are traversable, and discoveries unfold over the course of a campaign. Everything runs inside Foundry with no external services.

## What Does It Do?

- Provides an interactive star map that the GM builds and the players explore over time.
- Star systems are clickable nodes with custom icons, colors, sizes, and pulse effects. Each system can hold a description, linked Foundry scene, linked journal entry, and faction affiliation.
- Routes connect systems and display travel time, fuel cost, and route type. Players can travel along routes with a ship animation.
- The GM controls which systems and routes are visible to players. Hidden systems can be revealed one at a time for dramatic discovery moments, complete with a "New System Discovered" notification.
- Players can request travel to a system, prompting the GM and other players to accept or decline.
- A current location marker tracks where the party is on the map.
- A polished sample map called "The Aster Veil" is included to get you started quickly.
- Maps can be zoomed, panned, and the window can be resized to fit your setup.
- Full JSON import and export for sharing maps between worlds.

## Tutorial: Using Galaxy Map as a DM

### Getting Started

1. Enable **Galaxy Map** in your Foundry world.
2. Click the **Galaxy Map** button in the left scene controls toolbar to open the map experience, or open the **Map Manager** from the same menu.
3. In the Map Manager, click **Install Sample** to load the included "Aster Veil" sample map. This is a great way to see everything in action before building your own.
4. Click **Open** on any map to view it.

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

### Tips

- Start with just the systems the players know about. Add and reveal systems as the campaign progresses.
- Use faction assignments and route types to create political and logistical layers on the map.
- Link systems to Foundry scenes and journal entries so players can jump directly from the map into a location or read lore.

## Tutorial: Using Galaxy Map as a Player

### Viewing the Map

1. Click the **Galaxy Map** button in the left scene controls toolbar.
2. A map chooser opens showing all maps the GM has shared with players. Pick one to view.
3. Click on any visible star system to see its details: name, description, faction, and links to scenes or journal entries.
4. Click on route lines between systems to see travel details like travel time and fuel cost.
5. Use the scroll wheel to zoom in and out. Click and drag on empty space to pan around the map.

### Requesting Travel

1. Click on a system that is connected to your current location by a visible route.
2. Click **Request Travel** in the system details panel.
3. The GM and all other active players receive a prompt to accept or decline.
4. If everyone accepts, the ship animates along the route to the new system.
5. If anyone declines, the travel request is cancelled.

### Things to Know

- You can only see systems and routes the GM has revealed. Hidden content does not appear on your map.
- Some systems may show as "???" until the GM reveals their details.
- You cannot add, edit, or move systems and routes. Map building is a GM tool.
- If linked scenes or journal entries are available for a system, buttons for those appear in the system details panel.
