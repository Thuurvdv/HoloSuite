# HoloCall

HoloCall is a minimal Foundry VTT v12/v13 module that adds a sci-fi hologram communication overlay for fantasy, cyberpunk, and space games.

## Features

- Scene control button on the Token controls toolbar.
- GM-only HoloCall Composer interface for creating calls at the table.
- Player HoloCall Contacts interface when no call is active.
- Player-to-GM call requests from contacts.
- Macro-accessible API for opening and closing a HoloCall window.
- GM broadcast API and in-window GM-only broadcast button.
- Draggable and resizable Foundry application window.
- Fullscreen broadcast mode for table-wide transmissions.
- Caller name, subtitle/faction, portrait URL, message, and signal strength.
- Incoming call ringing animation.
- Per-user selectable OGG ringtone setting.
- Player role permission setting for opening and receiving HoloCalls.
- Personal and group contact directories with persisted name and number entries.
- Standard blue, emergency red, and corrupted green variants.
- Caller portraits retain their source colors instead of being tinted by the hologram variant.

## File Structure

```text
holocall/
  module.json
  README.md
  Ringtone1.ogg
  Ringtone2.ogg
  Ringtone3.ogg
  scripts/
    holocall.js
  styles/
    holocall.css
  templates/
    holocall.hbs
    holocall-composer.hbs
    holocall-contacts.hbs
```

## Installation for Local Development

1. Copy this `holocall` folder into your Foundry user data modules directory:

   ```text
   FoundryVTT/Data/modules/holocall
   ```

2. Start Foundry VTT.
3. Open your world.
4. Go to **Manage Modules** and enable **HoloCall**.
5. Reload the world after enabling the module.

For active development, you can also symlink this folder into `Data/modules/holocall` so edits are picked up after a Foundry reload.

## How to Test

1. Enable the module in a world.
2. Open a scene.
3. Select the Token controls tab in the left scene controls.
4. As GM, click the satellite dish button named **Compose HoloCall**.
5. Fill in caller name, faction/subtitle, portrait path, message, signal, variant, fullscreen, and ringing options.
6. Click **Preview Locally** to test the overlay on the GM client.
7. Click **Broadcast to Players** to show it to connected players.
8. Click **Accept** from any connected client; the message collapses for everyone and the call shows only the caller image with **End Call**.
9. Click **End Call** from any connected client; the overlay closes for everyone.

Players who meet the configured minimum role get a **HoloCall Contacts** scene control when no call is active.

Player contacts test:

1. Log in as a player who meets the configured minimum role.
2. Click the HoloCall scene control when no call is active.
3. Add a personal contact with a name and number.
4. Reload Foundry and open the HoloCall scene control again.
5. Confirm the contact is still listed.
6. Click **Call** to send a call request to the GM.
7. Confirm the GM receives an incoming HoloCall screen and can click **Accept**.
8. Confirm both the player and GM transition into the connected call screen.

Group contacts test:

1. Open **HoloCall Contacts** as a player.
2. Switch to the **Group** tab.
3. Add a contact with a name and number while a GM is connected.
4. Open **HoloCall Contacts** as another player.
5. Confirm the group contact is visible there too.

## Example Macro

Create a script macro in Foundry and run:

```js
game.modules.get("holocall").api.openCall({
  callerName: "Captain Voss",
  subtitle: "ATLAS Corporation",
  image: "path/to/image.webp",
  message: "Officer, we have a situation.",
  signal: 72,
  variant: "standard",
  fullscreen: false
});
```

Emergency variant:

```js
game.modules.get("holocall").api.openCall({
  callerName: "Commander Ilya Rane",
  subtitle: "Orbital Defense Grid",
  image: "icons/svg/hazard.svg",
  message: "Priority red. Evacuate the lower decks immediately.",
  signal: 41,
  variant: "emergency",
  fullscreen: true
});
```

Corrupted signal variant:

```js
game.modules.get("holocall").api.openCall({
  callerName: "Unknown Relay",
  subtitle: "Signal Origin Spoofed",
  image: "",
  message: "Do not trust the clean channel. They are already listening.",
  signal: 19,
  variant: "corrupted"
});
```

GM broadcast to every connected client:

```js
game.modules.get("holocall").api.broadcastCall({
  callerName: "Captain Voss",
  subtitle: "ATLAS Corporation",
  image: "path/to/image.webp",
  message: "All teams, switch to emergency channel now.",
  signal: 72,
  variant: "standard",
  fullscreen: true
});
```

Open the GM composer from a macro:

```js
game.modules.get("holocall").api.openComposer();
```

Open the player contacts interface from a macro:

```js
game.modules.get("holocall").api.openContacts();
```

Close the active call:

```js
game.modules.get("holocall").api.closeCall();
```

## Using Actor Portraits

You can pass any actor image path into `image`:

```js
const actor = game.actors.getName("Captain Voss");

game.modules.get("holocall").api.openCall({
  callerName: actor?.name ?? "Unknown Caller",
  subtitle: "ATLAS Corporation",
  image: actor?.img,
  message: "Officer, we have a situation.",
  signal: 72,
  variant: "standard"
});
```

## Settings

HoloCall registers one client setting:

- **Default Signal Strength**: used by the scene control demo button when no custom signal is provided.
- **Incoming Call Ringtone**: per-user ringtone dropdown that loops while a call is ringing. Choose **Silent** for no ringtone.
- **HoloCall Contacts**: hidden client setting used to persist the player's local contact directory.

HoloCall registers one world setting:

- **Minimum Player Role**: minimum role allowed to open local HoloCalls and receive GM broadcasts. GMs always have access.
- **HoloCall Group Contacts**: hidden world setting used to persist the shared group contact directory.

## Known Limitations

- This MVP opens one call window at a time.
- Accept and End Call synchronize over the module socket for connected clients with the active call open.
- Decline and End Call both close the active call for both sides.
- Personal contacts are stored per client/browser.
- Group contacts are shared through the world and require a connected GM for player edits.
- The selected ringtone is client-side only and depends on the browser/Electron allowing audio playback.
- The scene control button is added to Token controls only.
- No localization files are included yet.
- No backend, database, external paid services, or AI text features are used.
