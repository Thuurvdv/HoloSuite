import { openBoxOfDoom, registerBoxOfDoom, renderBoxOfDoom } from "../src/box-of-doom";
import { FATE_EXIT, FATE_STYLE, startFateExit, startFateIntro } from "../src/shattered-fate";
import { createOverlay, playCutin } from '../src/cutin-animation';
import { MANGA_STYLE, startMangaExit, startMangaIntro } from '../src/manga-overdrive';
import { startRiftExit, startRiftIntro } from '../src/rift-slash';
import { EFFECT_PRESETS } from '../src/effect-presets';
import { PlayerConfigApp } from '../src/player-config-app';
import { createManualPayloadForUser, registerRollDetection } from '../src/roll-detector';

const values: Record<string, any> = { motionMode: 'full', flashMode: 'soft', effectIntensity: 'standard', shakeIntensity: .5, audience: 'everyone' };
Object.assign(globalThis, {
  game: { user: { id: 'test', isGM: true }, users: [{ id: 'test', isGM: true, active: true, name: 'Commander' }], actors: [], settings: { get: (_: string, key: string) => values[key] } },
  foundry: { utils: { randomID: () => crypto.randomUUID(), deepClone: (value: any) => structuredClone(value) } },
});
// An original vector stand-in keeps the preview self-contained; production uses the actor's image.
const portrait = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="#274563"/><stop offset="1" stop-color="#09111e"/></linearGradient><linearGradient id="v"><stop stop-color="#6af1ff"/><stop offset="1" stop-color="#5372dc"/></linearGradient></defs><path fill="url(#b)" d="M0 0h500v500H0z"/><g fill="none" stroke="#6685a6" opacity=".18"><circle cx="250" cy="225" r="170"/><path d="M0 70h500M0 140h500M0 210h500M0 280h500M0 350h500M0 420h500"/></g><path fill="#152437" stroke="#617d99" stroke-width="3" d="M70 500l20-95 85-55 150 0 85 55 20 95"/><path fill="#354e68" d="M150 405l100 40 100-40-25-55H175z"/><path fill="#111f30" stroke="#7e9cb4" stroke-width="4" d="M148 155l40-55h124l40 55v145l-50 55H198l-50-55z"/><path fill="#53738e" d="M162 155l35-40h106l35 40-24 24H186z"/><path fill="url(#v)" d="M162 186h176l-10 66-78 28-78-28z"/><path fill="#d8f9ff" opacity=".65" d="M176 193h147l-5 9H180z"/><path fill="#415a71" d="M180 275l70 22 70-22-25 62h-90z"/><g fill="#78efff"><path d="M110 405l55-30 10 13-55 30zM335 375l55 30-10 13-55-30z"/><circle cx="250" cy="411" r="8"/></g><path fill="none" stroke="#7092b1" stroke-width="3" d="M100 460h80l30 40M400 460h-80l-30 40"/></svg>`);

function payload(id = 'strike', kind = 'success', extra = {}) {
  return { id: crypto.randomUUID(), animationStyle: id, triggerKind: kind, actorName: 'COMMANDER VALE', imagePath: portrait, overlayText: kind === 'failure' ? 'SYSTEM FAILURE' : 'CRITICAL HIT', accentColor: kind === 'failure' ? '#ff6288' : '#69e8ff', textEnabled: true, naturalResult: kind === 'failure' ? 1 : 20, duration: 2500, ...extra };
}
function mount(id = 'strike', kind = 'success', at = 650, extra = {}) {
  document.querySelectorAll('.hcci-overlay').forEach(el => el.remove());
  const overlay = createOverlay(payload(id, kind, extra));
  overlay.style.setProperty('--hcci-intro', '1000ms');
  document.body.appendChild(overlay);
  const exitDuration = id === FATE_STYLE ? FATE_EXIT : 180;
  const holdAt = 2500 - exitDuration;
  if (id === 'rift' || id === MANGA_STYLE || id === FATE_STYLE) {
    const startIntro = id === FATE_STYLE ? startFateIntro : id === 'rift' ? startRiftIntro : startMangaIntro;
    const startExit = id === FATE_STYLE ? startFateExit : id === 'rift' ? startRiftExit : startMangaExit;
    startIntro(overlay, holdAt);
    if (at >= holdAt) {
      for (const animation of overlay.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = holdAt;
      }
      overlay.classList.add('hcci-exiting');
      const exit = overlay.getAnimations();
      for (const animation of [...exit, ...startExit(overlay, exitDuration)]) animation.currentTime = at - holdAt;
    }
  }
  // Seek every animation on the same timeline; delays remain part of their effect timing.
  for (const animation of overlay.getAnimations({ subtree: true })) { animation.pause(); if (at < holdAt) animation.currentTime = at; }
  return overlay;
}
const select = document.querySelector<HTMLSelectElement>('#preset')!;
select.innerHTML = EFFECT_PRESETS.map(p => `<option value="${p.id}">${p.label}</option>`).join('');
function replay() {
  values.animationFont = (document.querySelector('#font') as HTMLSelectElement).value;
  values.motionMode = (document.querySelector('#motion') as HTMLSelectElement).value;
  const kind = (document.querySelector('#outcome') as HTMLSelectElement).value;
  document.querySelector('#description')!.textContent = EFFECT_PRESETS.find(p => p.id === select.value)!.description;
  playCutin(payload(select.value, kind, { accentColor: (document.querySelector('#accent') as HTMLInputElement).value }));
}
document.querySelector('#play')!.addEventListener('click', replay);
select.addEventListener('change', replay);
Object.assign(globalThis, { studio: { values, payload, mount, playCutin, presets: EFFECT_PRESETS, portrait, PlayerConfigApp, createManualPayloadForUser, registerRollDetection, openBoxOfDoom, registerBoxOfDoom, renderBoxOfDoom }, ready: true });
replay();
