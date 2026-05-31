# Crime Scene Investigation Toolkit

The Crime Scene Investigation Toolkit (CSI Toolkit) is a system-agnostic Foundry VTT module for running investigation-driven games. Whether your campaign is a cyberpunk noir, a sci-fi police procedural, a horror mystery, or a classic detective story, this module gives you a visual case board where the GM and players can organize evidence, suspects, locations, and timelines together.

## What Does It Do?

- Provides a full case management system where the GM creates and organizes investigation cases.
- Each case gets its own interactive board where evidence, suspects, locations, and timeline entries appear as draggable cards.
- Cards can be connected with visual lines to show relationships, and those lines can be colored and styled (solid, dashed, or dotted) to represent different types of links.
- Players can open shared case boards, drag cards around, add their own connections, and contribute to the investigation in real time.
- Two built-in visual themes are available: a sci-fi police database look and a classic noir corkboard look.
- Cases can be imported and exported as JSON files, making it easy to share investigations between worlds or back them up.

## Tutorial: Using the CSI Toolkit as a GM

### Creating Your First Case

1. Enable **Crime Scene Investigation Toolkit** & **Holosuite-core** in your Foundry world.
2. Open the **Case Manager** from the HoloSuite launcher.
3. Click **New Case** to create a blank case. Give it a title, subtitle (like a case number), and a short description.
4. Set the case visibility to **Players** if you want them to see it, or keep it GM-only until you are ready to reveal it.
5. Choose a board theme: **Database** for a clean sci-fi look, or **Corkboard** for a noir feel.

### Building the Case Board

1. Open your case and switch to the board view.
2. Right-click on the board (or use the toolbar) to add new cards. Cards can be evidence, suspects, locations, or timeline entries.
3. Each card has a title, type, description, image, status, and optional notes. Fill in what you need and leave the rest blank.
4. Drag cards around the board to arrange them however makes sense for your investigation.
5. To connect two cards, use the click-to-connect feature: click the connect action on one card, then click the card you want to link it to. A line appears between them.
6. Edit connections to add labels (like "found at" or "last seen with"), choose a color, and pick a line style.
7. Use board dimming to temporarily fade out card types you do not want to focus on, without deleting anything.

### Running the Investigation During a Session

1. Share the case with players by setting its visibility to **Players**.
2. Players can open the case from the fingerprint button in the scene controls. They see the same board and can drag cards, add connections, and edit cards.
3. As new evidence comes in during the session, add cards to the board on the fly.
4. Reorder timeline entries from the timeline panel to keep the chronology straight.
5. Board changes sync to all connected players in real time, coordinates for the cards have to be pushed seperatly.

### Importing and Exporting

- Click **Export** in the Case Manager to download a case as a JSON file.
- Click **Import** to load a previously exported case.


## Tutorial: Using the CSI Toolkit as a Player

### Opening a Case

1. Open the **Case Manager** from the HoloSuite launcher.
2. A case browser opens showing all cases the GM has made visible to players.
3. Click on a case to open its board.

### Working the Board

1. Drag cards around to organize the investigation the way you see it. Your layout changes are shared with everyone.
2. Click on a card to read its details: description, image, notes, and status.
3. Create connections between cards by using the connect action on a card and then clicking another card. Use this to map out your theories.
4. Edit connections to add labels describing the relationship.
5. Hover over connection lines to see their labels.

### Things to Know

- You can contribute to any case board the GM has opened for players.
- Cards and connections can be edited or deleted from the board view.
- The GM controls which cases are visible. If a case disappears from your browser, the GM has changed its visibility.
