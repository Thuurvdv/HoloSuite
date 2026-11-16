import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';
import Handlebars from 'handlebars';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, '../.tmp-tests/cutin-effects');
fs.mkdirSync(output, { recursive: true });
const bundle = buildSync({ entryPoints: [path.join(root,'tests/preview.ts')], bundle: true, write: false, format: 'iife', banner: { js: 'globalThis.foundry={};globalThis.Application=class { activateListeners() {} };' } }).outputFiles[0].text;
// Build a self-contained review artifact that opens directly without a server.
const entryCss = fs.readFileSync(path.join(root,'styles/critical-cutin.css'),'utf8');
const css = entryCss.replace(/@import url\("\.\/(.*?)"\);/g, (_match,name) => fs.readFileSync(path.join(root,'styles',name),'utf8'))
  .replace('../assets/fonts/Aicon-Bold.otf', 'data:font/otf;base64,' + fs.readFileSync(path.join(root,'assets/fonts/Aicon-Bold.otf')).toString('base64'))
  .replace('../assets/manga/panel-speed-lines.svg', 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(root,'assets/manga/panel-speed-lines.svg')).toString('base64'));
const standalone = fs.readFileSync(path.join(root,'tests/preview.html'),'utf8')
  .replace('<link rel="stylesheet" href="/styles/critical-cutin.css">', () => `<style>${css}</style>`)
  .replace('<script src="/preview.js"></script>', () => `<script>${bundle.replace(/<\/script/gi,'<\\/script')}</script>`);
