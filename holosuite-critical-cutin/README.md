# HoloSuite Critical Cut-In

A HoloSuite-compatible Foundry VTT module that plays a legally distinct sci-fi anime critical cut-in when a qualifying natural d20 result is rolled.

## Setup

1. Install and enable `HoloSuite Critical Cut-In`.
2. Open **Configure Settings > Module Settings > HoloSuite Critical Cut-In**.
3. Set the default trigger threshold. The default is `20`; setting it to `19` triggers on natural `19` and `20`.
4. Open **Configure Player Cut-Ins** to assign each player-owned actor a minimum roll, animation style, image, audio sample, overlay label, accent color, and enable state. Leave a row's minimum roll blank to use the default threshold. If no custom image is set, the actor portrait is used automatically.
5. Use the **GM Cut-In** row for GM-authored rolls that do not map to a configured player actor.

The configuration panel also includes a global duration field in milliseconds. This controls how long the animation remains visible and how long the cut-in moment is paced around the audio sample.

Images and audio can live anywhere Foundry can serve them. The included folders are ready for your own assets:

```text
modules/holosuite-critical-cutin/assets/images/
modules/holosuite-critical-cutin/assets/sounds/
```

## HoloSuite

If HoloSuite Core is active, this module registers a **Critical Cut-In** entry in the HoloSuite GM command panel. If HoloSuite is missing or disabled, the module still works through standard Foundry settings.

## Manual API

```js
game.modules.get("holosuite-critical-cutin").api.playCutinForUser(game.user.id);
game.modules.get("holosuite-critical-cutin").api.playCutinForActor("ACTOR_ID");
game.modules.get("holosuite-critical-cutin").api.openConfig();
```

## Testing

As GM, configure a player or actor, set the threshold to `20`, then roll:

```js
new Roll("1d20").toMessage({ speaker: ChatMessage.getSpeaker({ actor: canvas.tokens.controlled[0]?.actor }) });
```

For a guaranteed manual visual test:

```js
game.modules.get("holosuite-critical-cutin").api.playCutinForUser(game.user.id, { overlayText: "HOLO STRIKE" });
```
