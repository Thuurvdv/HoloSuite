# HoloSuite Core

HoloSuite Core is the foundation of the HoloSuite module family for Foundry VTT. It adds a customizable in-world phone launcher to your game, giving the GM a single place to open any installed HoloSuite app. Think of it as a sci-fi command center on your screen: one tap and you're into security cameras, hacking minigames, bounty boards, or whatever other HoloSuite modules you have enabled.

HoloSuite Core is free and always will be.

## What Does It Do?

- Adds a phone-style app launcher that the GM can open during a session.
- Every HoloSuite module you install automatically shows up in the launcher as an app tile with its own icon and description.
- Lets each user press and hold an app tile, drag apps into a custom order, and save that order locally.
- Keeps everything organized so you do not need to hunt through scene controls or remember console commands.

## Tutorial: Using HoloSuite Core as a DM

1. Install and enable **HoloSuite Core** in your Foundry world before enabling any other HoloSuite modules.
2. Enable any HoloSuite feature modules you want (CyberCall, Security Cameras, CSI Toolkit, etc.). Each one will automatically register itself in the launcher.
3. During a session, open the HoloSuite launcher from the scene controls or by running `game.holosuite.open()` in a macro.
4. Click any app tile to open that module's main window.
5. Press and hold an app tile until all tiles begin to move, drag it into place, then select **Done**. The order is saved for your user.

## Tutorial: Using HoloSuite Core as a Player

HoloSuite Core's launcher is currently GM-only, so players do not interact with it directly. Players interact with each individual module through their own interfaces. For example, players receive CyberCalls, view security camera feeds, browse case boards, and trigger scanner pulses through each module's player-facing features.

As the suite grows, player-facing launcher features may be added in the future.

## CSS performance diagnostic

Foundry's **Configure Settings → Module Settings → HoloSuite Core** section includes client-side controls for controlled performance comparisons:

- **Debugging: API-Only Mode (This Browser)** preserves Core's public registration API while suppressing its launcher and related UI work.
- **Debugging: Disable HoloSuite Core CSS (This Browser)** removes Core's shared tokens and launcher stylesheet without disabling its JavaScript or registration API.
- **Debugging: Disable Core Visual Effects (This Browser)** preserves layout and colors while removing Core launcher animations, transitions, filters, shadows, and glows.
- **HoloSuite Core Diagnostics** opens a read-only panel that can copy or download the exact module, browser, stylesheet, launcher, theme, chat-count, and diagnostic-setting state as JSON.

These controls are intended only for debugging. HoloSuite interfaces will appear unstyled while Core CSS is disabled. Diagnostic reports remain local until the user explicitly copies or downloads them.
