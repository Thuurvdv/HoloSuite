# Crime Scene Investigation Toolkit

Crime Scene Investigation Toolkit, or CSI Toolkit, is a system-agnostic Foundry VTT module for running mystery, detective, sci-fi police, noir, cyberpunk, horror, and investigation-heavy campaigns.

It is intentionally local-only:

- no AI generation
- no external services
- no backend
- no database
- cases are stored in Foundry world settings

## Public Beta Features

- Left scene-controls button for GMs and players.
- Case manager for case-level setup, imports, exports, and board theme.
- Foundry FilePicker image selection.
- Shared player-facing case boards.
- Drag-and-drop board cards with saved layout per case.
- Zoom and pan on the case board.
- Visual SVG connection lines between cards.
- Connection colors plus solid, dashed, or dotted line styles.
- Board card editing from inside the board view.
- Board card and connection deletion from inside the board view.
- Type-based board dimming for temporarily de-emphasizing entities without deleting them.
- Compact board toolbar and right-click board add menu.
- Player case browser from the left scene controls.
- Player board contributions for any case board they can open.
- Click-to-connect cards from inside the board view.
- Connection labels appear when hovering over board connection lines.
- Timeline entries can be reordered from the timeline panel.
- Live player board refresh through `game.socket`.
- JSON import/export.
- Bundled sample case: `samples/glass-orchid.json`.
- Sci-fi police database and noir corkboard themes.

## Install

1. Copy this folder into your Foundry user data modules directory.
2. The final folder name should be `csi-toolkit` so it matches the module id in `module.json`.
3. Restart Foundry or return to Setup and refresh the module list.
4. Enable **Crime Scene Investigation Toolkit** in your world.

For local development, copy or symlink this folder to:

```text
FoundryVTT/Data/modules/csi-toolkit
```

## Files

```text
module.json
scripts/csi-toolkit.js
styles/csi-toolkit.css
templates/case-manager.hbs
templates/case-board.hbs
templates/item-card.hbs
samples/glass-orchid.json
README.md
```

## Public API

```js
game.csiToolkit.openCaseBoard(caseId);
game.csiToolkit.openCaseManager();
game.csiToolkit.createCase(caseData);
game.csiToolkit.getCases();
game.csiToolkit.exportCase(caseId);
game.csiToolkit.importCase(caseData);
game.csiToolkit.importSampleCase();
```

## Testing In Foundry

1. Enable the module in a world.
2. As GM, click the fingerprint button in the left scene controls or run:

```js
game.csiToolkit.openCaseManager();
```

3. Click **Sample Case** to import the bundled case.
4. Open the board.
5. Drag cards around, zoom, and pan the board.
6. Reload the board and confirm card positions persist.
7. Connect as a non-GM player.
8. Use the fingerprint button to open the case browser.
9. Open the board and confirm cards, connections, and edits are shared.

## Example Macros

### Open Case Manager

```js
game.csiToolkit.openCaseManager();
```

### Import Bundled Sample Case

```js
const c = await game.csiToolkit.importSampleCase();
game.csiToolkit.openCaseBoard(c.id);
```

### Create A Minimal Case

```js
const c = await game.csiToolkit.createCase({
  title: "The Locked Observatory",
  subtitle: "Case 04-B",
  status: "open",
  description: "A professor is found dead under a sealed dome.",
  visibility: "players",
  evidence: [
    {
      id: "lens",
      title: "Cracked Telescope Lens",
      type: "physical",
      description: "A hairline fracture crosses the inside face of the lens.",
      image: "",
      status: "relevant",
      visibility: "players",
      notes: "The fracture was caused from inside the mechanism."
    }
  ],
  suspects: [],
  locations: [],
  timeline: [],
  connections: []
});

game.csiToolkit.openCaseBoard(c.id);
```

### Open A Specific Case Board

```js
game.csiToolkit.openCaseBoard("case-id-here");
```

## Data Notes

Cases still live in:

```js
game.settings.register("csi-toolkit", "cases", {
  scope: "world",
  config: false,
  type: Object,
  default: {}
});
```

The beta adds a `boardLayout` object to each case:

```json
{
  "theme": "database",
  "view": { "x": 0, "y": 0, "scale": 1 },
  "cards": {
    "item-id": { "x": 120, "y": 180 }
  }
}
```

## Known Limitations

- Connection lines are straight SVG lines, not a full graph editor.
- Board layout is per case, not per user.
- Import/export uses browser file download/upload.
- Legacy `visibility` fields may exist in older case JSON, but they are no longer used to hide case files or cards.
- There is no live scene scanning, OCR, AI, or external API integration.

## Roadmap

- Card grouping and board search.
- Better connection labels drawn directly on the board.
- Optional journal entry linking.
- Import/export all cases as a campaign archive.
- Permission presets for collaborative editing.
