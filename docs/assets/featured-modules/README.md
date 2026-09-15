# Featured module artwork

## Current artwork (owner update)

The homepage now has one **HoloSuite Modules** grid containing every record in
`modules`, in data order. The old catalogue markup and renderer are removed.
`featuredModules` is optional presentation metadata only; it no longer selects
or limits which modules appear. All/Free/Premium filters operate on framed cards,
and their `module-ID` anchors preserve existing links. Each frame has a steady
tier-colored drop-shadow glow, slightly brighter on hover or keyboard focus.
Additional source icons copied for this grid: `cybercall.svg`, `csi-toolkit.svg`,
`holosuite-critical-cutin.svg`, `holosuite-hacking.svg`, `holodock.svg`, `Blueprint.svg`.
Core currently has no explicitly identified icon; Terminal still needs an export.

`card-frame-a.svg` is the owner's pink/purple premium frame; `card-frame-b.svg`
is the cyan free frame. Both are 480 × 560 with Inkscape viewBox
`0 0 127 148.16667`. Keep `preserveAspectRatio="none"` on both root SVGs:
without it, taller cards letterbox the artwork even with background-size 100%.
The header and footer have extra clearance for the top and bottom center notches.
Frame choice follows the module's tier, never its visual variant.

The five active icons are unchanged copies from `Z:\Neon\AssetBuilding\Icons`:
`GalaxyMap.svg`, `pulseScanner.svg`, `security-cameras.svg`,
`BountyBoardIcon.svg`, and `VendingMachines.svg`. They display at 30 × 30,
with CSS inversion to make the black source artwork visible. Terminal has no
header icon until a web-ready export is supplied (the source folder has a PSD).
Card taglines, extra indicator lines and the old goo overlay are no longer used.
The full catalogue is always visible; its filters and legacy anchors still work.

The original placeholder inventory below is retained for reference. Frame A/B
and the five icons above supersede their placeholder contracts. Frame C, the old
`icon-*.svg` files and `goo-corner.svg` are no longer referenced by the cards.

The original placeholder SVGs in this directory are simple geometry. They contain
no raster images, external resources, scripts, fonts, or SVG filters. Replace them
with your artwork under the same filenames. No component edits are required.

## Replace these first

1. `placeholder-terminal.svg`: replace the temporary wireframe with Terminal artwork
   or a screenshot inside the same SVG file. If you prefer PNG/WebP, change only
   the `preview` filename in the Terminal entry of `site-data.json`.
   Remove the placeholder caption by switching that entry to `previewIsFinal: true`.
2. `card-frame-a.svg`, `card-frame-b.svg`, `card-frame-c.svg`: redraw the hardware.
3. The three badge backgrounds, then the six icons. The small goo accent is optional.

## Asset contracts

| Files | ViewBox / recommended art size | Layout behavior |
| --- | --- | --- |
| `card-frame-a.svg` | 0 0 480 560 | Bevelled frame for Galaxy Map, Scanner and Bounty Board. |
| `card-frame-b.svg` | 0 0 480 560 | Heavy rails for Terminal and Security Cameras. |
| `card-frame-c.svg` | 0 0 480 560 | Rounded housing for Vending Machines. |
| `badge-free.svg`, `badge-premium.svg`, `badge-status.svg` | 0 0 160 60 | Sticker backgrounds scaled proportionally; real HTML text overlays them. |
| `icon-galaxy.svg`, `icon-terminal.svg`, `icon-scanner.svg`, `icon-camera.svg`, `icon-bounty.svg`, `icon-vending.svg` | 0 0 48 48 | Square, decorative icons, displayed at 40 × 40 CSS pixels. |
| `goo-corner.svg` | 0 0 80 72 | Vending frame's top-right overlay; contained, never cropped. |
| `section-divider.svg` | 0 0 1200 12 | Header separator, stretched horizontally to section width. |
| `placeholder-terminal.svg` | 0 0 800 500 | Temporary Terminal preview; displayed with object-fit: contain. |

Frames fill the card using `background-size: 100% 100%` and
`preserveAspectRatio="none"`. Their proportions change with content and viewport.
Keep frame art in the outer 20 viewBox units, and keep the center suitable as a
dark text background. The HTML content starts roughly 25 CSS pixels inside the
frame. Frames do not clip content and cannot intercept clicks. Transparent cut
corners show the section background. Avoid drawing text or detailed imagery into
the frame because it would stretch.

Keep the existing viewBoxes, SVG width/height behavior, and safe areas when
replacing art. A changed viewBox will still render, but may distort corner sizes,
shift artwork under text, or change the scale of icons and stickers. The frame
viewBoxes are independent of preview images: replacing a frame does not crop a
screenshot. Badge artwork should leave a clear center for the HTML label and
retain its own small offset shadow. Do not bake Free/Premium/New text into SVGs.

Existing real previews remain in `docs/assets/`: Galaxy Map Manager.png,
CameraFeed.jpg, PulseScanner-preview.png, BountyBoard.jpg, VendingMachines.webp.
For replacements, aim for 1600 × 1000 (8:5); 800 × 500 is the minimum recommended
size. Other ratios work: object-fit: contain shows the whole image against dark
letterboxing. These original files are also used elsewhere on the site, so to
change only this showcase add a `preview` filename under this directory to that
featured entry. Set `previewIsFinal: true` for final screenshots/artwork.

## Data and reusable helpers

`site-data.json` → `featuredModules` defines six module IDs, ordering, visual
variants, local icon filenames and short taglines. Module name, description,
tier, compatibility and links come from the existing `modules` collection.
No product data is duplicated. Existing module data and docs are unchanged.

`featured-modules.js` provides `featuredModuleCard`, `featuredModulePreview` and
`moduleBadge`. `moduleBadge("free")` and `moduleBadge("premium")` use the same
template; `updated`, `new`, and `beta` use the cyan status sticker. To show a real
release status, add e.g. `"status": "updated"` to a featured entry. No statuses
are currently asserted. Unknown statuses are ignored. Optional preview overrides
are filenames relative to this directory. Icons use the same convention.

Visual variants: `navigation`, `industrial`, `scanner`, `surveillance`,
`contracts`, `organic`. They choose between three shared frames and a small set
of color/trim differences. The goo overlay is used only by `organic`. Palette and
frame variables are near the top of `featured-modules.css`; SVG colors can be
edited independently in your artwork editor.

## Architecture decisions and later artwork work

- This is a static HTML/JS site, so helpers return HTML strings; no framework added.
- `docs/` is the existing complete module listing and the All Modules destination.
- The original 13-module catalogue remains in the same homepage section inside a
  disclosure, with its All/Free/Premium filters and original resource links.
  Existing `#module-ID` links open that disclosure automatically.
- Only the new six-card showcase uses the physical stickers. Documentation pages
  keep their plain-text metadata from the previous design.
- The informal header uses the site's current fonts. A custom lettering asset can
  replace its treatment later; keep the actual sentence as accessible HTML text.
- Final illustrations, detailed hardware and any custom lettering are intentionally
  deferred to the owner. This pass supplies the replaceable layout and placeholders.
