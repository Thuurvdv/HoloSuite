# Pulse Scanner

Pulse Scanner is a system-agnostic Foundry VTT v12/v13 public beta module for cinematic scanner pulses and GM-placed scan targets linked to Foundry Scene Regions.

No AI. No external services. No backend. No database. Targets are stored on the Scene with Foundry flags:

```js
scene.setFlag("pulse-scanner", "targets", targetsObject);
scene.getFlag("pulse-scanner", "targets");
```

## Install

1. Copy `pulse-scanner` into your Foundry user data `Data/modules` folder.
2. Restart Foundry or refresh the Setup screen.
3. Enable **Pulse Scanner** in **Manage Modules**.
4. Open a scene, draw Scene Regions where scan targets should be, then open the Pulse Scanner Target Manager to create targets linked to those regions.
5. Drag the included **Pulse Scanner** world item onto a player actor so they can trigger scans from that item or from the token HUD shortcut.

For local development, symlink or copy this folder to `Data/modules/pulse-scanner`, edit files, then refresh Foundry with cache disabled.

## Files

- `module.json` registers the beta module, script, stylesheet, and socket support.
- `scripts/pulse-scanner.js` contains the public API, settings, target manager, scan modes, reveal tools, JSON import/export API, and pulse effects.
- `styles/pulse-scanner.css` contains the manager UI, pulse animation, target ping, labels, and integrity bars.
- `templates/target-manager.hbs` renders the GM target list, scanner modes, reveal tools, and new target button.
- `templates/target-form.hbs` renders create/edit fields with a Scene Region dropdown, mode, type, status, visibility, and notes.

## Public API

```js
game.pulseScanner.openTargetManager();
game.pulseScanner.scan(options);
game.pulseScanner.usePulseScannerItem(options);
game.pulseScanner.createPulseScannerItem(actorOrToken, options);
game.pulseScanner.ensureWorldPulseScannerItem(options);
game.pulseScanner.createWorldPulseScannerItem(options);
game.pulseScanner.getPulseScannerItemData(options);
game.pulseScanner.hasPulseScannerItem(actorOrToken);
game.pulseScanner.createTarget(targetData);
game.pulseScanner.getTargets(sceneId);
game.pulseScanner.deleteTarget(targetId);
game.pulseScanner.revealTarget(targetId);
game.pulseScanner.revealLatestScan();
game.pulseScanner.hideTarget(targetId);
game.pulseScanner.resolveTarget(targetId);
game.pulseScanner.exportTargets(sceneId);
game.pulseScanner.importTargets(jsonOrObject);
```

## Scanner Modes

Supported modes:

- `structural`
- `arcane`
- `thermal`
- `forensic`
- `tech`
- `biological`

Each target stores a mode. Scans can filter by mode:

```js
await game.pulseScanner.scan({
  tokenId: canvas.tokens.controlled[0]?.id,
  radius: 600,
  mode: "structural"
});
```

## Target Data

Targets link to Foundry Scene Regions via `regionId`. The region's bounds provide the target's position and scan radius at runtime.

```js
{
  id: "optional-id",
  sceneId: canvas.scene.id,
  regionId: "region-document-id",
  mode: "structural",
  type: "breakable",
  label: "Cracked Maintenance Wall",
  description: "A stress fracture behind old paneling.",
  integrity: 42,
  difficulty: 12,
  visibility: "gm",
  status: "active",
  color: "#ffb347"
}
```

Types: `breakable`, `hidden`, `trap`, `magic`, `tech`, `biological`, `radiation`, `evidence`, `loot`, `custom`.

Icons are assigned automatically from the target type.

Visibility: `gm`, `revealed`, `always`.

Status: `active`, `revealed`, `resolved`.

## GM Workflow

1. Draw one or more **Scene Regions** on the canvas using Foundry's built-in region tools.
2. Open the **Pulse Scanner Target Manager** (via HoloSuite or `game.pulseScanner.openTargetManager()`).
3. Click **New Target**, select a Scene Region from the dropdown, set the mode/type/label, and save.
4. Run scans by mode from a selected token.
5. Reveal one target, reveal all latest detections, hide a revealed target, or mark it resolved/destroyed.
6. Use the JSON API macros below when moving target data between worlds.

## Player Workflow

Players use the scanner as an actor item first:

1. The GM drags the included **Pulse Scanner** item from the Items sidebar onto the actor.
2. The player selects their token.
3. The player clicks **Scan** on the Pulse Scanner item sheet, or clicks the pulse icon in the token HUD.
4. The pulse fires from the selected token and reveals only player-safe scan labels.

