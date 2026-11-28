export const CROSSHAIR_STYLE = "crosshair-sever";

export function crosshairMarkup() {
  return '<div class="hcci-sever-crosshair"><i></i></div><div class="hcci-sever-cut hcci-sever-cut-horizontal"></div><div class="hcci-sever-cut hcci-sever-cut-vertical"></div>';
}

export function prepareCrosshairPortrait(overlay: HTMLElement, detail: string) {
  const visual = overlay.querySelector(".hcci-visual")!;
  const portrait = visual.querySelector(".hcci-portrait-frame .hcci-portrait")!;
  const existing = visual.querySelector(".hcci-sever-pieces");
  if (existing) {
    for (const image of existing.querySelectorAll(".hcci-portrait")) image.replaceWith(portrait.cloneNode(true));
    return;
  }

  const pieces = document.createElement("div");
  pieces.className = "hcci-sever-pieces";
  const tilesPerSide = detail === "low" ? 2 : detail === "high" ? 4 : 3;
  const tileSize = 50 / tilesPerSide;
  const slice = (className: string, x: number, y: number, size: number) => {
    const node = document.createElement("div");
    node.className = className;
    node.style.clipPath = `inset(${y}% ${100 - x - size}% ${100 - y - size}% ${x}%)`;
    node.append(portrait.cloneNode(true));
    return node;
  };

  for (const [x, y] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
    const quadrant = document.createElement("div");
    quadrant.className = "hcci-sever-quadrant";
    quadrant.style.setProperty("--qx", x === 0 ? "-1" : "1");
    quadrant.style.setProperty("--qy", y === 0 ? "-1" : "1");
    quadrant.append(slice("hcci-sever-solid", x, y, 50));

    for (let row = 0; row < tilesPerSide; row++) {
      for (let column = 0; column < tilesPerSide; column++) {
        const index = row * tilesPerSide + column;
        const tile = slice("hcci-sever-tile", x + column * tileSize, y + row * tileSize, tileSize);
        tile.style.setProperty("--drift-x", String(.25 + ((index * 7 + x) % 13) / 12));
        tile.style.setProperty("--drift-y", String(.25 + ((index * 11 + y) % 17) / 16));
        tile.style.setProperty("--lag", String((index * 7 + x + y) % 11));
        tile.style.setProperty("--spin", `${(index % 5 - 2) * 14}deg`);
        tile.style.transformOrigin = `${x + (column + .5) * tileSize}% ${y + (row + .5) * tileSize}%`;
        quadrant.append(tile);
      }
    }
    pieces.append(quadrant);
  }
  visual.append(pieces);
}
