# HoloSuite Hacking

HoloSuite Hacking brings interactive hacking minigames to your Foundry VTT sessions. Instead of resolving a hack with a single dice roll, this module puts the player in a timed puzzle where their roll determines the difficulty. It currently includes two minigames, with more planned.

## What Does It Do?

- Adds playable hacking minigames that the GM can launch for any player during a session.
- **Node Intrusion**: The player navigates through a connected network of nodes, avoiding firewalls and dead ends, trying to reach the target node before a trace timer runs out.
- **Signal Alignment**: The player tunes unstable signal channels into their target range and holds them steady until a transmission decrypts.
- Difficulty scales with the player's skill check. A good roll makes the puzzle easier (more time, more hints, fewer traps). A bad roll makes it harder.
- The GM picks the minigame, selects a player and their character's hacking skill, sets a DC, and sends the challenge. The player's client rolls the skill check and launches the minigame based on the result.
- Works on its own, and also shows up in the HoloSuite launcher if HoloSuite Core is installed.

## How Difficulty Works

When the GM sends a hacking challenge, the player's skill check is compared to the DC. The margin of success or failure determines one of five difficulty profiles:

- **Critical Success** (beat the DC by 10 or more): Long trace timer, extra hints, fewer obstacles. The player is in total control.
- **Strong Success** (beat the DC by 5 or more): Comfortable difficulty with a reasonable margin for error.
- **Success** (met or beat the DC): Standard difficulty. The puzzle is fair but requires focus.
- **Failure** (missed the DC): The puzzle is harder. Less time, fewer hints, more obstacles. Still playable, but tense.
- **Critical Failure** (missed the DC by 10 or more): Maximum difficulty. Very little time, almost no hints, dense obstacles. It is meant to feel desperate.

## Tutorial: Using HoloSuite Hacking as a DM

### Launching a Hack

1. Enable **HoloSuite Hacking** in your Foundry world.
2. Open the hacking launcher from the terminal button in the scene controls, or through the HoloSuite launcher.
3. In the launcher, choose:
   - The **minigame** (Node Intrusion or Signal Alignment).
   - The **actor** who is doing the hacking.
   - The **player** who owns that actor.
   - The **skill** to roll (this comes from the actor's sheet).
   - The **DC** for the check.
4. Click **Send Challenge**. The selected player receives a prompt asking them to accept.
5. When the player accepts, their client rolls the skill check and the minigame opens at the appropriate difficulty.

### Watching the Result

- The minigame runs on the player's screen. You can watch over their shoulder or wait for the result.
- When the player succeeds or fails, the result is reported so you can narrate the outcome.

### Adjusting Settings

- **Default Hacking DC**: Sets the default DC in the launcher so you do not have to type it every time.
- **Default Trace Duration Multiplier**: Scales all trace timers up or down. Increase this to give players more breathing room, or decrease it for a faster pace.
- **Visual Glitch Intensity**: A client-side setting (low, medium, or high) that controls how much visual noise the minigame displays. Players can set this to their own preference.

### Tips

- Match the minigame to the fiction. Use Node Intrusion for breaking into a corporate server or bypassing a security grid. Use Signal Alignment for intercepting encrypted transmissions or tuning into a hidden frequency.
- Set the DC based on the narrative stakes, not just the character's skill bonus. An important corporate mainframe should be harder than a vending machine terminal.
- Use the difficulty scaling to your advantage. Even a failed check still lets the player attempt the puzzle, just at a much higher difficulty. That moment of tension can be more memorable than an automatic failure.

## Tutorial: Using HoloSuite Hacking as a Player

### Accepting a Challenge

1. When the GM sends you a hacking challenge, a prompt appears on your screen asking you to accept.
2. Click **Accept**. Your client rolls the selected skill against the DC.
3. The minigame opens, and the difficulty depends on how well you rolled.

### Playing Node Intrusion

1. You see a network of connected nodes. Your goal is to reach the target node before the trace timer fills up.
2. Click on adjacent nodes to move through the network.
3. Avoid firewall nodes (they cost you time or block your path) and dead ends.
4. Reach the target node before the trace catches you to succeed.
5. If the trace completes before you reach the target, the hack fails.

### Playing Signal Alignment

1. You see one or more signal channels with fluctuating values.
2. Use the controls to tune each channel into its target range (shown as a highlighted zone).
3. Hold all channels within their targets at the same time until the transmission decrypts.
4. If you cannot hold lock long enough, the signal is lost and the hack fails.

### Things to Know

- A better skill check gives you an easier puzzle. A worse check makes it harder, but you still get to play.
- Even on a critical failure, you can attempt the puzzle. It will be very difficult, but not impossible.
- The trace timer is always running. Work quickly but carefully.
- You can adjust the **Visual Glitch Intensity** in module settings if the visual effects are too distracting or not intense enough for your taste.