When a GM loads the world, the module creates a flagged **Pulse Scanner** item in the world Items directory if one does not already exist. The target manager can create additional scanner item variants with different names, signals, and ranges. By default, players must have one of these scanner items to scan. GMs can turn off **Require Pulse Scanner Item** in module settings for macro-only or toolbar-only games, or turn off **Create World Pulse Scanner Item** if they prefer to manage the item manually.

## Macro Examples

### Open Target Manager

```js
game.pulseScanner.openTargetManager();
```

### Create Sample Breakable Wall

```js
await game.pulseScanner.createTarget({
  sceneId: canvas.scene.id,
  regionId: "your-region-id-here",
  mode: "structural",
  type: "breakable",
  label: "Cracked Stone Wall",
  description: "A hollow section responds to structural scans.",
  integrity: 42,
  difficulty: 14,
  visibility: "gm",
  status: "active",
  color: "#ffb347"
});
```

### Scan From Selected Token

```js
await game.pulseScanner.scan({
  tokenId: canvas.tokens.controlled[0]?.id,
  radius: 600,
  mode: "tech"
});
```

### Give Selected Token a Pulse Scanner Item

```js
await game.pulseScanner.createPulseScannerItem(canvas.tokens.controlled[0]);
```

### Use Pulse Scanner Item From Selected Token

```js
await game.pulseScanner.usePulseScannerItem({
  tokenId: canvas.tokens.controlled[0]?.id
});
```

### GM Scan and Reveal Pulse to Players

```js
await game.pulseScanner.scan({
  tokenId: canvas.tokens.controlled[0]?.id,
  radius: 600,
  modes: ["structural", "tech", "arcane"],
  revealToPlayers: true
});
```

### Reveal Latest Scan Results as Player Markers

```js
await game.pulseScanner.revealLatestScan();
```

### Hide or Resolve a Target

```js
await game.pulseScanner.hideTarget("target-id");
await game.pulseScanner.resolveTarget("target-id");
```

### Export and Import API

```js
game.pulseScanner.exportTargets(canvas.scene.id);
```

```js
await game.pulseScanner.importTargets({
  targets: [
    {
      regionId: "region-id-1",
      mode: "forensic",
      type: "evidence",
      label: "Blood Trace",
      description: "A faint residue pattern.",
      integrity: 100,
      difficulty: 11,
      visibility: "gm",
      status: "active",
      color: "#ff4d6d"
    },
    {
      regionId: "region-id-2",
      mode: "tech",
      type: "tech",
      label: "Encrypted Transponder",
      description: "Low-power electronics buried in debris.",
      integrity: 88,
      difficulty: 15,
      visibility: "gm",
      status: "active",
      color: "#39ffb6"
    }
  ]
});
```

## Sound Effect

Set **Scan Pulse Sound** in module settings to an audio path such as:

```text
sounds/scanner-pulse.ogg
```

The sound plays when a scan pulse fires.

## Testing Checklist

- Enable the module in a Foundry v12 or v13 world.
- Draw Scene Regions on the canvas.
- Open the Pulse Scanner Target Manager and create targets linked to regions.
- Run structural, arcane, thermal, forensic, tech, and biological scans.
- Confirm resolved targets no longer scan.
- Confirm detected targets show pings, labels, and integrity bars.
- Confirm `SIGNATURE DETECTED` and `NO SIGNATURES DETECTED` notifications.
- Reveal one target and confirm players see it in pulse results.
- Hide the target and confirm players no longer see it.
- Reveal latest scan results and confirm all latest detections become revealed.
- Export targets by macro, clear or change targets, then import the JSON by macro.
- Confirm GM notes never appear in player pulse labels.

## Known Limitations

- Foundry walls are not parsed or modified.
- Wall HP, destruction, lighting, movement, and combat automation are not implemented.
- No system-specific skill rolls are included.
- Scan distance uses scene-pixel distance, not pathfinding or line of sight.
- Player clients can receive scene flag data because this is a client-only module; the UI and API hide GM notes from player-facing displays.
- Targets without a linked region use fallback x/y/radius values (defaults to 0,0 with radius 80).

## Roadmap

- Optional persistent revealed marker styling for players.
- Import/export target packs with thumbnails.
- Line-of-sight and wall-blocked scanning modes.
- Optional non-system-specific check hooks.
- Scene Notes integration.
- Optional Foundry wall analysis as a separate future feature.
