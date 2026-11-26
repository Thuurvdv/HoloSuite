# HoloSuite Core device artwork

The active theme folders are `base` for HoloSuite, `space-police`, and `cassette-futurism`. Open the SVGs directly in Inkscape or a text editor. Save the replacement under the same filename and reload the Foundry client.

| Asset | Canvas and placement |
| --- | --- |
| `frame-9slice.svg` | `160 × 160`, with a `0 0 160 160` viewBox. Set slice guides at `48` and `112` in both directions. Keep corner details within the four `48 × 48` corners. The middle strips stretch, so keep their edges and fills consistent along the direction of stretch. The center fills the shell behind the display. |
| `top-hardware.svg` | `320 × 18` for HoloSuite and `132 × 18` for the other themes. The slot stays centered above the header, with the HoloSuite emitter group scaling down only when needed to fit. |
| `bottom-hardware.svg` | `140 × 18`. The slot stays centered in the lower bezel. |
| `side-button-left.svg` | A narrow decorative part in an `8 × 96` slot along the left bezel. The slot preserves the artwork's aspect ratio. |
| `side-button-right.svg` | The corresponding `8 × 72` right slot. The Cassette Futurism theme uses an uninterrupted case on both sides. |
| `base/mark.png` | The shared HoloSuite mark beside the device name. Its alpha channel defines the silhouette, and each theme sets the mask color in CSS. |

Theme artwork paths and accent colors are set in `styles/holosuite-core.css`. Use a self-contained SVG with a fixed viewBox and keep text, scripts, and external references out of the artwork. The launcher renders labels and interactive controls in HTML.
