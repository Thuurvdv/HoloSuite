# HoloSuite

HoloSuite is a collection of Foundry VTT modules built for sci-fi, cyberpunk, and space-opera tabletop games. Each module adds a specific tool to your sessions, and they all connect through a shared launcher called HoloSuite Core.

## The Modules

- **[HoloSuite Core](holosuite-core/README.md)** - A free in-world phone launcher that gives the GM one-click access to every installed HoloSuite app.
- **[CyberCall](CyberCall/README.md)** - Holographic communication overlays with caller portraits, signal effects, ringtones, and player-to-GM calling.
- **[Security Cameras](security-cameras/README.md)** - A surveillance camera system with live and static feeds, cyberpunk overlays, and GM-to-player broadcasting.
- **[CSI Toolkit](csi-toolkit/README.md)** - Interactive case boards for investigations, with draggable evidence cards, connection lines, timelines, and collaborative player editing.
- **[Galaxy Map](galaxy-map/README.md)** - Cinematic star maps with clickable systems, travel routes, ship animations, and discovery notifications.
- **[Pulse Scanner](pulse-scanner/README.md)** - Scene-scanning gameplay with hidden targets, scan modes, pulse animations, and player scanner items.
- **[Bounty Board](bounty-board/README.md)** - A bounty contract board for posting and browsing sci-fi jobs and contracts.
- **[Critical Cut-In](holosuite-critical-cutin/README.md)** - Anime-style critical hit animations triggered by natural d20 rolls, with per-character images, sounds, and overlay text.
- **[HoloSuite Hacking](holosuite-hacking/README.md)** - Interactive hacking minigames where skill checks determine puzzle difficulty. Includes Node Intrusion and Signal Alignment.

## Getting Started

1. Install Foundry VTT (v12 or v13).
2. Copy the module folders you want into your Foundry `Data/modules` directory.
3. Enable **HoloSuite Core** first, then enable whichever feature modules you want to use.
4. Each feature module also works on its own if you prefer not to use the shared launcher.

## For Developers

Install dependencies from the repository root:

```bash
npm install
```

Build every module:

```bash
npm run build
```

Or build a single module:

```bash
npm run build -w @holosuite/core
npm run build -w @holosuite/CyberCall
```

Each module keeps its source code in `src/` and the Foundry-loaded output in `dist/`. The `module.json` in each module points Foundry at `dist/main.js`.

For local development, symlink or copy module folders into Foundry's `Data/modules` directory.
