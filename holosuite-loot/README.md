# HoloSuite Loot

HoloSuite Loot lets players right-click a defeated NPC in Foundry VTT, inspect its items, and collect them one stack at a time or with **Loot All**.

## What Does It Do?

- Transfers items and currency to the player's character and updates the looted NPC's inventory.
- Lets the GM set what drops for one corpse, an NPC actor, or matching items across the world.
- Rolls custom quantities when players collect loot. One grenade with a `2d6+2` rule awards the rolled number of grenades.
- Offers Holo, Neutral, and Fantasy themes for the loot popup.

## Installation

Requires **HoloSuite Core** and targets Foundry V13–V14. 
The following systems have expanded features (automatic deafeat detection) and were tested & validated.
D&D5e
Starfinder Second Edition
Savage Worlds Adventure Edition (SWADE)
Pathfinder 2e 
Dragonbane
Warhammer Fantasy Roleplay 4e
Star Wars FFG
Call of Cthulhu 7e 

Mothership (MoSh 0.6.1) supports Foundry V13–V14. It handles gear, the final wound, and numeric credit balances on NPCs built with the character sheet.

Pathfinder 1e supports Foundry V13. It handles physical gear and carried coins, and distinguishes dying NPCs from NPCs at their lethal HP threshold.

Install using the [Foundry manifest](https://raw.githubusercontent.com/Thuurvdv/HoloSuite/main/holosuite-loot/module.json), then enable HoloSuite Core and HoloSuite Loot in your world.

## Using HoloSuite Loot

**Players** right-click a lootable NPC, click an item to inspect it, then click **Loot** or **Loot All** to collect. Stay within loot range and make sure a GM is connected.

Right-clicking a lootable NPC opens or closes the Loot popup and consumes the complete gesture, preventing another module's token menu from opening alongside it. GM right-click controls and clicks on other tokens remain available.

**GMs** open **Loot** from the NPC's token HUD. Set when the NPC becomes lootable, or select items under **Inventory loot rules** to adjust what drops. If you edit the NPC's inventory after loot has been prepared, click the refresh icon to sync the corpse.

The GM's Loot panel includes **Keep linked actor**. When checked, looting a linked token removes items and currency from its world actor and keeps the token linked. Every token linked to that actor shares the depleted inventory. When unchecked, looting unlinks the token and depletes its synthetic inventory, preserving the world actor. Already unlinked tokens are unaffected.

Use **Keep linked actor by default** in the module's world settings to choose the default for tokens without a saved preference. It starts disabled to preserve existing behavior. Saving a token's Loot panel stores its own preference. Changing either option does not redirect transfers already in progress or relink tokens that were previously unlinked.

**In other systems**, open **Loot**, set the token to **Always lootable**, check the items players can take, and click **Save**. Items transfer whole, with their system data intact. To update the selection or sync changed items, reopen **Loot** and save again.

## Module Settings

- **Loot range** defaults to 15 ft. Set it to 0 to disable the distance limit.
- **Automatic defeat detection** makes defeated, dead, or zero-HP NPCs lootable by default in supported systems.
- **Show character selector** lets players choose which owned character receives loot.
- **Chat log** posts successful pickups to public chat.
- **Loot Panel Theme** changes the look of the popup for the world.
