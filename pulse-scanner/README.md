# Pulse Scanner

Pulse Scanner is a system-agnostic Foundry VTT module for cinematic scanning gameplay. The GM places hidden scan targets around a scene, and players fire scanner pulses from their tokens to detect nearby signatures. It is designed for sci-fi, horror, and investigation games where discovering hidden objects, structural weaknesses, energy signatures, or biological traces is part of the action.

## What Does It Do?

- The GM places hidden scan targets on a scene by linking them to Foundry Scene Regions. Each target has a type, scan mode, difficulty, and description.
- Players trigger scanner pulses from their tokens. A visual pulse wave radiates outward, and any targets within range that match the scan mode are detected.
- Detected targets show up as pings on the map with labels and integrity bars.
- Six scan modes are available: structural, arcane, thermal, forensic, tech, and biological.
- Targets can be revealed to players, hidden again, or marked as resolved once they have been dealt with.
- Each target has its own type that determines its icon: breakable walls, hidden objects, traps, magic sources, tech devices, biological signatures, radiation, evidence, loot, and custom.
- The GM can run scans directly, or players can scan using a Pulse Scanner item on their character sheet or a shortcut on the token HUD.
- Full JSON import and export for moving target sets between scenes and worlds.
- An optional sound effect plays with each pulse.

## Tutorial: Using Pulse Scanner as a DM

### Setting Up a Scene

1. Enable **Pulse Scanner** in your Foundry world.
2. Open the scene you want to populate with scan targets.
3. Use Foundry's built-in region tools to draw **Scene Regions** in the areas where you want hidden targets. For example, draw a region over a cracked wall, a hidden compartment, or a concealed device.
4. Open the **Pulse Scanner Target Manager** from the scene controls (or the HoloSuite launcher if installed).
5. Click **New Target**. Select a Scene Region from the dropdown, then set the target's mode, type, label, description, difficulty, and integrity.
6. Leave the target visibility set to **GM** to keep it hidden from players until it is detected.
7. Repeat for as many targets as you want on the scene.

### Running Scans During a Session

1. When a player wants to scan, they can use the Pulse Scanner item on their character sheet, click the pulse icon on the token HUD, or ask you to trigger it.
2. The pulse fires from the player's token and expands outward. Any matching targets within range are detected.
3. Detected targets show a "SIGNATURE DETECTED" notification. If nothing is in range, a "NO SIGNATURES DETECTED" message appears.
4. You can reveal detected targets to players so they see the ping and label on their maps. Use **Reveal Target** on individual targets or **Reveal Latest Scan** to reveal everything from the most recent scan at once.
5. To hide a revealed target again, use **Hide Target**.
6. Once players have dealt with a target (broken the wall, disarmed the trap, collected the evidence), use **Resolve Target** to mark it as done. Resolved targets no longer appear in scan results.

### Giving Players the Scanner Item

- When you load a world with Pulse Scanner enabled, the module automatically creates a **Pulse Scanner** item in the world Items directory.
- Drag this item from the Items sidebar onto a player's actor to give them a scanner.
- Players can then scan using the item on their character sheet or the token HUD button.
- If you prefer a more controlled approach, you can turn off the **Create World Pulse Scanner Item** setting and manage scanner distribution manually.
- You can also turn off **Require Pulse Scanner Item** if you want players to scan without needing the item at all (for example, if scanning is a universal ability in your setting).

### Scan Modes

Each target is assigned a scan mode, and scans can filter by mode. Use this to create layered discovery:

- **Structural**: Walls, supports, hidden passages, weak points in construction.
- **Arcane**: Magical signatures, wards, enchantments, ley line traces.
- **Thermal**: Heat sources, life signs, engine signatures, recent activity.
- **Forensic**: Crime scene traces, residue, fingerprints, DNA.
- **Tech**: Electronic devices, encrypted signals, hidden transmitters.
- **Biological**: Organic matter, toxins, parasites, living organisms.

### Tips

- Place targets with different scan modes to reward players who think about which scanner setting to use instead of just pulsing everything.
- Use the difficulty value to gate what can be detected. Higher difficulty targets might require closer range or better equipment.
- Pair Pulse Scanner with the CSI Toolkit. When players detect forensic evidence, have them add it to the case board.
- Use integrity values to create destructible targets. A cracked wall with low integrity is almost ready to break.

## Tutorial: Using Pulse Scanner as a Player

### Getting Your Scanner

1. The GM will give you a Pulse Scanner item by dragging it onto your character. You will see it in your inventory.
2. Alternatively, the GM may set up the game so that scanning does not require an item at all.

### Running a Scan

1. Select your token on the scene.
2. Trigger a scan in one of these ways:
   - Click the **Scan** button on the Pulse Scanner item in your character sheet.
   - Click the pulse icon on your token's HUD (right-click your token to open the HUD).
   - Ask the GM to trigger a scan for you.
3. A visible pulse wave expands outward from your token.
4. If any scannable targets are within range and match your scan mode, you see a "SIGNATURE DETECTED" notification and a ping appears on the map.
5. If nothing is in range, you see "NO SIGNATURES DETECTED."

### Reading Scan Results

- Detected targets show up as icons on the map with a label and an integrity bar.
- The label tells you what was found (for example, "Cracked Maintenance Wall" or "Encrypted Transponder").
- The integrity bar shows the target's condition. Lower integrity means it is closer to breaking down or being bypassed.
- GM notes and hidden descriptions are never shown in your scan results. You only see what the GM has chosen to reveal.

### Things to Know

- You can only detect targets that are within your scan range and match the scan mode you are using.
- The GM controls which targets exist, which ones are revealable, and when they become resolved.
- Resolved targets no longer respond to scans. Once something is dealt with, it is done.
- Your scan fires from your token's position, so move closer to areas you want to investigate for better results.

## Settings

- **Scan Pulse Sound**: Set an audio file path to play a sound effect with each pulse.
- **Require Pulse Scanner Item**: When enabled, players need a Pulse Scanner item on their character to scan. When disabled, scanning works without the item.
- **Create World Pulse Scanner Item**: When enabled, the module automatically creates a scanner item in the world Items directory on load.