fs.writeFileSync(path.join(output,'effect-studio.html'),standalone);
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost').pathname;
  if (url === '/preview.js') { res.setHeader('Content-Type','text/javascript'); res.end(bundle); return; }
  const file = url === '/' ? path.join(root,'tests/preview.html') : path.resolve(root, '.' + url.replace('/modules/holosuite-critical-cutin/', '/'));
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type',file.endsWith('.css') ? 'text/css' : file.endsWith('.svg') ? 'image/svg+xml' : 'text/html');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const profile = fs.mkdtempSync(path.join(os.tmpdir(),'hcci-visual-'));
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = spawn(chrome,['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,url],{windowsHide:true,stdio:'ignore'});
let ws;
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
try {
  let port;
  for(let i=0;i<100;i++) { try { port = fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]; break; } catch {} await delay(100); }
  assert.ok(port,'Chrome did not start');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve,reject) => { ws.addEventListener('open',resolve,{once:true}); ws.addEventListener('error',reject,{once:true}); });
  let next = 0; const pending = new Map(); const errors = [];
  ws.addEventListener('message',({data}) => {
    const msg = JSON.parse(data);
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
    const item = pending.get(msg.id); if (!item) return; pending.delete(msg.id);
    msg.error ? item.reject(new Error(JSON.stringify(msg.error))) : item.resolve(msg.result);
  });
  const call = (method,params = {}) => new Promise((resolve,reject) => { const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params})); });
  const evaluate = async expression => { const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await call('Runtime.enable');
  for(let i=0;i<100;i++) { if(await evaluate('!!window.ready')) break; await delay(100); }
  assert.equal(await evaluate('!!window.ready'),true,'Preview did not initialize');
  await delay(2600); // Let the automatic welcome preview finish before mounting test frames.
  await evaluate('document.body.classList.add("capture")');
  const size = (width,height) => call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  const screenshot = async name => { const {data}=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); fs.writeFileSync(path.join(output,name),Buffer.from(data,'base64')); };
  await size(1440,900);
  const ids = await evaluate('studio.presets.map(p=>p.id)');
  const results = [];
  for (const id of ids) for (const kind of ['success','failure']) {
    await evaluate(`studio.mount(${JSON.stringify(id)},${JSON.stringify(kind)},${id === 'shattered-fate' ? 1050 : 650})`);
    await screenshot(`${id}-${kind}.png`);
    const geometry = await evaluate(`(() => {const o=document.querySelector('.hcci-overlay'); const f=o.querySelector('.hcci-portrait-frame'); const t=o.querySelector('.hcci-copy'); const r=t.getBoundingClientRect(); return {opacity:+getComputedStyle(f).opacity, nodes:o.querySelectorAll('.hcci-fx').length, right:r.right, bottom:r.bottom, animations:o.getAnimations({subtree:true}).length};})()`);
    assert.ok(geometry.opacity > .5,`${id}/${kind}: portrait not readable`);
    assert.ok(geometry.nodes < 45);
    assert.ok(geometry.animations > 3);
    assert.ok(geometry.right <=1441 && geometry.bottom <=901,`${id}: copy off screen`);
    await evaluate(`studio.mount(${JSON.stringify(id)},${JSON.stringify(kind)},1400)`);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-portrait-frame')).opacity`),'1');
    results.push({id,kind,...geometry});
  }
  for (const [phase, at] of [['lock', 360], ['cut', 610], ['dust', 1000]]) {
    await evaluate(`studio.mount('crosshair-sever','success',${at})`);
    await screenshot(`crosshair-sever-${phase}.png`);
  }
  await evaluate(`studio.mount('crosshair-sever','success',610)`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-sever-quadrant').length`), 4);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-portrait-frame')).visibility`), 'hidden');
  assert.ok(await evaluate(`Number(getComputedStyle(document.querySelector('.hcci-sever-cut')).opacity) > 0.7`));
  await evaluate(`studio.mount('crosshair-sever','failure',1000)`);
  assert.ok(await evaluate(`[...document.querySelectorAll('.hcci-sever-tile')].some(tile => Number(getComputedStyle(tile).opacity) > 0.5)`));
  await evaluate(`studio.mount('crosshair-sever','failure',1400)`);
  assert.ok(await evaluate(`[...document.querySelectorAll('.hcci-sever-tile')].every(tile => getComputedStyle(tile).opacity === '0')`));
  await evaluate('document.fonts.ready.then(()=>true)');
  assert.equal(await evaluate(`document.fonts.check('24px "HCCI AICON"')`),true);
  // Actor-only labels and the removed capsule apply to every preset and font.
  for (const font of ['aicon','classic']) for (const id of ids) {
    await evaluate(`studio.values.animationFont=${JSON.stringify(font)};studio.mount(${JSON.stringify(id)},'success',1400,{userName:'PLAYER SECRET',actorName:'ACTOR ONLY'})`);
    assert.equal(await evaluate(`document.querySelector('.hcci-subtitle').textContent`),'ACTOR ONLY');
    assert.equal(await evaluate(`document.querySelectorAll('.hcci-result').length`),0);
    assert.ok((await evaluate(`getComputedStyle(document.querySelector('.hcci-title')).fontFamily`)).includes(font === 'aicon' ? 'HCCI AICON' : 'Orbitron'));
    await evaluate(`studio.mount(${JSON.stringify(id)},'success',1400,{userName:'PLAYER SECRET',actorName:''})`);
    assert.equal(await evaluate(`document.querySelectorAll('.hcci-subtitle').length`),0);
  }
  // Responsive silhouette + long label checks.
  for(const [width,height] of [[390,844],[1024,560],[1920,1080]]) {
    await size(width,height);
    for(const font of ['aicon','classic']) for(const id of ids) {
      await evaluate(`studio.values.animationFont=${JSON.stringify(font)};studio.mount(${JSON.stringify(id)},'success',1400,{overlayText:'UNSTOPPABLE CRITICAL STRIKE',actorName:'A VERY LONG ACTOR NAME THAT MUST REMAIN ON SCREEN'})`);
      const rect = await evaluate(`(() => {const r=document.querySelector('.hcci-copy').getBoundingClientRect(); return {left:r.left,right:r.right,bottom:r.bottom};})()`);
      if (width === 1920 && !['rift', 'manga-overdrive', 'shattered-fate', 'reality-override', 'system-collapse'].includes(id)) assert.ok(rect.right > 1850, 'copy should use the right side of wide screens');
      assert.ok(rect.left >= -1 && rect.right <= width+1 && rect.bottom <= height+1,`${id} at ${width}: text overflow ${JSON.stringify(rect)}`);
    }
    await screenshot(`responsive-${width}.png`);
  }
  await size(1440,900);
  for(const mode of ['reduced','still']) for(const id of ids) {
    await evaluate(`studio.values.motionMode=${JSON.stringify(mode)};studio.mount(${JSON.stringify(id)},'failure',500)`);
    assert.equal(await evaluate(`document.querySelectorAll('.hcci-fx').length`),0);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-visual')).animationName`),'none');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-portrait-frame')).opacity`),'1');
  }
  await evaluate(`studio.values.motionMode='full';studio.values.flashMode='off';studio.mount('reactor')`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-flash')).display`),'none');
  // System preference must behave exactly like the explicit reduced option.
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`studio.values.motionMode='system';studio.mount('shatter')`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-fx,.hcci-portrait-echo').length`),0);
  await call('Emulation.setEmulatedMedia',{features:[]});
  await evaluate(`studio.values.motionMode='full';studio.mount('shatter','success',400,{imagePath:'data:image/png,not-an-image'})`);
  await delay(100);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-portrait-fallback')`),true);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-portrait-echo').length`),0);
  // Inspect the actual timing and geometry for the four Rift Slash entrance beats.
  for (const [width, height] of [[1440,900], [2560,1080], [390,844]]) {
    await size(width,height);
    for (const [phase, time] of [['anticipation',75], ['blade',205], ['rupture',315], ['hold',700]]) {
      const state = await evaluate(`(() => {
        studio.mount('rift','success',${time});
        const node = selector => document.querySelector(selector);
        return {
          plates: [...document.querySelectorAll('.hcci-rift-plate')].map(p => new DOMMatrix(getComputedStyle(p).transform).isIdentity ? "none" : getComputedStyle(p).transform),
          blade: Number(getComputedStyle(node('.hcci-rift-slash')).opacity),
          portrait: Number(getComputedStyle(node('.hcci-visual')).opacity),
          title: Number(getComputedStyle(node('.hcci-copy')).opacity)
        };
      })()`);
      if (phase === 'anticipation') {
        assert.deepEqual(state.plates, ['none', 'none']);
        assert.equal(state.portrait, 0);
      }
      if (phase === 'blade') assert.ok(state.blade > .6);
      if (phase === 'rupture') {
        assert.notEqual(state.plates[0], 'none');
        assert.notEqual(state.plates[1], 'none');
        assert.notEqual(state.plates[0], state.plates[1]);
        assert.equal(state.portrait, 0);
      }
      if (phase === 'hold') {
        assert.equal(state.portrait, 1);
        assert.equal(state.title, 1);
      }
      await screenshot(`rift-${width}-${phase}.png`);
    }
  }
  await size(1440,900);
  await evaluate(`studio.mount('rift','failure',700,{textEnabled:false,imagePath:''})`);
  assert.equal(await evaluate(`document.querySelector('.hcci-title')`), null);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-portrait-fallback')`), true);
  await evaluate(`studio.values.flashMode='off'; studio.mount('rift','failure',205)`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-rift-flash')).display`),'none');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`studio.mount('rift','failure',205)`);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-motion-reduced .hcci-portrait') && !document.querySelector('.hcci-rift-geometry')`),true);
  await call('Emulation.setEmulatedMedia',{features:[]});
  await evaluate(`studio.values.flashMode='soft'; studio.mount('rift','failure',700)`);
  await screenshot('rift-failure-impact.png');
  const heldX = await evaluate(`document.querySelector('.hcci-visual').getBoundingClientRect().left`);
  await evaluate(`studio.mount('rift','failure',2435)`);
  assert.ok(await evaluate(`document.querySelector('.hcci-visual').getBoundingClientRect().left`) > heldX + 90);
  await screenshot('rift-exit.png');
  // Review the six manga beats with rectangular artwork and a transparent PNG fixture.
  await evaluate(`(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#b42c4b';
    ctx.beginPath();
    ctx.moveTo(19,230); ctx.lineTo(29,139); ctx.lineTo(49,118);
    ctx.lineTo(40,60); ctx.lineTo(70,20); ctx.lineTo(104,52); ctx.lineTo(97,113);
    ctx.lineTo(125,145); ctx.lineTo(137,230); ctx.fill();
    ctx.fillStyle = '#ffb53b';
    ctx.fillRect(49,63,48,23);
    window.transparentPortrait = canvas.toDataURL();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#422f63';
    ctx.fillRect(0,0,140,240);
    window.webpPortrait = canvas.toDataURL('image/webp');
  })()`);
  for (const [width,height] of [[1440,810], [2560,1080], [390,844]]) {
    await size(width,height);
    for (const [phase,time] of [['blackout',48], ['ink',135], ['silhouette',260], ['halftone',400], ['impact',615], ['hold',850], ['exit',2455], ['ink-closure',2498]]) {
      const state = await evaluate(`(() => {
        studio.mount('manga-overdrive','success',${time}, { accentColor:'#e62e46', imagePath: ${width === 390 ? 'transparentPortrait' : 'studio.portrait'} });
        const css = name => getComputedStyle(document.querySelector(name));
        return {
          page: Number(css('.hcci-manga-page').opacity), glint: Number(css('.hcci-manga-panel-glint').opacity),
          filter: css('.hcci-manga-artwork').filter, dots: Number(css('.hcci-manga-dots').opacity),
          title: Number(css('.hcci-copy').opacity), impact: Number(css('.hcci-manga-impact').opacity),
          exit: Number(css('.hcci-manga-exit').opacity), imageFit: css('.hcci-portrait').objectFit
        };
      })()`);
      assert.equal(state.imageFit,'contain');
      if (phase === 'blackout') assert.ok(state.glint > .5 && state.page === 0 && state.impact === 0);
      if (phase === 'ink') assert.ok(state.page === 1 && state.title === 0);
      if (phase === 'silhouette') assert.match(state.filter,/brightness\(0.4\)/);
      if (phase === 'halftone') assert.ok(state.dots > .2 && state.filter.includes('grayscale(1)') && state.title === 0);
      if (phase === 'impact' || phase === 'hold') assert.ok(state.impact === 1 && state.title > .95 && !state.filter.includes('grayscale(1)'), JSON.stringify(state));
      if (phase === 'exit' || phase === 'ink-closure') assert.equal(state.exit,1);
      await screenshot(`manga-${width}-${phase}.png`);
    }
  }
  await size(1440,810);
  await evaluate(`studio.values.motionMode='reduced'; studio.mount('manga-overdrive','failure',50,{imagePath:'',textEnabled:false})`);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-portrait-fallback') && !document.querySelector('.hcci-title') &&
    document.querySelector('.hcci-overlay').getAnimations({subtree:true}).length === 0`), true);
  await evaluate(`studio.values.motionMode='full'`);
  for (const [width,height] of [[1440,810], [1440,900], [2560,1080], [390,844]]) {
    await size(width,height);
    for (const [phase,time] of [['reveal',170], ['cracks',380], ['handoff',450], ['shatter',600], ['impact',980], ['hold',1300], ['exit',2385]]) {
      const state = await evaluate(`(() => {
        studio.mount('shattered-fate','failure',${time},{overlayText:'CRITICAL FAILURE',accentColor:'#ed254b',imagePath:${width === 390 ? 'transparentPortrait' : width === 2560 ? 'webpPortrait' : 'studio.portrait'}});
        const frame = document.querySelector('.hcci-portrait-frame');
        const shards = [...document.querySelectorAll('.hcci-fate-shard')];
        return {
          source: getComputedStyle(frame).visibility,
          ray: +getComputedStyle(document.querySelector('.hcci-fate-rays')).opacity,
          visible: shards.filter(shard => getComputedStyle(shard).visibility === 'visible').length,
          transforms: new Set(shards.map(shard => getComputedStyle(shard).transform)).size,
          alignment: shards.every(shard => shard.offsetWidth === frame.offsetWidth &&
            shard.offsetHeight === frame.offsetHeight && shard.querySelector('img').src === frame.querySelector('img').src),
          title: +getComputedStyle(document.querySelector('.hcci-copy')).opacity,
          strips: document.querySelectorAll('.hcci-fate-exit-pieces > div').length
        };
      })()`);
      assert.equal(state.alignment,true);
      if (phase === 'reveal') assert.equal(state.visible,0);
      if (phase === 'cracks') assert.ok(state.source === 'visible' && state.ray > .9 && state.visible === 0);
      if (phase === 'handoff') assert.ok(state.source === 'hidden' && state.visible === 18 && state.transforms === 1, JSON.stringify(state));
      if (phase === 'shatter') assert.ok(state.source === 'hidden' && state.visible === 18 && state.transforms === 18 && state.title === 0);
      if (phase === 'hold') assert.equal(state.title,1);
      if (phase === 'exit') assert.equal(state.strips,5);
      await screenshot(`fate-${width}x${height}-${phase}.png`);
    }
  }
  await size(1440,900);
  await evaluate(`studio.mount('shattered-fate','failure',610,{imagePath:'data:image/png,bad',preview:true,fallbackImagePath:studio.portrait})`);
  await delay(120);
  assert.equal(await evaluate(`[...document.querySelectorAll('.hcci-fate-shard img')].filter(img => img.getAttribute('src') === studio.portrait).length`),18);
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`studio.mount('shattered-fate','failure',610,{imagePath:''})`);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-portrait-fallback') && !document.querySelector('.hcci-fate-shard') &&
    document.querySelector('.hcci-overlay').getAnimations({subtree:true}).length === 0`),true);
  await call('Emulation.setEmulatedMedia',{features:[]});
  // Both configuration tabs and the roll payload preserve every style ID.
  await evaluate(`game.users.get=id=>game.users.find(u=>u.id===id)`);
  for(const id of ids) {
    const result = await evaluate(`(async()=>{studio.values.playerConfigs={'gm:default':{animationStyle:${JSON.stringify(id)},failure:{animationStyle:${JSON.stringify(id)}}}};const data=await new studio.PlayerConfigApp().getData();return {success:data.rows[0].success.animationStyle,failure:data.rows[0].failure.animationStyle,choices:data.rows[0].success.animationStyles.length,payload:studio.createManualPayloadForUser('test').animationStyle};})()`);
    assert.deepEqual(result,{success:id,failure:id,choices:ids.length,payload:id});
  }
  assert.equal(await evaluate(`studio.createManualPayloadForUser('test').actorName`),'','actorless manual roll must not expose a user name');
  // Slow audio must not hold the overlay or the queue open.
  await evaluate(`document.querySelectorAll('.hcci-overlay').forEach(e=>e.remove());foundry.audio={AudioHelper:{play:()=>new Promise(resolve=>setTimeout(()=>resolve({stop(){window.audioStopped=true}}),1600))}};studio.playCutin(studio.payload('void','success',{duration:800,audioPath:'test.ogg'}))`);
  await delay(1000);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0,'slow audio delayed cleanup');
  await delay(700);
  assert.equal(await evaluate('window.audioStopped'),true,'late audio not stopped');
  await evaluate(`studio.playCutin(studio.payload('eclipse','success',{duration:8000}));window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);
  await delay(250);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0,'Escape did not clean up');
  // A failed append must not wedge the next playback.
  await evaluate(`{const append=document.body.appendChild.bind(document.body);document.body.appendChild=()=>{document.body.appendChild=append;throw Error('injected render failure')};studio.playCutin(studio.payload());studio.playCutin(studio.payload('reactor','success',{duration:800}));}`);
  await delay(150);
  assert.equal(await evaluate(`!!document.querySelector('.hcci-style-reactor')`),true,'queue failed to recover');
  await delay(800);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0);
  // Render the actual configuration template with shared ownership and a player with no characters.
  const configData = await evaluate(`(async () => {
    game.users.push({ id: 'one', name: 'Player One', avatar: studio.portrait },
      { id: 'two', name: 'Player Two', avatar: studio.portrait }, { id: 'empty', name: 'No Characters', avatar: studio.portrait });
    game.users[0].avatar = studio.portrait;
    game.actors.push({ id: 'shared', name: 'Commander Vale', img: studio.portrait, ownership: { one: 3, two: 3 } },
      { id: 'solo', name: 'Rex Valen', img: studio.portrait, ownership: { one: 3 } });
    game.actors.get = id => game.actors.find(actor => actor.id === id);
    Object.assign(studio.values, { dieSides: 20, duration: 2500, volume: .6, localVolume: .5,
      defaultText: 'CRITICAL', defaultFailureText: 'CRITICAL FAILURE',
      playerConfigs: { 'actor:shared': { animationStyle: 'overdrive', failure: { enabled: false } } } });
    window.configApp = new studio.PlayerConfigApp();
    return configApp.getData();
  })()`);
  assert.equal(configData.rows.filter(row => row.key === 'actor:shared').length, 1);
  const renderConfig = Handlebars.compile(fs.readFileSync(path.join(root,'templates/player-config.hbs'),'utf8'));
  await evaluate(`(() => {
    window.writes = [];
    window.audioCalls = [];
    game.settings.set = async (_module, key, value) => { writes.push(key); studio.values[key] = value; };
    game.socket = { emit: () => { throw Error('Unexpected socket broadcast'); } };
    window.ChatMessage = { create: () => { throw Error('Unexpected chat message'); } };
    window.Roll = class { constructor() { throw Error('Unexpected roll'); } };
    window.ui = { notifications: { info() {}, error() {} } };
    foundry.audio.AudioHelper.play = (options, broadcast) => {
      audioCalls.push({ ...options, broadcast });
      return Promise.resolve({ stop() {} });
    };
    document.querySelector('header').remove();
    const chromeStyles = document.createElement('style');
    chromeStyles.textContent = ${JSON.stringify(fs.readFileSync(path.join(root,'styles/holosuite-tokens.css'),'utf8'))};
    document.head.append(chromeStyles);
    const shell = document.createElement('div');
    shell.id = 'hcci-player-config';
    shell.className = 'window-app hcci-config-window';
    shell.style.position = 'relative';
    shell.innerHTML = '<header class="window-header">Foundry title bar</header><div class="window-content">'
      + ${JSON.stringify(renderConfig(configData))} + '</div>';
    configApp.setPosition = position => { window.configPosition = position; };
    document.body.append(shell);
    window.form = shell.querySelector('form');
    window.pick = selector => form.querySelector(selector);
    window.edit = (selector, value) => {
      const input = pick(selector);
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    window.field = name => '[data-hcci-panel]:not([hidden]) [data-hcci-field="' + name + '"]';
    configApp.activateListeners(form);
    configApp.render = () => {};
    pick('[data-hcci-player="one"]').click();
  })()`);
  assert.equal(await evaluate(`pick(field('animationStyle')).value`), 'overdrive');
  await size(1280,720);
  for (const generation of ['12', '14']) {
    await evaluate(`document.documentElement.dataset.holosuiteFoundryGeneration = '${generation}'`);
    assert.deepEqual(await evaluate(`(() => {
      const fieldStyle = getComputedStyle(pick(field('threshold')));
      const dropdown = pick(field('animationStyle'));
      const shell = form.closest('.window-app');
      return {
        field: fieldStyle.backgroundColor,
        fieldText: fieldStyle.color,
        fieldBorder: fieldStyle.borderTopColor,
        select: getComputedStyle(dropdown).backgroundColor,
        option: getComputedStyle([...dropdown.options].find(option => !option.selected)).backgroundColor,
        selectedOption: getComputedStyle(dropdown.selectedOptions[0]).backgroundColor,
        frame: getComputedStyle(shell, '::after').borderImageSource.endsWith('/assets/ui/config-window-frame.svg")'),
        frameClickThrough: getComputedStyle(shell, '::after').pointerEvents
      };
    })()`), {
      field: 'rgb(36, 22, 63)',
      fieldText: 'rgb(246, 236, 255)',
      fieldBorder: 'rgb(151, 96, 176)',
      select: 'rgb(36, 22, 63)',
      option: 'rgb(36, 22, 63)',
      selectedOption: 'rgb(76, 43, 112)',
      frame: true,
      frameClickThrough: 'none'
    });
    for (const [kind, fill] of [['success', 'rgb(99, 245, 140)'], ['failure', 'rgb(255, 86, 93)']]) {
      await evaluate(`pick('[data-hcci-tab="${kind}"]').click()`);
      await delay(150);
      assert.equal(await evaluate(`getComputedStyle(pick('.hcci-outcomes [aria-selected="true"]')).backgroundColor`), fill);
      assert.equal(await evaluate(`getComputedStyle(pick('.hcci-outcomes [aria-selected="false"]')).backgroundColor`), 'rgb(41, 25, 71)');
      assert.equal(await evaluate(`getComputedStyle(pick('button[type="submit"]')).backgroundColor`), 'rgb(255, 97, 218)');
      if (generation === '14') await screenshot(`config-ultraviolet-${kind}.png`);
    }
  }
  await evaluate(`delete document.documentElement.dataset.holosuiteFoundryGeneration;
    pick('[data-hcci-tab="success"]').click()`);
  await evaluate(`edit(field('overlayText'), 'UNSAVED SUCCESS');
    edit(field('accentColor'), '#31dfe5');
    edit(field('audioPath'), 'success.ogg');
    edit('[name="duration"]', '800');
    edit(field('duration'), '900');
    pick('[data-hcci-style="rift"]').click();
    pick('[data-hcci-player="one"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));`);
  assert.equal(await evaluate(`pick('[data-hcci-player="two"]').getAttribute('aria-selected')`), 'true');
  assert.equal(await evaluate(`pick('[data-hcci-caption]').textContent`), 'UNSAVED SUCCESS');
  assert.equal(await evaluate(`pick(field('animationStyle')).value`), 'rift');
  assert.equal(await evaluate(`pick('[data-hcci-style="rift"]').getAttribute('aria-pressed')`), 'true');
  assert.equal(await evaluate(`pick('[data-hcci-dirty]').hidden`), false);
  await size(1280,720);
  assert.equal(await evaluate(`getComputedStyle(form.closest('.window-app').querySelector('.window-header')).display`), 'none');
  const grip = await evaluate(`(() => {
    const bounds = pick('[data-hcci-window-drag]').getBoundingClientRect();
    return { x: Math.round(bounds.x + bounds.width / 2), y: Math.round(bounds.y + bounds.height / 2) };
  })()`);
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...grip, button: 'left', buttons: 1, clickCount: 1 });
  const destination = { x: grip.x + 90, y: grip.y + 40 };
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...destination, button: 'left', buttons: 1 });
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...destination, button: 'left', clickCount: 1 });
  assert.deepEqual(await evaluate('window.configPosition'), { left: 90, top: 40 });
  assert.deepEqual(await evaluate(`(() => {
    let closed = 0, submitted = 0;
    configApp.close = () => { closed++; };
    form.addEventListener('submit', event => { event.preventDefault(); submitted++; });
    const close = pick('.hcci-config-actions [data-hcci-action="close"]');
    close.click();
    return { closed, submitted };
  })()`), { closed: 1, submitted: 0 });
  await screenshot('config-desktop.png');
  await size(390,844);
  assert.equal(await evaluate(`form.scrollWidth <= form.clientWidth + 1`), true);
  assert.ok(await evaluate(`pick('[data-hcci-art]').getBoundingClientRect().height > 100`));
  await screenshot('config-narrow.png');
  await size(1280,720);

  await evaluate(`pick('[data-hcci-test]').click(); pick('[data-hcci-test]').click();`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay.hcci-kind-success.hcci-style-rift').length`), 1);
  assert.equal(await evaluate(`document.querySelector('.hcci-title').textContent`), 'UNSAVED SUCCESS');
  assert.equal(await evaluate(`document.querySelector('.hcci-overlay').style.getPropertyValue('--hcci-duration')`), '900ms');
  await delay(110);
  assert.deepEqual(await evaluate('audioCalls'), [{ src: 'success.ogg', volume: .3, autoplay: true, loop: false, broadcast: false }]);
  await delay(850);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`), 0);
  await evaluate(`pick('[data-hcci-tab="failure"]').click();
    edit(field('imagePath'), 'data:image/png,invalid');
    edit(field('overlayText'), 'UNSAVED FAILURE');
    edit(field('accentColor'), '#f84a81');
    edit(field('audioPath'), 'failure.ogg');
    pick('[data-hcci-style="rift"]').click();
    pick('[data-hcci-test]').click();`);
  await delay(100);
  assert.equal(await evaluate(`pick(field('enabled')).checked`), false);
  assert.equal(await evaluate(`document.querySelector('.hcci-overlay').style.getPropertyValue('--hcci-duration')`), '800ms');
  assert.equal(await evaluate(`document.querySelector('.hcci-title').textContent`), 'UNSAVED FAILURE');
  assert.equal(await evaluate(`document.querySelector('.hcci-overlay').style.getPropertyValue('--hcci-accent')`), '#f84a81');
  assert.equal(await evaluate(`document.querySelector('.hcci-kind-failure.hcci-style-rift img').getAttribute('src') === studio.portrait`), true);
  assert.equal(await evaluate(`audioCalls[1].src`), 'failure.ogg');
  assert.deepEqual(await evaluate('writes'), []);
  await delay(750);
  await evaluate(`game.user.isGM = false; pick('[data-hcci-test]').click();`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`), 0);
  await evaluate(`game.user.isGM = true;
    pick('[data-hcci-player="empty"]').click();`);
  assert.equal(await evaluate(`pick('[data-hcci-workspace]').hidden`), true);
  await evaluate(`pick('[data-hcci-player="one"]').click();
    pick('[data-hcci-character="actor:solo"]').click();
    pick('[data-hcci-character="actor:shared"]').click();`);
  assert.equal(await evaluate(`pick(field('overlayText')).value`), 'UNSAVED FAILURE');
  await evaluate(`window.FilePicker = class {
    constructor(options) { this.options = options; }
    browse() { this.options.callback(studio.portrait); }
  };
  pick('[data-hcci-panel]:not([hidden]) [data-hcci-browse="imagePath"]').click();`);
  assert.equal(await evaluate(`pick('[data-hcci-art]').getAttribute('src') === studio.portrait`), true);
  await evaluate(`(async () => {
    foundry.applications = { api: { DialogV2: { confirm: async () => false } } };
    edit('[name="rollDirection"]', 'low');
    await configApp.rollRuleChange;
    if (pick('[name="rollDirection"]').value !== 'high') throw Error('Canceled rule change was applied');
    foundry.applications.api.DialogV2.confirm = async () => true;
    edit('[name="rollDirection"]', 'low');
    await configApp.rollRuleChange;
  })()`);
  assert.equal(await evaluate(`pick('[name="failureThreshold"]').value`), '20');
  assert.equal(await evaluate(`pick(field('threshold')).value`), '20');
  await evaluate(`configApp._updateObject({ currentTarget: form })`);
  assert.deepEqual(await evaluate('writes'), ['dieSides', 'rollDirection', 'threshold', 'failureThreshold', 'duration', 'playerConfigs']);
  assert.equal(await evaluate(`studio.values.playerConfigs['actor:shared'].overlayText`), 'UNSAVED SUCCESS');
  assert.equal(await evaluate(`studio.values.playerConfigs['actor:shared'].duration`), 900);
  assert.equal(await evaluate(`'duration' in studio.values.playerConfigs['actor:shared'].failure`), false);
  assert.equal(await evaluate(`studio.values.playerConfigs['actor:shared'].failure.animationStyle`), 'rift');
  await evaluate(`pick('[data-hcci-action="reset"]').click()`);
  assert.deepEqual(await evaluate('studio.values.playerConfigs'), {});
  await evaluate(`window.activeRift = null;
    studio.playCutin(studio.payload('rift','success',{duration:8000,audioPath:'canceled.ogg'}));
    activeRift = document.querySelector('.hcci-style-rift');
    window.riftTracks = activeRift.getAnimations({subtree:true});
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));`);
  assert.equal(await evaluate(`activeRift.style.getPropertyValue('--hcci-duration')`),'8000ms');
  await delay(230);
  assert.equal(await evaluate(`activeRift.isConnected || riftTracks.some(animation => animation.playState !== 'idle')`),false);
  assert.equal(await evaluate(`audioCalls.some(call => call.src === 'canceled.ogg')`),false);
  await evaluate(`studio.values.textEnabled = true;
    pick('[data-hcci-tab="success"]').click();
    pick('[data-hcci-style="manga-overdrive"]').click();
    if (pick(field('animationStyle')).value !== 'manga-overdrive') throw Error('Manga card did not select success style');
    pick('[data-hcci-tab="failure"]').click();
    pick('[data-hcci-style="manga-overdrive"]').click();
    if (pick(field('animationStyle')).value !== 'manga-overdrive' ||
        pick('[data-hcci-style="manga-overdrive"]').getAttribute('aria-pressed') !== 'true') {
      throw Error('Manga card did not select failure style');
    }
    edit(field('audioPath'), 'manga.ogg');
    pick('[data-hcci-test]').click();
    pick('[data-hcci-test]').click();`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-kind-failure.hcci-style-manga-overdrive').length`),1);
  await delay(410);
  assert.equal(await evaluate(`document.querySelector('.hcci-title').textContent`),'UNSAVED FAILURE');
  assert.equal(await evaluate(`audioCalls.filter(call => call.src === 'manga.ogg').length`),1);
  await delay(420);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0);
  await evaluate(`pick('[data-hcci-style="shattered-fate"]').click();
    edit(field('audioPath'), 'fate.ogg');
    pick('[data-hcci-test]').click();
    pick('[data-hcci-test]').click();`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-kind-failure.hcci-style-shattered-fate').length`),1);
  await delay(260);
  assert.equal(await evaluate(`audioCalls.filter(call => call.src === 'fate.ogg').length`),1);
  await delay(570);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0);
  await evaluate(`form.parentElement.remove()`);
  // Use the actual receiver to play a serialized failure payload on a player client.
  await evaluate(`window.rollHooks = {}; window.Hooks = { on(name, listener) { rollHooks[name] = listener; }, callAll(name, ...args) { rollHooks[name]?.(...args); } };
    game.socket.on = (channel, receive) => { window.riftSocket = { channel, receive }; };
    studio.registerRollDetection();
    Object.assign(studio.values, { enabled: true, textEnabled: false, duration: 800 });
    studio.values.playerConfigs = { 'actor:shared': { failure: { animationStyle: 'rift', accentColor: '#f65b93' } } };
    window.socketPayload = studio.createManualPayloadForUser('one', { actorId: 'shared', triggerKind: 'failure' });
    game.user = game.users.get('two');
    riftSocket.receive(JSON.parse(JSON.stringify({ type: 'play', payload: socketPayload })));`);
  assert.equal(await evaluate(`riftSocket.channel`),'module.holosuite-critical-cutin');
  assert.equal(await evaluate(`socketPayload.animationStyle`),'rift');
  assert.equal(await evaluate(`!!document.querySelector('.hcci-kind-failure.hcci-style-rift') && !document.querySelector('.hcci-title')`),true);
  await delay(830);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-overlay').length`),0);
  await evaluate(`studio.values.playerConfigs['actor:shared'].failure = { animationStyle: 'manga-overdrive' };
    window.mangaTracks = [];
    socketPayload = studio.createManualPayloadForUser('one', { actorId: 'shared', triggerKind: 'failure', duration: 8000 });
    riftSocket.receive(JSON.parse(JSON.stringify({ type: 'play', payload: socketPayload })));
    window.mangaOverlay = document.querySelector('.hcci-style-manga-overdrive');
    mangaTracks = mangaOverlay.getAnimations({subtree:true});`);
  assert.equal(await evaluate(`mangaOverlay.style.getPropertyValue('--hcci-duration')`),'8000ms');
  assert.equal(await evaluate(`socketPayload.accentColor`),'#ec2846');
  await delay(830);
  assert.equal(await evaluate(`mangaOverlay.isConnected && !mangaOverlay.querySelector('.hcci-title')`),true);
  await delay(7250);
  assert.equal(await evaluate(`mangaOverlay.isConnected || mangaTracks.some(animation => animation.playState !== 'idle')`),false);
  await evaluate(`studio.values.playerConfigs['actor:shared'].failure = { animationStyle: 'shattered-fate' };
    socketPayload = studio.createManualPayloadForUser('one', { actorId: 'shared', triggerKind: 'failure', duration: 8000 });
    riftSocket.receive(JSON.parse(JSON.stringify({ type: 'play', payload: socketPayload })));
    window.fateOverlay = document.querySelector('.hcci-style-shattered-fate');
    window.fateTracks = fateOverlay.getAnimations({subtree:true});
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));`);
  assert.equal(await evaluate(`fateOverlay.style.getPropertyValue('--hcci-duration')`),'8000ms');
  await delay(315);
  assert.equal(await evaluate(`fateOverlay.isConnected || fateTracks.some(animation => animation.playState !== 'idle')`),false);
  const durations = await evaluate(`(() => {
    game.user = game.users.get('test');
    Object.assign(studio.values, { rollDirection: 'high', threshold: 0, failureThreshold: 0 });
    studio.values.playerConfigs = { 'actor:shared': { duration: 900, failure: { duration: 1100 } } };
    const durations = [];
    game.socket.emit = (_channel, { payload }) => durations.push(payload.duration);
    for (const result of [20, 1]) {
      rollHooks.createChatMessage({ id: 'duration-' + result, isRoll: true, author: game.users.get('one'),
        speaker: { actor: 'shared' }, rolls: [{ dice: [{ faces: 20, results: [{ result }] }] }] });
    }
    durations.push(studio.createManualPayloadForUser('one', { actorId: 'shared' }).duration);
    durations.push(studio.createManualPayloadForUser('one', { actorId: 'shared', duration: 1200 }).duration);
    return durations;
  })()`);
  assert.deepEqual(durations, [900, 1100, 900, 1200]);
  // Drive the real Box of Doom controller through a mocked world-setting transport.
  await evaluate(`(async () => {
    await new Promise(resolve => setTimeout(resolve, 1100));
    window.doomUpdates = [];
    window.doomChat = [];
    window.doomRolls = 0;
    window.doomSettings = new Map();
    window.doomGM = game.users.get('test');
    game.user = doomGM;
    game.settings.register = (_module, key, config) => { doomSettings.set(key, config); studio.values[key] = config.default; };
    game.settings.set = async (_module, key, value) => {
      studio.values[key] = structuredClone(value);
      doomUpdates.push(studio.values[key]);
      doomSettings.get(key)?.onChange();
    };
    foundry.applications.api.DialogV2.prompt = async config => {
      const form = document.createElement('form');
      form.innerHTML = config.content + '<button></button>';
      form.elements.stakes.value = '<b>Save the crew</b>';
      form.elements.target.value = '12';
      return config.ok.callback(null, form.querySelector('button'));
    };
    foundry.dice = { Roll: class {
      constructor(formula) { if (formula !== '1d20') throw Error(formula); }
      async evaluate() { doomRolls++; return { total: 14 }; }
    }};
    foundry.documents = { ChatMessage: {
      getSpeaker: () => ({}),
      create: async data => doomChat.push({ data, visible: !!document.querySelector('.hcci-doom[data-phase="revealed"]') })
    }};
    studio.registerBoxOfDoom();
    await studio.openBoxOfDoom();
  })()`);
  assert.equal(await evaluate(`document.querySelector('.hcci-doom').dataset.phase`), 'sealed');
  assert.equal(await evaluate(`document.querySelector('.hcci-doom-stakes').textContent`), '<b>Save the crew</b>');
  assert.equal(await evaluate(`doomUpdates.some(update => 'total' in update)`), false);
  await evaluate(`game.user = game.users.get('two'); studio.renderBoxOfDoom()`);
  assert.equal(await evaluate(`document.querySelectorAll('.hcci-doom button').length`), 0);
  await evaluate(`game.user = doomGM; studio.renderBoxOfDoom(); document.querySelector('.hcci-doom button:last-child').click()`);
  assert.equal(await evaluate(`document.querySelector('.hcci-doom')`), null);
  assert.equal(await evaluate(`doomRolls`), 0);
  await evaluate(`studio.openBoxOfDoom()`);
  await size(1440,900);
  await screenshot('box-of-doom-sealed.png');
  await evaluate(`{ const roll = document.querySelector('.hcci-doom button'); roll.click(); roll.click(); }`);
  assert.equal(await evaluate(`doomRolls`), 1);
  assert.equal(await evaluate(`doomChat.length`), 0);
  assert.equal(await evaluate(`doomUpdates.some(update => 'total' in update)`), false);
  await delay(930);
  assert.equal(await evaluate(`document.querySelector('.hcci-doom-status strong').textContent`), '14');
  assert.equal(await evaluate(`document.querySelector('.hcci-doom').dataset.outcome`), 'success');
  await delay(390);
  await screenshot('box-of-doom-result.png');
  await delay(530);
  assert.deepEqual(await evaluate(`doomChat.map(({ data, visible }) => ({ visible, whisper:data.whisper, escaped:data.content.includes('&lt;b&gt;') }))`),
    [{ visible:true, whisper:[], escaped:true }]);
  await evaluate(`document.querySelector('.hcci-doom button').click()`);
  assert.equal(await evaluate(`document.querySelector('.hcci-doom')`), null);
  assert.deepEqual(errors,[]);
  // Verify the review artifact opens from disk with no local server dependency.
  await call('Page.navigate',{url:pathToFileURL(path.join(output,'effect-studio.html')).href});
  await delay(300);
  for(let i=0;i<50;i++) { if(await evaluate('!!window.ready')) break; await delay(100); }
  assert.equal(await evaluate(`document.querySelectorAll('#preset option').length`),ids.length);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.hcci-overlay')).position`),'fixed');
  await screenshot('studio.png');
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
  console.log(`PASS: Box of Doom, Shattered Fate geometry and playback, Manga storyboard and 800–8000 ms playback, all preset outcomes, responsive layouts, both fonts, actor-only labels and accessibility variants, all configuration/payload IDs, flash-off, slow audio, Escape, queue recovery, and configuration navigation, local tests, save and reset. Captures: ${output}`);
  if(process.argv.includes('--serve')) { await evaluate('document.body.classList.remove("capture")'); console.log(`Effect studio: ${url}`); await new Promise(()=>{}); }
} finally {
  ws?.close(); browser.kill(); await new Promise(resolve => server.close(resolve));
}
