# Security Cameras

Security Cameras is a Foundry VTT module that gives the GM a full surveillance camera system for sci-fi and cyberpunk games. Set up cameras across your scenes, then broadcast live or static feeds to your players during gameplay. Every feed comes wrapped in a stylish cyberpunk UI with scanlines, recording indicators, and signal effects.

## What Does It Do?

- Lets the GM create, organize, and manage security cameras across any scene in the world.
- Cameras can show a live view of a specific area on the canvas or display a static image (like a pre-made screenshot or a "last known" still).
- Each camera has a status that controls what players see: online, offline, corrupted, or restricted. Offline cameras show a signal loss screen. Corrupted cameras display a glitched feed. Restricted cameras show an access denied overlay.
- The GM can push a camera feed to all players with one click, and close all player feeds just as easily.
- Feeds can appear in a draggable window or as a compact picture-in-picture overlay.
- Cameras can be linked to Foundry v13 Scene Regions so the feed automatically frames a specific area of the map.

## Tutorial: Using Security Cameras as a DM

### Setting Up Cameras

1. Enable **Security Cameras** in your Foundry world.
2. Open a scene and find the video camera icon in the Token controls on the left sidebar. Click it to open the **Camera Manager**.
3. Click **New** to create your first camera. The scene field defaults to whichever scene you have open.
4. Give the camera a name and location label (for example, "Lobby Cam 01" in "Corporate Lobby").
5. Choose a feed source:
   - **Live Canvas** captures a real-time view of an area on the current scene. Link a Foundry v13 Scene Region to frame the shot.
   - **Static Image** displays a fixed image file. Use Foundry's file picker to select the image.
6. Set the camera's status to **Online** (or leave it as-is and change it later for dramatic effect).
7. Choose a display mode: **Window** opens a draggable feed panel, while **Picture-in-Picture** keeps it compact and out of the way.
8. Save the camera. You can create as many as you need.

### Running Cameras During a Session

1. Open the Camera Manager.
2. Select a camera from the list.
3. Click **Show to Players** to broadcast that camera's feed to everyone.
4. Players will see the feed appear on their screens with the cyberpunk overlay matching the camera's current status.
5. Change a camera's status mid-session to create tension. Switch a camera to **Corrupted** when something goes wrong, or to **Offline** when an enemy cuts the feed.
6. Click **Close All Player Feeds** when you want to pull every feed off the players' screens at once.
7. Use **Duplicate** to quickly create variants of an existing camera (useful for multi-camera hallways or repeating setups).

### Tips

- Set up cameras before the session and leave them offline. Reveal them one at a time as players gain access to the security system.
- Use static images for cameras that are "recording playback" or showing archived footage.
- Combine camera statuses with narrative beats. A corrupted feed right before an ambush tells the players something is very wrong without saying a word.

## Tutorial: Using Security Cameras as a Player

### Viewing Camera Feeds

1. When the GM broadcasts a camera feed, it appears on your screen automatically.
2. The feed window shows the camera name, location, and a live or static image inside a cyberpunk-styled frame.
3. If the camera is **online**, you see the feed normally with a REC indicator.
4. If the camera is **offline**, you see a "Signal Lost" screen.
5. If the camera is **corrupted**, the feed shows heavy visual glitching.
6. If the camera is **restricted**, you see an "Access Denied" overlay.
7. You can drag and reposition the feed window. The GM controls when feeds open and close.

### Things to Know

- You cannot open camera feeds on your own. The GM decides which cameras to share and when.
- If the GM closes all feeds, your camera windows will close automatically.
- For live canvas feeds, you need to be on the same scene as the camera for the feed to update in real time. If you are on a different scene, the feed may show a fallback image instead.
