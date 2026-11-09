import { MODULE_ID } from "./model.mjs";
declare const canvas: any;
declare const PIXI: any;
declare const foundry: any;

export class LootMarkers {
  private sprites = new Map<any, any>();
  private texture: any;
  private disposed = false;

  constructor(private available: (token: any) => boolean) {
    const load = foundry.canvas?.loadTexture ?? (globalThis as any).loadTexture;
    void Promise.resolve().then(() => load?.(`modules/${MODULE_ID}/assets/ui/loot-badge.svg`)).then(texture => {
      if (this.disposed || !texture) return;
      this.texture = texture;
      this.refreshScene();
    }).catch(error => console.warn("HoloSuite Loot | Badge texture could not load", error));
  }

  refreshScene() {
    for (const token of canvas.tokens?.placeables ?? []) this.refresh(token);
  }

  refresh(token: any) {
    if (!token || this.disposed || !this.texture) return;
    const doc = token.document;
    const state = doc.getFlag(MODULE_ID, "state");
    if (token.destroyed || token.isPreview || doc.hidden || !this.available(doc)
      || (state && !state.entries.some((entry: any) => !entry.taken && !entry.hidden))) {
      this.remove(token);
      return;
    }
    let sprite = this.sprites.get(token);
    if (sprite?.destroyed || sprite?.parent !== token) {
      this.remove(token);
      sprite = new PIXI.Sprite(this.texture);
      sprite.name = "holosuite-loot-badge";
      sprite.eventMode = "none";
      sprite.anchor.set(.5);
      sprite.width = sprite.height = 24;
      sprite.zIndex = 100;
      token.addChild(sprite);
      this.sprites.set(token, sprite);
    }
    sprite.position.set(token.w, 0);
  }

  remove(token: any) {
    const sprite = this.sprites.get(token);
    this.sprites.delete(token);
    if (sprite && !sprite.destroyed) {
      sprite.parent?.removeChild(sprite);
      sprite.destroy(); // The texture is shared by all tokens and owned by Foundry.
    }
  }

  destroy() {
    this.disposed = true;
    for (const token of this.sprites.keys()) this.remove(token);
  }
}
