# HoloSuite Loot

HoloSuite Loot lets players right-click a defeated NPC in Foundry VTT, inspect its items, and collect them one stack at a time or with **Loot All**.

## What Does It Do?

- Transfers items and currency to the player's character and updates the looted NPC's inventory.
- Lets the GM set what drops for one corpse, an NPC actor, or matching items across the world.
- Rolls custom quantities when players collect loot. One grenade with a `2d6+2` rule awards the rolled number of grenades.
- Offers Holo, Neutral, and Fantasy themes for the loot popup.

## Installation

Requires **HoloSuite Core** and targets Foundry V13–V14. D&D5e and Starfinder Second Edition have built-in support for automatic defeat detection, stack quantities, and currency. Savage Worlds Adventure Edition (SWADE) supports defeated or dead NPCs and stack quantities for weapons, armor, shields, gear, and consumables. Abilities, Edges, Hindrances, skills, powers, ancestry, natural armor, and granted items stay off the loot list. Other game systems use manual loot selection.

Install using the [Foundry manifest](https://raw.githubusercontent.com/Thuurvdv/HoloSuite/main/holosuite-loot/module.json), then enable HoloSuite Core and HoloSuite Loot in your world.

## Using HoloSuite Loot

**Players** right-click a lootable NPC, click an item to inspect it, then click **Loot** or **Loot All** to collect. Stay within loot range and make sure a GM is connected.

**GMs** open **Loot** from the NPC's token HUD. Set when the NPC becomes lootable, or select items under **Inventory loot rules** to adjust what drops. If you edit the NPC's inventory after loot has been prepared, click the refresh icon to sync the corpse.

**In other systems**, open **Loot**, set the token to **Always lootable**, check the items players can take, and click **Save**. Items transfer whole, with their system data intact. To update the selection or sync changed items, reopen **Loot** and save again.

## Module Settings

- **Loot range** defaults to 15 ft. Set it to 0 to disable the distance limit.
- **Automatic defeat detection** makes defeated, dead, or zero-HP NPCs lootable by default in supported systems.
- **Show character selector** lets players choose which owned character receives loot.
- **Chat log** posts successful pickups to public chat.
- **Loot Panel Theme** changes the look of the popup for the world.
