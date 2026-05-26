# HoloSuite Hacking

HoloSuite Hacking is a standalone Foundry VTT module that hosts reusable hacking minigames. It currently includes:

- **Node Intrusion**: move through a connected node graph, avoid firewalls and dead ends, and reach the target before trace completes.
- **Signal Alignment**: tune unstable signal channels into their target tolerance and hold lock until the transmission decrypts.

The module is designed to work on its own now and register with **HoloSuite Core** later when available.

## Installation

Copy or symlink the `holosuite-hacking` folder into Foundry's `Data/modules` directory, then enable **HoloSuite Hacking** in your world.

The module metadata lives in `module.json` and loads:

- `scripts/main.js`
- `styles/hacking.css`
- `styles/node-intrusion.css`
- `styles/signal-alignment.css`

## GM Launcher

As a GM, use the scene-control terminal button to open the HoloSuite Hacking launcher. Choose:

- the minigame
- the hacker actor
- the player who owns that actor
- the exact actor skill to roll
- the DC

The selected player receives an accept prompt. When they accept, their client rolls the chosen skill against the DC and the roll total determines the minigame difficulty.

## Local Testing

Console smoke tests:

```js
game.modules.get("holosuite-hacking").api.testNodeIntrusion();
game.modules.get("holosuite-hacking").api.testSignalAlignment();
```

## API Examples

Start a minigame by type:

```js
game.modules.get("holosuite-hacking").api.startHack({
  type: "node-intrusion",
  rollTotal: 17,
  dc: 15,
  onSuccess: (result) => console.log("Hack succeeded", result),
  onFailure: (result) => console.log("Hack failed", result)
});
```

```js
game.modules.get("holosuite-hacking").api.startHack({
  type: "signal-alignment",
  rollTotal: 17,
  dc: 15,
  onSuccess: (result) => console.log("Signal locked", result),
  onFailure: (result) => console.log("Signal lost", result)
});
```

Convenience methods:

```js
game.modules.get("holosuite-hacking").api.startNodeIntrusion({
  rollTotal: 22,
  dc: 15
});

game.modules.get("holosuite-hacking").api.startSignalAlignment({
  rollTotal: 12,
  dc: 15
});
```

The API is also exposed at:

```js
game.holosuiteHacking
```

## Settings

The module registers these settings during `init`:

- **Default Hacking DC**: used by the launcher and API calls that omit `dc`.
- **Default Trace Duration Multiplier**: scales trace timers across minigames.
- **Allow Players To Interact Directly**: reserved for future player-targeted play, default `false`.
- **Visual Glitch Intensity**: client-side visual preference, `low`, `medium`, or `high`.

## Difficulty

Use `getDifficultyProfile(rollTotal, dc)` to map a roll into one of five profiles:

- `critical_success`: roll is at least DC + 10
- `strong_success`: roll is at least DC + 5
- `success`: roll meets or beats DC
- `failure_but_playable`: roll misses DC
- `critical_failure`: roll is DC - 10 or worse

Profiles return shared values such as trace duration, mistake limit, hints, and visual glitch intensity, plus minigame-specific values for Node Intrusion and Signal Alignment.

## What Is Roll Total?

`rollTotal` is the final number from the actor skill check after modifiers. Direct API calls can still provide it for automation and testing, but the GM launcher now asks for an actor skill instead and rolls that skill on the player's client after they accept.

## Adding Another Minigame

1. Create a folder under `scripts/minigames/<your-minigame>`.
2. Keep puzzle generation/state helpers separate from the Application class.
3. Add a template in `templates/`.
4. Add styles in `styles/`.
5. Import the Application in `scripts/main.js`.
6. Register it with `registerMinigame({ id, title, icon, create })`.
7. Add any profile-specific difficulty fields to `scripts/core/difficulty.js`.

Minigames should stop intervals/timeouts in `close()` and should be launchable through `api.startHack({ type })`.

## HoloSuite Core Notes

This module does not require HoloSuite Core. If `holosuite-core` is active and exposes `registerApp`, HoloSuite Hacking registers a free app entry named **HoloSuite Hacking**. You can also force registration from the console:

```js
game.modules.get("holosuite-hacking").api.registerWithHoloSuite();
```

HoloSuite Core's current launcher is GM-only, so this app appears in the GM HoloSuite launcher. Players receive hacking prompts through the socket challenge flow, not through the HoloSuite app grid yet.

TODO:

- Replace the current standalone socket flow with a Core routing layer.
- Add richer app manifests once HoloSuite Core defines them.
- Add result reporting back to a GM control surface.
- Keep supporter/licensing logic in HoloSuite Core metadata only. Do not add DRM here.
