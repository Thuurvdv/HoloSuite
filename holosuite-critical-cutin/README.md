# HoloSuite Critical Cut-In

HoloSuite Critical Cut-In adds dramatic anime-style critical hit animations to your Foundry VTT game. When a player rolls a qualifying natural result on a d20, a full-screen cut-in flashes across every connected screen with the character's portrait, a custom sound effect, and an overlay label. It turns a lucky roll into a memorable cinematic moment.

## What Does It Do?

- Watches for d20 rolls and triggers a visual cut-in animation when the natural result meets or exceeds a configurable threshold.
- Each player character can have their own custom cut-in setup: unique image, sound effect, animation style, overlay text, and accent color.
- The GM can set a global threshold (for example, natural 20 only, or natural 19 and above) and also override the threshold per character.
- A GM cut-in configuration covers rolls that do not belong to a specific player character.
- The cut-in duration is adjustable so you can control how long the animation stays on screen.
- Works on its own, and also registers in the HoloSuite launcher if HoloSuite Core is installed.

## Tutorial: Using Critical Cut-In as a DM

### Initial Setup

1. Enable **HoloSuite Critical Cut-In** in your Foundry world.
2. Open **Configure Settings**, then go to **Module Settings** and find **HoloSuite Critical Cut-In**.
3. Set the **default trigger threshold**. The default is 20, meaning only natural 20s trigger the animation. Setting it to 19 triggers on both natural 19 and 20.
4. Click **Configure Player Cut-Ins** to open the per-character configuration panel.

### Configuring Player Cut-Ins

1. Each player-owned actor in the world gets a row in the configuration panel.
2. For each actor, you can set:
   - **Enable/Disable**: Turn the cut-in on or off for that character.
   - **Minimum Roll**: Set a custom threshold for this character. Leave it blank to use the global default.
   - **Animation Style**: Choose how the cut-in animates onto the screen.
   - **Image**: Pick a custom image for the cut-in. If you leave this blank, the actor's portrait is used automatically.
   - **Audio**: Select a sound effect that plays during the cut-in.
   - **Overlay Label**: Set the text that flashes on screen (like "CRITICAL HIT" or a character catchphrase).
   - **Accent Color**: Choose a color that tints the cut-in border and effects.
3. The **GM Cut-In** row at the top covers any rolls the GM makes that do not match a configured player actor.
4. Adjust the **global duration** field to control how many milliseconds the animation stays visible.

### Using It in Play

Once configured, the module runs automatically. Qualifying rolls trigger the cut-in with no extra input needed. You can also trigger a cut-in manually for testing or dramatic effect by running a macro.

### Tips

- Put character art into the `modules/holosuite-critical-cutin/assets/images/` folder and sound effects into `modules/holosuite-critical-cutin/assets/sounds/` for easy access from the file picker.
- Keep cut-in durations short (1500 to 2500 milliseconds) so they feel punchy and do not interrupt the flow.
- Use custom overlay labels to give each character a signature phrase.

## Tutorial: Using Critical Cut-In as a Player

### What You See

1. Roll a d20 as part of normal gameplay (attacks, skill checks, saves, etc.).
2. If your natural roll meets or exceeds the threshold your GM has set, a cut-in animation fires across the screen.
3. Your character's portrait (or custom image), sound effect, and overlay text flash on screen for a moment before fading away.
4. That is it. There is nothing you need to do. The module handles everything automatically based on your rolls.

### Things to Know

- The GM controls the trigger threshold and all visual settings. If you want a custom image or catchphrase for your character's cut-in, talk to your GM about setting it up.
- The cut-in is purely visual and does not affect game mechanics. It is a celebration of a great roll, nothing more.
- If your GM has not configured a cut-in for your character, the module will use your actor portrait as a fallback image.
