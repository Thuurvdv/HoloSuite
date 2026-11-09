// Run only against a disposable D&D5e or SF2e world: this creates world documents.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import assert from 'node:assert/strict';
import { CDP } from './helpers/cdp.mjs';
const base = process.env.HOLOLOOT_QA_URL ?? 'http://hololoot.test:30059';
const port = Number(process.env.HOLOLOOT_DEBUG_PORT ?? 9520);
const output = process.env.HOLOLOOT_QA_OUTPUT ?? new URL('../.qa', import.meta.url).pathname;
fs.mkdirSync(output, { recursive: true });
const browser = spawn(process.env.HOLOLOOT_BROWSER ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--host-resolver-rules=MAP hololoot.test 127.0.0.1', '--no-proxy-server',
  `--remote-debugging-port=${port}`, `--user-data-dir=${os.tmpdir()}/hololoot-currency-${Date.now()}`, `${base}/game`
], { windowsHide: true, stdio: 'ignore' });
let gm, p1, p2, control;
const results = {};
async function attach(target) {
  const client = new CDP(target.webSocketDebuggerUrl); await client.connect();
  await client.call('Emulation.setDeviceMetricsOverride', { width: 1200, height: 900, deviceScaleFactor: 1, mobile: false });
  return client;
}
try {
  let target;
  for (let i = 0; i < 100 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch {}
    if (!target) await new Promise(resolve => setTimeout(resolve, 200));
  }
  gm = await attach(target);
  await gm.until('globalThis.game?.ready || document.querySelector("select[name=userid], select[name=userId]")', 60000);
  if (!await gm.eval('!!game.ready')) {
    await gm.eval(`(()=>{const select=document.querySelector('select[name=userid], select[name=userId]');select.value=[...select.options].find(o=>/gamemaster/i.test(o.textContent)).value;document.querySelector('button[name=join]').click();return true})()`);
    await gm.until('game.ready', 60000);
  }
  if (!await gm.eval('game.modules.get("holosuite-loot")?.active')) {
    await gm.eval('game.settings.set("core","moduleConfiguration",{"holosuite-core":true,"holosuite-loot":true})');
    await gm.call('Page.reload');
  }
  await gm.until('game.ready && game.modules.get("holosuite-loot")?.api', 60000);
  const system = await gm.eval('game.system.id');
  assert.ok(['dnd5e', 'sf2e'].includes(system));
  await gm.eval(`(async()=>{globalThis.qaLauncher=await game.modules.get('holosuite-core').api.openLauncher();return true})()`);
  await gm.until('document.querySelector(".holosuite-app-icon[data-holosuite-app-icon=holosuite-loot]")');
  const iconStyle = await gm.eval(`(()=>{const icon=document.querySelector('.holosuite-app-icon[data-holosuite-app-icon=holosuite-loot]');const css=getComputedStyle(icon,'::before');return {mask:css.maskImage, color:css.backgroundColor, display:css.display}})()`);
  assert.match(iconStyle.mask, /loot-launcher\.svg/);
  assert.equal(iconStyle.color, 'rgb(255, 240, 206)');
  assert.notEqual(iconStyle.display, 'none');
  await gm.eval('(async()=>{await qaLauncher.close();return true})()');
  results.creamLauncherIcon = true;
  results.version = await gm.eval('({foundry:game.version,system:game.system.id,systemVersion:game.system.version,moduleVersion:game.modules.get("holosuite-loot").api.version})');
  const fixture = await gm.eval(`(async()=>{
    const sf=game.system.id==='sf2e';
    await game.settings.set('holosuite-loot','characterSelector',false);
    await game.settings.set('holosuite-loot','lootRange',0);
    const u1=game.users.find(u=>u.name==='Currency QA A')??await User.create({name:'Currency QA A',role:1});
    const u2=game.users.find(u=>u.name==='Currency QA B')??await User.create({name:'Currency QA B',role:1});
    const a1=await Actor.create({name:'Currency Hero A',type:'character',ownership:{[u1.id]:3}});
    const a2=await Actor.create({name:'Currency Hero B',type:'character',ownership:{[u2.id]:3}});
    await u1.update({character:a1.id});await u2.update({character:a2.id});
    const npc=await Actor.create({name:'Currency Pirate',type:'npc',items:[{name:'Utility Kit',type:'equipment',system:{quantity:2}}]});
    const cash=await Actor.create({name:'Currency Only',type:'npc'});
    if(sf){await a1.inventory.addCurrency({credits:3});await a2.inventory.addCurrency({credits:5});await npc.inventory.addCurrency({credits:12,upb:7});await cash.inventory.addCurrency({credits:9});}
    else{await a1.update({'system.currency.gp':3});await a2.update({'system.currency.gp':5});await npc.update({'system.currency.gp':12,'system.currency.sp':7});await cash.update({'system.currency.gp':9});}
    const scene=await Scene.create({name:'HoloLoot Currency QA',width:1800,height:1200,padding:0,tokenVision:false});
    await scene.activate();await scene.view();
    const [one,two,only]=await scene.createEmbeddedDocuments('Token',[
      {name:'Pirate One',actorId:npc.id,actorLink:true,x:450,y:400,flags:{'holosuite-loot':{config:{mode:'enabled'}}}},
      {name:'Pirate Two',actorId:npc.id,actorLink:false,x:650,y:400,flags:{'holosuite-loot':{config:{mode:'enabled'}}}},
      {name:'Currency Only',actorId:cash.id,actorLink:false,x:850,y:400,flags:{'holosuite-loot':{config:{mode:'enabled'}}}}
    ]);
    globalThis.currencyQA={u1:u1.id,u2:u2.id,a1:a1.id,a2:a2.id,npc:npc.id,cash:cash.id,scene:scene.id,one:one.uuid,two:two.uuid,only:only.uuid};
    globalThis.money=actor=>sf?actor.inventory.currency.credits:actor.system.currency.gp;
    return currencyQA;
  })()`);
  console.log('Currency fixture ready', JSON.stringify(results.version));
  control = new CDP((await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl); await control.connect();
  async function player(userId) {
    const { browserContextId } = await control.call('Target.createBrowserContext');
    const { targetId } = await control.call('Target.createTarget', { url: `${base}/join`, browserContextId });
    const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.id === targetId);
    const client = await attach(page);
    await client.until('document.querySelector("select[name=userid], select[name=userId]")', 60000);
    await client.eval(`document.querySelector('select[name=userid], select[name=userId]').value=${JSON.stringify(userId)};document.querySelector('button[name=join]').click();true`);
    await client.until('game.ready && game.modules.get("holosuite-loot")?.api', 60000);
    await client.eval(`globalThis.currencyQA=${JSON.stringify(fixture)};globalThis.lootAPI=game.modules.get('holosuite-loot').api;true`);
    return client;
  }
  p1 = await player(fixture.u1); p2 = await player(fixture.u2);
  await p1.eval(`(async()=>{globalThis.qaLauncher=await game.modules.get('holosuite-core').api.openLauncher();return true})()`);
  assert.equal(await p1.eval('!!document.querySelector("[data-holosuite-app=holosuite-loot]")'), false);
  await p1.eval('(async()=>{await qaLauncher.close();return true})()');
  results.gmOnlyLauncher = true;
  const view = await p1.eval(`lootAPI.request({action:'view',tokenUuid:currencyQA.one})`);
  const main = view.entries.find(entry => entry.currency && entry.name === (system === 'sf2e' ? 'Credits' : 'Gold'));
  assert.equal(main.quantity, 12); assert.equal(view.entries.filter(e => e.currency).length, 2);
  await p1.eval(`lootAPI.open(fromUuidSync(currencyQA.one));true`);
  await p1.until('document.querySelectorAll(".hl-currency").length===2');
  await p1.until('document.querySelector(".hl-currency img")?.naturalWidth>0');
  await p1.screenshot(`${output}/currency-${system}.png`);
  results.currencyRowsAndNativeAmounts = true;
  await Promise.all([
    p1.eval(`lootAPI.request({action:'take',entryId:${JSON.stringify(main.id)},tokenUuid:currencyQA.one})`),
    p2.eval(`lootAPI.request({action:'take',entryId:${JSON.stringify(main.id)},tokenUuid:currencyQA.one})`)
  ]);
  assert.equal(await gm.eval('money(game.actors.get(currencyQA.a1))+money(game.actors.get(currencyQA.a2))'), 20);
  assert.equal(await gm.eval('money(fromUuidSync(currencyQA.one).actor)'), 0);
  results.simultaneousCurrencyClaim = true;
  const all = await p2.eval(`lootAPI.request({action:'all',tokenUuid:currencyQA.one})`);
  assert.deepEqual(all.failures, []); assert.equal(all.entries.length, 0);
  await p1.until('document.querySelector(".hl-empty")');
  assert.equal(await gm.eval(`game.system.id==='sf2e'?fromUuidSync(currencyQA.one).actor.inventory.currency.upb:fromUuidSync(currencyQA.one).actor.system.currency.sp`), 0);
  assert.equal(await gm.eval('money(game.actors.get(currencyQA.npc))'), 12);
  assert.equal(await gm.eval('money(fromUuidSync(currencyQA.two).actor)'), 12);
  assert.equal(await gm.eval('fromUuidSync(currencyQA.one).actorLink'), false);
  results.lootAllAndSourceDepletion = true; results.linkedTokenIsolation = true; results.panelSynchronization = true;
  // Currency alone keeps the container and badge alive.
  const only = await p1.eval(`lootAPI.request({action:'view',tokenUuid:currencyQA.only})`);
  assert.equal(only.entries.length, 1); assert.equal(only.entries[0].quantity, 9);
  await p1.until(`!!canvas.tokens.get('${fixture.only.split('.').at(-1)}').getChildByName('holosuite-loot-badge')`);
  await p1.eval(`lootAPI.request({action:'all',tokenUuid:currencyQA.only})`);
  await p1.until(`!canvas.tokens.get('${fixture.only.split('.').at(-1)}').getChildByName('holosuite-loot-badge')`);
  results.currencyOnlyContainer = true;
  // Inject one failed source write after the recipient has already received payment.
  const failure = await gm.eval(`(async()=>{
    const [token]=await game.scenes.get(currencyQA.scene).createEmbeddedDocuments('Token',[{name:'Retry Currency',actorId:currencyQA.cash,x:1050,y:400,flags:{'holosuite-loot':{config:{mode:'enabled'}}}}]);
    const actor=token.actor,method=game.system.id==='sf2e'?'deleteEmbeddedDocuments':'update',original=actor[method].bind(actor);
    let failed=false;actor[method]=async(...args)=>{const debit=method==='deleteEmbeddedDocuments'||Object.keys(args[0]).some(key=>key.includes('.currencyDebits.'));if(!failed&&debit){failed=true;throw Error('injected source failure')}return original(...args)};
    globalThis.restoreCurrencySource=()=>{actor[method]=original};return token.uuid;
  })()`);
  const pending = await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(failure)}})`);
  const before = await gm.eval('money(game.actors.get(currencyQA.a1))');
  const failed = await p1.eval(`lootAPI.request({action:'take',entryId:${JSON.stringify(pending.entries[0].id)},tokenUuid:${JSON.stringify(failure)}})`);
  assert.equal(failed.failures.length, 1); assert.equal(await gm.eval('money(game.actors.get(currencyQA.a1))'), before + 9);
  await gm.eval('restoreCurrencySource();true');
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(failure)}})`)).entries.length, 0);
  assert.equal(await gm.eval('money(game.actors.get(currencyQA.a1))'), before + 9);
  results.partialFailureRecovery = true;
  // Two players can pay the same jointly owned character from independent corpses.
  const raced = await gm.eval(`(async()=>{
    await game.actors.get(currencyQA.a1).update({['ownership.'+currencyQA.u2]:3});await game.users.get(currencyQA.u2).update({character:currencyQA.a1});
    const tokens=await game.scenes.get(currencyQA.scene).createEmbeddedDocuments('Token',[1100,1300].map(x=>({name:'Concurrent Currency',actorId:currencyQA.cash,x,y:600,flags:{'holosuite-loot':{config:{mode:'enabled'}}}})));
    return tokens.map(t=>t.uuid);
  })()`);
  await p2.until('game.user.character?.id===currencyQA.a1');
  const raceBefore = await gm.eval('money(game.actors.get(currencyQA.a1))');
  await Promise.all([p1.eval(`lootAPI.request({action:'all',tokenUuid:${JSON.stringify(raced[0])}})`), p2.eval(`lootAPI.request({action:'all',tokenUuid:${JSON.stringify(raced[1])}})`)]);
  assert.equal(await gm.eval('money(game.actors.get(currencyQA.a1))'), raceBefore + 18);
  results.concurrentCorpsesSameRecipient = true;
  const oldOrigin = await p1.eval('performance.timeOrigin');
  await p1.call('Page.reload');
  await p1.until(`performance.timeOrigin !== ${oldOrigin} && globalThis.game?.ready && game.modules.get("holosuite-loot")?.api`, 60000);
  await p1.eval(`globalThis.currencyQA=${JSON.stringify(fixture)};globalThis.lootAPI=game.modules.get('holosuite-loot').api;true`);
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:currencyQA.one})`)).entries.length, 0);
  results.reloadPersistence = true;
  await gm.eval(`(async()=>{await fromUuidSync(currencyQA.two).update({hidden:true});return true})()`);
  assert.equal(await p1.eval(`lootAPI.request({action:'all',tokenUuid:currencyQA.two}).then(()=>false,e=>e.code)`), 'AccessDenied');
  results.hiddenCurrencyDenied = true;
  fs.writeFileSync(`${output}/currency-${system}-results.json`, JSON.stringify(results, null, 2)); console.log(JSON.stringify(results));
} catch (error) {
  if (gm) console.log('GM currency diagnostic', await gm.eval('({ready:game.ready,system:game.system?.id,notices:[...document.querySelectorAll(".notification")].map(e=>e.textContent)})').catch(() => null));
  if (p1) await p1.screenshot(`${output}/currency-failure.png`).catch(() => {});
  throw error;
} finally {
  p1?.ws.close(); p2?.ws.close(); control?.ws.close();
  if (gm) { await gm.call('Browser.close').catch(() => {}); gm.ws.close(); } else browser.kill();
}
