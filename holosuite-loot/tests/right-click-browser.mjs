// Standalone browser check: no Foundry world or document data is touched.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { CDP } from './helpers/cdp.mjs';

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hololoot-right-click-'));
const browser = spawn(process.env.HOLOLOOT_BROWSER ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let client;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]); break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(port, 'Browser debugger started');
  const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(target => target.type === 'page');
  client = new CDP(page.webSocketDebuggerUrl); await client.connect();
  await client.eval(`document.body.innerHTML='<canvas width="400" height="300"></canvas><aside id="loot" hidden><button id="close">Close loot</button></aside><input id="focus">';
    globalThis.qa={eligible:true,gm:false,toggles:0,down:false,menus:0,contexts:0};
    // Register before Loot, at the same document capture phase used by DAS 0.282.1.
    document.addEventListener('pointerdown',event=>{if(event.target.tagName==='CANVAS'&&event.button===2){qa.down=true;event.stopImmediatePropagation();event.preventDefault()}},true);
    document.addEventListener('pointerup',event=>{if(event.button===2&&qa.down){qa.down=false;qa.menus++;const nav=document.createElement('nav');nav.className='dnd5e-combat-menu';document.body.append(nav)}},true);
    document.addEventListener('contextmenu',()=>qa.contexts++,true);
    document.querySelector('#close').onclick=()=>document.querySelector('#loot').hidden=true;`);
  const source = fs.readFileSync(new URL('../src/right-click.mjs', import.meta.url), 'utf8').replace('export class', 'class');
  await client.eval(`${source}
    globalThis.handler=new LootRightClick(window,{canvas:document.querySelector('canvas'),
      tokenAt:()=>qa.eligible&&!qa.gm?{uuid:'corpse'}:null,dismiss:()=>{},
      toggle:()=>{qa.toggles++;document.querySelector('#loot').hidden=!document.querySelector('#loot').hidden}});true;`);
  const click = async () => {
    await client.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: 100, y: 100, button: 'right', buttons: 2, clickCount: 1 });
    await client.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 100, y: 100, button: 'right', buttons: 0, clickCount: 1 });
  };
  for (let i = 0; i < 6; i++) {
    await click();
    assert.equal(await client.eval('!document.querySelector("#loot").hidden'), true);
    assert.equal(await client.eval('qa.toggles'), i + 1);
    assert.equal(await client.eval('qa.menus+qa.contexts'), 0);
    await client.eval('document.querySelector("#close").click()');
  }
  await click(); await click();
  assert.equal(await client.eval('document.querySelector("#loot").hidden'), true, 'Open popup toggles closed once');
  // A focus change within the page must not release an in-progress gesture.
  await client.eval(`document.querySelector('#focus').focus();document.querySelector('canvas').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,button:2,pointerId:42}));document.querySelector('#focus').blur()`);
  assert.equal(await client.eval('handler.gesture?.pointerId'), 42);
  await client.eval('handler.reset();qa.eligible=false');
  await click();
  assert.equal(await client.eval('qa.menus'), 1, 'Non-loot token keeps its menu');
  await client.eval('qa.eligible=true;qa.gm=true'); await click();
  assert.equal(await client.eval('qa.menus'), 2, 'GM keeps its menu');
  await client.eval('qa.gm=false;handler.destroy()'); await click();
  assert.equal(await client.eval('qa.menus'), 3, 'Teardown restores event propagation');
  console.log('Browser checks passed: six reopen cycles, toggle, focus, non-loot tokens, GM controls, teardown; no competing menu on loot gestures.');
} finally {
  if (client) { try { await client.call('Browser.close'); } catch {} client.ws.close(); }
  browser.kill();
}
