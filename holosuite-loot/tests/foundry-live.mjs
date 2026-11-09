import { spawn } from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { CDP } from './helpers/cdp.mjs';
import { REQUEST_FLAG, RESPONSE_FLAG } from '../src/model.mjs';
// Use only against a disposable D&D5e QA world: this script creates documents.
const debugPort = Number(process.env.HOLOLOOT_DEBUG_PORT ?? 9498);
const base = process.env.HOLOLOOT_QA_URL ?? 'http://127.0.0.1:30058';
const insecure = new URL(base).hostname === 'hololoot.test';
const root = process.env.HOLOLOOT_QA_OUTPUT ?? fileURLToPath(new URL('../.qa', import.meta.url));
fs.mkdirSync(root,{recursive:true});
const browser = spawn(process.env.HOLOLOOT_BROWSER ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ['--headless=new','--no-sandbox','--disable-gpu-sandbox','--disable-gpu','--no-first-run','--no-default-browser-check',
   ...(insecure ? ['--host-resolver-rules=MAP hololoot.test 127.0.0.1','--no-proxy-server'] : []),
   `--remote-debugging-port=${debugPort}`,`--user-data-dir=${process.env.HOLOLOOT_BROWSER_PROFILE ?? `${root}/browser-${Date.now()}`}`, `${base}/game`], {windowsHide:true,stdio:'ignore'});
let gm, p1, p2, control;
const results = {};
try {
  let target;
  for(let i=0;i<80;i++) {
    try { target=(await(await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find(t=>t.type==='page');if(target) break; } catch{}
    await new Promise(r=>setTimeout(r,250));
  }
  gm=new CDP(target.webSocketDebuggerUrl);await gm.connect();
  gm.ws.addEventListener("message",({data})=>{const event=JSON.parse(data);if(event.method==="Runtime.exceptionThrown") console.log("Browser exception",JSON.stringify(event.params.exceptionDetails));if(event.method==="Runtime.consoleAPICalled"&&["error","warn"].includes(event.params.type)) console.log("Browser console",event.params.args.map(a=>a.description??a.value));});
  await gm.call("Runtime.enable");
  await gm.call('Emulation.setDeviceMetricsOverride',{width:1200,height:900,deviceScaleFactor:1,mobile:false});
  await gm.until('game?.ready || document.querySelector("[name=userid], [name=userId]")',40000);
  if(!await gm.eval('!!game.ready')) {
    await gm.eval('(()=>{const select=document.querySelector("[name=userid], [name=userId]");select.value=[...select.options].find(o=>/gamemaster/i.test(o.textContent))?.value??select.options[1].value})();document.querySelector("button[name=join]").click();true');
    await gm.until('game.ready',40000);
  }
  if(!await gm.eval('game.modules.get("holosuite-loot")?.active')) {
    await gm.eval('game.settings.set("core","moduleConfiguration",{"holosuite-core":true,"holosuite-loot":true})');
    await gm.call('Page.reload');
  }
  await gm.until('game.ready && game.modules.get("holosuite-loot")?.api',40000);
  results.moduleVersion=await gm.eval('game.modules.get("holosuite-loot").api.version');
  if (insecure) {
    assert.equal(await gm.eval('!isSecureContext && crypto.subtle === undefined'),true);
    results.plainHTTPWithoutWebCrypto=true;
  }
  console.log('GM ready');
  await gm.eval(`game.settings.set('holosuite-loot','characterSelector',false)`);
  const seeded=await gm.eval(`(async()=>{
    const u1=game.users.find(u=>u.name==='Loot QA A')??await User.create({name:'Loot QA A',role:1});
    const u2=game.users.find(u=>u.name==='Loot QA B')??await User.create({name:'Loot QA B',role:1});
    const a1=await Actor.create({name:'Loot Hero A',type:'character',ownership:{[u1.id]:3}});
    const a2=await Actor.create({name:'Loot Hero B',type:'character',ownership:{[u2.id]:3}});
    await u1.update({character:null});await u2.update({character:a2.id});
    const npc=await Actor.create({name:'Loot Space Pirate',type:'npc',items:[
      {name:'Plasma Pistol',type:'weapon',system:{quantity:2,type:{value:'simpleR'}}},
      {name:'Med Pack',type:'consumable',system:{quantity:3}},
      {name:'Bite',type:'weapon',system:{quantity:1,type:{value:'natural'}}},
      {name:'Passive Feature',type:'feat'},{name:'Spell',type:'spell'}
    ]});
    await npc.update({'system.attributes.hp.value':10,'system.attributes.hp.max':10});
    const scene=await Scene.create({name:'HoloLoot QA',width:1800,height:1200,padding:0,tokenVision:false,grid:{type:1,size:100,distance:5,units:'ft'}});
    await scene.activate();await scene.view();
    await scene.createEmbeddedDocuments('Token',[{name:'Owned Hero',actorId:a1.id,actorLink:true,x:200,y:400}]);
    const tokens=await scene.createEmbeddedDocuments('Token',[
      {name:'Pirate One',actorId:npc.id,actorLink:true,x:450,y:400},
      {name:'Pirate Two',actorId:npc.id,actorLink:false,x:650,y:400,flags:{'holosuite-loot':{config:{mode:'enabled',source:'inventory'}}}}
    ]);
    globalThis.lootQA={u1:u1.id,u2:u2.id,a1:a1.id,a2:a2.id,npc:npc.id,scene:scene.id,t1:tokens[0].uuid,t2:tokens[1].uuid};
    return lootQA;
  })()`);
  console.log('Seeded',JSON.stringify(seeded));
  const gmPoint=await gm.eval(`(()=>{const p=canvas.stage.worldTransform.apply(fromUuidSync(lootQA.t1).object.center);return {x:p.x,y:p.y}})()`);
  await gm.call('Input.dispatchMouseEvent',{type:'mouseMoved',...gmPoint});
  await gm.call('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',buttons:2,clickCount:1,...gmPoint});
  await gm.call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'right',buttons:0,clickCount:1,...gmPoint});
  await gm.eval(`(async()=>{const token=fromUuidSync(lootQA.t1).object;token.control();await (canvas.tokens.hud??canvas.hud.token).bind(token);return true})()`);
  await gm.until('document.querySelector("#token-hud .hl-token-action")');
  assert.equal(await gm.eval('!!document.querySelector(".holosuite-loot-popup")'),false);
  assert.equal(await gm.eval('[...document.querySelectorAll("#token-hud .hl-token-action")].some(b=>b.title===game.i18n.localize("HL.Loot"))'),true);
  results.gmRightClickControlsOnly=true;
  assert.equal(await gm.eval('document.querySelectorAll("#token-hud .hl-token-action").length'),1);
  await gm.eval('document.querySelector("#token-hud .hl-token-action").click();true');
  await gm.until('document.querySelector(".holosuite-loot-config .hl-config-title")');
  assert.equal(await gm.eval('document.querySelector(".hl-config-title").textContent.trim()'),'HoloSuite Loot');
  assert.equal(await gm.eval('document.querySelector(".hl-auto-warning")?.title'),'Automatic detection turned on - experimental');
  assert.equal(await gm.eval('!!document.querySelector(".holosuite-loot-popup, [name=source], [data-drop]")'),false);
  results.singleGMActionOpensConfiguration=true;
  await gm.eval('document.querySelector(".holosuite-loot-config [data-close]").click();true');
  await gm.until('!document.querySelector(".holosuite-loot-config")');
  await gm.eval(`(async()=>{await game.settings.set('holosuite-loot','zeroHP',false);await game.settings.set('holosuite-loot','hideGmLootButton',true);const hud=canvas.tokens.hud??canvas.hud.token;await hud.bind(fromUuidSync(lootQA.t1).object);hud.render(true);await game.modules.get('holosuite-loot').api.configure(fromUuidSync(lootQA.t1));return true})()`);
  await gm.until('document.querySelector(".holosuite-loot-config select")');
  assert.equal(await gm.eval('!!document.querySelector(".hl-auto-warning, .holosuite-loot-config option[value=automatic], #token-hud .hl-token-action")'),false);
  await gm.eval(`(async()=>{document.querySelector('.holosuite-loot-config [data-close]').click();await game.settings.set('holosuite-loot','hideGmLootButton',false);await game.settings.set('holosuite-loot','zeroHP',true);return true})()`);
  results.detectionAndGmHudSettings=true;
  control=new CDP((await(await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json()).webSocketDebuggerUrl);await control.connect();
  async function player(userId) {
    const {browserContextId}=await control.call('Target.createBrowserContext');
    const {targetId}=await control.call('Target.createTarget',{url:`${base}/join`,browserContextId});
    const page=(await(await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find(t=>t.id===targetId);
    const client=new CDP(page.webSocketDebuggerUrl);await client.connect();
    client.ws.addEventListener("message",({data})=>{const event=JSON.parse(data);if(event.method==="Runtime.exceptionThrown") console.log("Player exception",JSON.stringify(event.params.exceptionDetails));});await client.call("Runtime.enable");
    await client.call('Emulation.setDeviceMetricsOverride',{width:1200,height:900,deviceScaleFactor:1,mobile:false});
    await client.until('document.querySelector("[name=userid], [name=userId]")',20000).catch(async()=>{await client.call('Page.reload');await client.until('document.querySelector("[name=userid], [name=userId]")',60000)}).catch(async error=>{console.log('Join diagnostic',await client.eval('({url:location.href,text:document.body.innerText.slice(0,1000)})'));throw error});
    await client.eval(`document.querySelector('[name=userid], [name=userId]').value=${JSON.stringify(userId)};document.querySelector('button[name=join]').click();true`);
    await client.until('game.ready && game.modules.get("holosuite-loot")?.api',40000);
    // Foundry automatically opens User Configuration when no character is assigned.
    // Dismiss that native first-login prompt before testing canvas interaction.
    await client.eval('(async()=>{await game.user.sheet.close();return true})()');
    if (insecure) assert.equal(await client.eval('!isSecureContext && crypto.subtle === undefined'),true);
    await client.eval(`globalThis.lootQA=${JSON.stringify(seeded)};globalThis.lootAPI=game.modules.get('holosuite-loot').api;true`);
    return client;
  }
  p1=await player(seeded.u1);p2=await player(seeded.u2);
  assert.equal(await gm.eval('game.settings.settings.get("holosuite-loot.lootRange").default'),15);
  await gm.eval('game.settings.set("holosuite-loot","lootRange",15)');
  const rangeRequest = `lootAPI.request({action:'view',tokenUuid:lootQA.t2})`;
  assert.equal(await p1.eval(`${rangeRequest}.then(()=>false,e=>e.code)`),'OutOfRange');
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:350}).then(()=>true)');
  const reachableLoot = await p1.eval(rangeRequest);
  assert.ok(reachableLoot.entries.length);
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:200}).then(()=>true)');
  assert.equal(await p1.eval(`lootAPI.request({action:'take',tokenUuid:lootQA.t2,entryId:${JSON.stringify(reachableLoot.entries[0].id)}}).then(()=>false,e=>e.code)`),'OutOfRange');
  await gm.eval('game.settings.set("holosuite-loot","lootRange",4)');
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:650,elevation:15}).then(()=>true)');
  assert.ok((await p1.eval(rangeRequest)).entries.length);
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:200,elevation:0}).then(()=>true)');
  await gm.eval('game.settings.set("holosuite-loot","lootRange",10)');
  const rangeCorpse = await gm.eval(`(async()=>{
    const npc=await Actor.create({name:'Loot Range QA',type:'npc',items:['Range Test Item','Close Range Item']
      .map(name=>({name,type:'loot',system:{quantity:1}}))});
    const [token]=await canvas.scene.createEmbeddedDocuments('Token',[{name:npc.name,actorId:npc.id,x:650,y:600,
      flags:{'holosuite-loot':{config:{mode:'enabled'}}}}]);
    return token.uuid;
  })()`);
  const openRangeCorpse = `lootAPI.open(fromUuidSync(${JSON.stringify(rangeCorpse)}))`;
  await p1.until(`fromUuidSync(${JSON.stringify(rangeCorpse)})?.object?.isVisible`);
  await p1.eval(openRangeCorpse);
  assert.equal(await p1.eval('!!document.querySelector(".holosuite-loot-popup")'),false);
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:450,y:600}).then(()=>true)');
  await p1.eval(openRangeCorpse);
  await p1.until('document.querySelectorAll(".holosuite-loot-popup .hl-item").length===2');
  await p1.eval('[...document.querySelectorAll(".holosuite-loot-popup .hl-item")].find(row=>row.textContent.includes("Range Test Item")).querySelector("[data-loot]").click();true');
  await gm.until('game.actors.get(lootQA.a1).items.some(item=>item.name==="Range Test Item")');
  await p1.until('document.querySelectorAll(".holosuite-loot-popup .hl-item").length===1');
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:550}).then(()=>true)');
  await p1.eval('document.querySelector(".holosuite-loot-popup [data-loot=all]").click();true');
  await gm.until('game.actors.get(lootQA.a1).items.some(item=>item.name==="Close Range Item")');
  await gm.eval('canvas.scene.tokens.find(t=>t.actorId===lootQA.a1).update({x:200,y:400}).then(()=>true)');
  await p1.until('!document.querySelector(".holosuite-loot-popup")');
  console.log('Loot range passed live at 10 ft, closer than 10 ft, and outside 10 ft.');
  await gm.eval('game.settings.set("holosuite-loot","lootRange",0)');
  assert.ok((await p1.eval(rangeRequest)).entries.length);
  results.configurableLootRange=true;
  const rulesToken = await gm.eval(`(async()=>{
    const npc=await Actor.create({name:'Loot Rules QA',type:'npc',items:[
      {name:'Rounds',type:'loot',system:{quantity:300}},
      {name:'Medkit',type:'consumable',system:{quantity:20}},
      {name:'Quest item',type:'loot',system:{quantity:1}}
    ]});
    const [token]=await canvas.scene.createEmbeddedDocuments('Token',[{name:npc.name,actorId:npc.id,actorLink:false,x:850,y:400,
      flags:{'holosuite-loot':{config:{mode:'enabled'}}}}]);
    await game.modules.get('holosuite-loot').api.configure(token);
    return token.uuid;
  })()`);
  await gm.until('document.querySelectorAll(".holosuite-loot-config [data-rule-item]").length===3');
  const setRules = async (names, behavior, formula = '', scope = 'token') => {
    await gm.eval(`(()=>{
      const config=document.querySelector('.holosuite-loot-config');
      config.querySelector('[name=scope]').value=${JSON.stringify(scope)};
      config.querySelector('[name=scope]').dispatchEvent(new Event('change'));
      for(const input of config.querySelectorAll('[data-rule-item]')) {
        if(${JSON.stringify(names)}.includes(input.getAttribute('aria-label'))) input.click();
      }
      config.querySelector('[name=behavior]').value=${JSON.stringify(behavior)};
      config.querySelector('[name=behavior]').dispatchEvent(new Event('change'));
      config.querySelector('[name=formula]').value=${JSON.stringify(formula)};
      config.querySelector('[data-apply]').click();
      return true;
    })()`);
    await gm.until('document.querySelector(".holosuite-loot-config [data-apply]")?.disabled && !document.querySelector(".holosuite-loot-config [data-rule-item]:checked")');
  };
  await setRules(['Medkit', 'Quest item'], 'never');
  await setRules(['Rounds'], 'quantity', '1d6');
  await setRules(['Medkit'], 'quantity', '2', 'actor');
  assert.ok(await gm.eval('Array.from(document.querySelectorAll(".holosuite-loot-config [data-scoped-rule]")).some(row=>row.textContent.includes("NPC actor 2"))'));
  const inspectRules = `lootAPI.request({action:'view',tokenUuid:${JSON.stringify(rulesToken)}})`;
  const firstRules = (await p1.eval(inspectRules)).entries;
  assert.deepEqual(firstRules.map(entry => entry.name), ['Rounds']);
  assert.equal(firstRules[0].formula,'1d6');
  assert.equal(firstRules[0].quantity,300);
  assert.deepEqual((await p2.eval(inspectRules)).entries, firstRules);
  const futureRules = await gm.eval(`(async()=>{
    const actorId=fromUuidSync(${JSON.stringify(rulesToken)}).actorId;
    const [token]=await canvas.scene.createEmbeddedDocuments('Token',[{name:'Future Rules QA',actorId,actorLink:true,x:850,y:550,
      flags:{'holosuite-loot':{config:{mode:'enabled'}}}}]);
    return token.uuid;
  })()`);
  const futureLoot = await p2.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(futureRules)}})`);
  assert.equal(futureLoot.entries.find(entry => entry.name === 'Medkit').quantity, 2);
  assert.equal(futureLoot.entries.find(entry => entry.name === 'Rounds').quantity, 300);
  await p1.eval(`lootAPI.configure(fromUuidSync(${JSON.stringify(rulesToken)}))`);
  assert.equal(await p1.eval('!!document.querySelector(".holosuite-loot-config")'), false);
  await gm.eval(`(async()=>{
    const actor=fromUuidSync(${JSON.stringify(rulesToken)}).actor;
    await actor.createEmbeddedDocuments('Item',[
      {name:'Added salvage',type:'loot',system:{quantity:9}},
      {name:'Test grenade',type:'loot',system:{quantity:1}}
    ]);
    document.querySelector('.holosuite-loot-config [data-refresh-inventory]').click();
    return true;
  })()`);
  await gm.until('document.querySelector(".holosuite-loot-config .hl-items").textContent.includes("Added salvage")');
  await setRules(['Test grenade'], 'quantity', '2d6+2');
  const grenade = (await p1.eval(inspectRules)).entries.find(entry => entry.name === 'Test grenade');
  assert.equal(grenade.formula,'2d6+2');
  await p1.eval(`lootAPI.request({action:'take',tokenUuid:${JSON.stringify(rulesToken)},entryId:${JSON.stringify(grenade.id)}})`);
  const awardedGrenades = await gm.eval('game.actors.get(lootQA.a1).items.find(item=>item.name==="Test grenade")?.system.quantity');
  assert.ok(awardedGrenades >= 4 && awardedGrenades <= 14);
  assert.equal(await gm.eval(`fromUuidSync(${JSON.stringify(rulesToken)}).actor.items.some(item=>item.name==="Test grenade")`),false);
  await p1.until(`game.messages.contents.some(message=>message.isRoll && message.whisper.includes(game.user.id)
    && message.flavor?.includes("Test grenade") && message.rolls[0]?.total === ${awardedGrenades})`);
  console.log('Generated loot passed live from one grenade, including the player roll message.');
  const refreshedLoot = (await p1.eval(inspectRules)).entries;
  assert.equal(refreshedLoot.find(entry => entry.name === 'Added salvage').quantity, 9);
  assert.deepEqual(refreshedLoot.find(entry => entry.name === 'Rounds'), firstRules[0]);
  await gm.screenshot(`${root}/loot-rules.png`);
  await gm.eval('document.querySelector(".holosuite-loot-config [data-close]").click();true');
  results.inventoryRulesBulkEditAndStableDice = true;
  assert.equal(await p1.eval('fromUuidSync(lootQA.t1).actor.testUserPermission(game.user,"OWNER")'),false);
  // The zero-HP setting does not make a healthy, unconfigured NPC lootable.
  await gm.eval(`game.settings.set('holosuite-loot','zeroHP',true)`);
  await p1.until('game.settings.get("holosuite-loot","zeroHP")');
  assert.equal(await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t1}).then(()=>false,e=>e.code)`),'Unavailable');
  assert.equal(await p1.eval(`!!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`),false);
  await gm.eval(`(async()=>{await game.actors.get(lootQA.npc).update({'system.attributes.hp.value':0});return true})()`);
  await p1.until('fromUuidSync(lootQA.t1).actor.system.attributes.hp.value===0');
  await p1.until(`!!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`);
  results.livingNPCDeniedWithZeroHPSetting=true;
  results.zeroHPPresentsLootMarker=true;
  const v1=await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t1})`);
  console.log('View',JSON.stringify(v1));
  assert.deepEqual(v1.entries.map(e=>[e.name,e.quantity]).sort(),[['Med Pack',3],['Plasma Pistol',2]]);
  results.filtering=true;results.defaultLootability=true;
  assert.equal(await p1.eval('game.user.character===null'),true);
  results.ownedTokenWithoutUserAssignment=true;
  await gm.eval(`(async()=>{await game.actors.get(lootQA.npc).update({'system.attributes.hp.value':1});return true})()`);
  await p1.until('fromUuidSync(lootQA.t1).actor.system.attributes.hp.value===1');
  await p1.until(`!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`);
  assert.equal(await p1.eval(`lootAPI.request({action:'all',tokenUuid:lootQA.t1}).then(()=>false,e=>e.code)`),'Unavailable');
  await gm.eval(`(async()=>{await game.actors.get(lootQA.npc).update({'system.attributes.hp.value':0});return true})()`);
  await p1.until(`!!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`);
  results.revivedNPCDeniedAndMarkerRemoved=true;
  const entry=v1.entries.find(e=>e.name==='Plasma Pistol').id;
  await Promise.all([
    p1.eval(`lootAPI.request({action:'take',tokenUuid:lootQA.t1,actorId:lootQA.a1,entryId:${JSON.stringify(entry)}})`),
    p2.eval(`lootAPI.request({action:'take',tokenUuid:lootQA.t1,actorId:lootQA.a2,entryId:${JSON.stringify(entry)}})`)
  ]);
  assert.equal(await gm.eval(`[game.actors.get(lootQA.a1),game.actors.get(lootQA.a2)].flatMap(a=>a.items.contents).filter(i=>i.name==='Plasma Pistol').length`),1);
  results.simultaneousClaims=true;
  await gm.eval(`(()=>{const user=game.users.get(lootQA.u1);const original=user.setFlag;let release;globalThis.lootViewHeld=false;globalThis.releaseLootView=()=>{user.setFlag=original;release?.()};user.setFlag=async function(scope,key,value){if(scope==='holosuite-loot' && key==='${RESPONSE_FLAG}' && this.getFlag(scope,'${REQUEST_FLAG}')?.action==='view') await new Promise(resolve=>{release=resolve;globalThis.lootViewHeld=true});return original.call(this,scope,key,value)};return true})()`);
  await p1.eval(`(async()=>{const center=fromUuidSync(lootQA.t1).object.center;await canvas.animatePan({x:center.x,y:center.y,duration:0});return true})()`);
  const point=await p1.eval(`(()=>{const p=canvas.stage.worldTransform.apply(fromUuidSync(lootQA.t1).object.center);return {x:p.x,y:p.y}})()`);
  // Reproduce modules/browser handlers which consume contextmenu before it
  // reaches the canvas. Right-pointer interaction must still open the panel.
  await p1.eval('document.addEventListener("contextmenu",event=>event.stopImmediatePropagation(),{capture:true,once:true});true');
  await p1.call('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
  await new Promise(resolve=>setTimeout(resolve,350));
  await p1.call('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',buttons:2,clickCount:1,...point});
  await p1.call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'right',buttons:0,clickCount:1,...point});
  await p1.until('document.querySelector(".hl-panel")');
  await p1.until('document.querySelector(".holosuite-loot-popup [data-loading]")');
  results.visibleWhileGMReplyPending=true;
  await gm.until('globalThis.lootViewHeld');
  await gm.eval('releaseLootView();true');
  await p1.until('!document.querySelector(".holosuite-loot-popup [data-loading]") && document.querySelector(".hl-item")');
  results.nativeRightClick=true;
  await p1.until(`!!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')?.texture?.valid`);
  await p1.until(`!!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`);
  assert.equal(await p1.eval('!!document.querySelector(".hl-item[title], .hl-item-open[title]")'),false);
  const inventoryBeforePreview=await gm.eval('game.actors.get(lootQA.a1).items.size');
  await p1.eval('document.querySelector(".hl-item-open").click();true');
  await p1.until(`(()=>{const apps=[...Object.values(ui.windows),...(foundry.applications?.instances?.values?.()??[])];globalThis.lootItemSheet=apps.find(app=>(app.document??app.object)?.documentName==='Item' && (app.document??app.object)?.name==='Med Pack');return lootItemSheet?.rendered})()`);
  assert.equal(await p1.eval('(lootItemSheet.document??lootItemSheet.object).isOwner'),false);
  assert.equal(await gm.eval('game.actors.get(lootQA.a1).items.size'),inventoryBeforePreview);
  await p1.eval('(async()=>{await lootItemSheet.close();return true})()');
  results.clickOpensReadOnlyItemSheet=true;results.separateLootButton=true;

  await p1.until('document.querySelector(".hl-loot-tether line")?.getAttribute("x2")');
  assert.equal(await p1.eval('getComputedStyle(document.querySelector(".holosuite-loot-popup > .window-header")).display'),'none');
  assert.equal(await p1.eval('!!document.querySelector(".holosuite-loot-popup .hl-heading")'),false);
  results.headerlessPopup=true;
  assert.equal(await p1.eval('!!document.querySelector(".holosuite-loot-popup select")'),false);
  assert.equal(await p1.eval('!!document.querySelector(".hl-footer small")'),false);
  const skin=await p1.eval(`(()=>{const panel=getComputedStyle(document.querySelector('.hl-panel'));const item=getComputedStyle(document.querySelector('.hl-item'));return {radius:panel.borderTopLeftRadius,border:panel.borderTopWidth,image:panel.borderImageSource,gradient:panel.backgroundImage,itemBorder:item.borderTopWidth}})()`);
  assert.equal(skin.radius,'24px');assert.equal(skin.border,'3px');assert.equal(skin.image,'none');assert.match(skin.gradient,/linear-gradient/);assert.equal(skin.itemBorder,'0px');
  results.roundedGradientPanel=true;results.selectorHiddenByDefault=true;
  await p1.eval(`globalThis.qaBadge=fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge');true`);
  const oldTetherX=await p1.eval('Number(document.querySelector(".hl-loot-tether line").getAttribute("x1"))');
  await p1.eval('canvas.pan({x:fromUuidSync(lootQA.t1).object.center.x+100,scale:canvas.stage.scale.x*1.15});true');
  await p1.until(`Math.abs(Number(document.querySelector('.hl-loot-tether line').getAttribute('x1'))-${oldTetherX})>1`);
  assert.equal(await p1.eval(`(()=>{const line=document.querySelector('.hl-loot-tether line');const rect=document.querySelector('.holosuite-loot-popup .hl-panel').getBoundingClientRect();const x=Number(line.getAttribute('x2')),y=Number(line.getAttribute('y2'));return (Math.abs(x-rect.left)<2||Math.abs(x-rect.right)<2)&&y>=rect.top&&y<=rect.bottom&&getComputedStyle(line).strokeWidth==='3px'})()`),true);
  const togglePoint=await p1.eval(`(()=>{const p=canvas.stage.worldTransform.apply(fromUuidSync(lootQA.t1).object.center);return {x:p.x,y:p.y}})()`);
  for (const open of [false,true]) {
    await p1.call('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',buttons:2,clickCount:1,...togglePoint});
    await p1.call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'right',buttons:0,clickCount:1,...togglePoint});
    await p1.until(open?'document.querySelector(".hl-loot-tether line")?.getAttribute("x2")':'!document.querySelector(".holosuite-loot-popup, .hl-loot-tether")');
  }
  assert.equal(await p1.eval(`(()=>{const token=fromUuidSync(lootQA.t1).object;return qaBadge.parent===token&&qaBadge===token.getChildByName('holosuite-loot-badge')&&qaBadge.x===token.w&&qaBadge.eventMode==='none'&&!document.querySelector('.hl-token-markers')})()`),true);
  results.nativeTokenBadge=true;
  results.rightClickToggleCleansTether=true;
  for (const [theme, width, surface, border] of [
    ['neutral', '1px', 'rgb(40, 46, 54)', 'rgb(162, 171, 182)'],
    ['fantasy', '2px', 'rgb(56, 39, 31)', 'rgb(186, 153, 95)']
  ]) {
    await gm.eval(`game.settings.set('holosuite-loot','panelTheme',${JSON.stringify(theme)})`);
    await p1.until(`document.querySelector('.hl-panel')?.dataset.lootTheme===${JSON.stringify(theme)} && document.querySelector('.hl-loot-tether line')?.style.stroke`);
    const style=await p1.eval(`(()=>{const panel=getComputedStyle(document.querySelector('.hl-panel'));const line=getComputedStyle(document.querySelector('.hl-loot-tether line'));return {surface:panel.backgroundColor,border:panel.borderLeftColor,stroke:line.stroke,width:line.strokeWidth}})()`);
    assert.deepEqual(style,{surface,border,stroke:border,width});
    await p1.screenshot(`${root}/loot-${theme}.png`);
  }
  await gm.eval(`game.settings.set('holosuite-loot','panelTheme','holo')`);
  await p1.until(`document.querySelector('.hl-panel')?.dataset.lootTheme==='holo'`);
  results.panelThemesMatchTether=true;
  results.cyanTetherTracksCanvas=true;
  assert.equal(await p1.eval('document.querySelectorAll(".hl-item").length'),1);
  await p1.screenshot(`${root}/loot-panel.png`);
  await p2.eval(`lootAPI.request({action:'all',tokenUuid:lootQA.t1,actorId:lootQA.a2})`);
  await p1.until('document.querySelector(".hl-empty")');
  results.panelSynchronization=true;
  await p1.until(`!fromUuidSync(lootQA.t1).object.getChildByName('holosuite-loot-badge')`);
  await p1.until(`!!fromUuidSync(lootQA.t2).object.getChildByName('holosuite-loot-badge')`);
  assert.equal(await gm.eval('fromUuidSync(lootQA.t1).actor.items.size'),3);
  assert.equal(await gm.eval('fromUuidSync(lootQA.t1).actorLink'),false);
  assert.equal(await gm.eval('fromUuidSync(lootQA.t2).actor.items.size'),5);
  results.tokenMarkers=true;results.sourceInventoryDepleted=true;results.linkedNPCIsolation=true;

  await p1.call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,x:1000,y:800});
  await p1.call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,x:1000,y:800});
  await p1.until('!document.querySelector(".holosuite-loot-popup") && !document.querySelector(".hl-loot-tether")');
  results.clickOutsideDismissesAndCleansTether=true;
  assert.equal(await gm.eval('game.actors.get(lootQA.npc).items.size'),5);
  const independent=await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t2})`);
  assert.equal(independent.entries.length,2);results.independentTokens=true;
  const oldOrigin=await p1.eval('performance.timeOrigin');
  await p1.call('Page.reload');
  await p1.until(`performance.timeOrigin !== ${oldOrigin} && globalThis.game?.ready && game.modules.get("holosuite-loot")?.api`,40000);
  await p1.eval(`globalThis.lootQA=${JSON.stringify(seeded)};globalThis.lootAPI=game.modules.get('holosuite-loot').api;true`);
  await p1.eval('(async()=>{await game.user.sheet.close();return true})()');
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t1})`)).entries.length,0);
  assert.deepEqual((await p1.eval(inspectRules)).entries, refreshedLoot);
  results.reloadPersistence=true;
  await gm.eval(`(async()=>{await fromUuidSync(lootQA.t1).unsetFlag('holosuite-loot','state');return true})()`);
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t1})`)).entries.length,0);
  results.tokenFlagTamperResistance=true;
  assert.equal(await p1.eval(`lootAPI.request({action:'take',tokenUuid:lootQA.t2,entryId:1,actorId:lootQA.a2}).then(()=>false,e=>e.code)`),'InvalidRequest');
  await p1.eval(`lootAPI.open(fromUuidSync(lootQA.t2));true`);
  await p1.until('document.querySelectorAll(".hl-item").length===2');
  const divider=await p1.eval(`getComputedStyle(document.querySelectorAll('.hl-item')[1],'::before').boxShadow`);
  assert.notEqual(divider,'none');
  await p1.screenshot(`${root}/loot-panel.png`);
  const assignedBefore=await gm.eval('game.actors.get(lootQA.a1).items.size');
  await p1.eval(`document.querySelector('.hl-item-loot').click();true`);
  await gm.until(`game.actors.get(lootQA.a1).items.size===${assignedBefore+1}`);
  results.defaultLootToAssignedCharacter=true;results.glowingItemDividers=true;
  await gm.eval(`game.settings.set('holosuite-loot','characterSelector',true)`);
  await p1.until('game.settings.get("holosuite-loot","characterSelector")');
  await p1.eval(`lootAPI.open(fromUuidSync(lootQA.t2));true`);
  await p1.until('document.querySelector(".holosuite-loot-popup select")');
  results.optionalCharacterSelector=true;
  await p1.eval(`(()=>{const app=Object.values(ui.windows).find(w=>w.id==='hololoot-'+lootQA.t2.split('.').at(-1));app?.close();return true})()`);

  assert.equal(await p1.eval(`lootAPI.request({action:'all',tokenUuid:lootQA.t2,actorId:lootQA.a2}).then(()=>false,e=>e.code)`),'ActorDenied');
  await gm.eval(`(async()=>{await fromUuidSync(lootQA.t2).update({hidden:true});return true})()`);
  assert.equal(await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t2}).then(()=>false,e=>e.code)`),'AccessDenied');
  results.permissions=true;
  results.standardFlagStorage=await gm.eval(`game.journal.contents.filter(j=>j.getFlag('holosuite-loot','tokenUuid')?.startsWith('Scene.'+lootQA.scene+'.')).every(j=>Array.isArray(j.getFlag('holosuite-loot','items')))`);
  assert.equal(results.standardFlagStorage,true);
  await gm.eval(`game.modules.get('holosuite-loot').api.configure(fromUuidSync(lootQA.t2));true`);
  await gm.until('document.querySelector(".hl-token-config") || document.querySelector("[data-save]")');
  assert.equal(await gm.eval('getComputedStyle(document.querySelector(".holosuite-loot-config > .window-header")).display'),'none');
  assert.equal(await gm.eval('!!document.querySelector(".holosuite-loot-config .hl-panel header, [data-backup], [data-restore]")'),false);
  assert.equal(await gm.eval('typeof game.modules.get("holosuite-loot").api.backupKey'),'undefined');
  results.headerlessConfigurationAndNoBackup=true;
  await gm.screenshot(`${root}/loot-config.png`);
  assert.equal(await gm.eval('!!document.querySelector(".holosuite-loot-config [name=source], .holosuite-loot-config [data-drop]")'),false);
  assert.equal(await gm.eval('!!document.querySelector(".holosuite-loot-config [data-apply]")'),true);
  await gm.eval('document.querySelector(".holosuite-loot-config [data-save]").click();true');
  await gm.until('!document.querySelector(".holosuite-loot-config")');
  results.simplifiedGMConfiguration=true;
  // An unlinked owned character receives Items on its synthetic Actor, with UUID-based recovery.
  const syntheticQA=await gm.eval(`(async()=>{
    await game.settings.set('holosuite-loot','characterSelector',false);
    const scene=game.scenes.get(lootQA.scene);
    const hero=scene.tokens.find(t=>t.actorId===lootQA.a1);
    await hero.update({actorLink:false});
    const [corpse]=await scene.createEmbeddedDocuments('Token',[{name:'Synthetic Test Corpse',actorId:lootQA.npc,x:950,y:400}]);
    return {hero:hero.uuid,corpse:corpse.uuid,before:hero.actor.items.size,worldBefore:game.actors.get(lootQA.a1).items.size};
  })()`);
  await p1.until('!game.settings.get("holosuite-loot","characterSelector")');
  await p1.eval(`lootAPI.request({action:'all',tokenUuid:${JSON.stringify(syntheticQA.corpse)}})`);
  assert.equal(await gm.eval(`fromUuidSync(${JSON.stringify(syntheticQA.hero)}).actor.items.size`),syntheticQA.before+2);
  assert.equal(await gm.eval('game.actors.get(lootQA.a1).items.size'),syntheticQA.worldBefore);
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(syntheticQA.corpse)}})`)).entries.length,0);
  await gm.eval(`(async()=>{await fromUuidSync(${JSON.stringify(syntheticQA.hero)}).update({actorLink:true});await game.settings.set('holosuite-loot','characterSelector',true);return true})()`);
  results.unlinkedOwnedCharacter=true;
  // Native combat defeat enables an otherwise healthy automatic NPC.
  const combatToken=await gm.eval(`(async()=>{
    const scene=game.scenes.get(lootQA.scene);
    const [token]=await scene.createEmbeddedDocuments('Token',[{name:'Combat Corpse',actorId:lootQA.npc,x:1100,y:400,flags:{'holosuite-loot':{config:{mode:'automatic'}}}}]);
    await token.actor.update({'system.attributes.hp.value':10});
    const combat=await Combat.create({scene:scene.id,active:true});
    await combat.createEmbeddedDocuments('Combatant',[{tokenId:token.id,actorId:lootQA.npc,defeated:true}]);
    globalThis.combatQA=token.uuid;return token.uuid;
  })()`);
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(combatToken)}})`)).entries.length,2);
  await gm.eval(`(async()=>{const token=fromUuidSync(combatQA);token.object.control();await (canvas.tokens.hud??canvas.hud.token).bind(token.object);return true})()`);
  await gm.until('document.querySelector("#token-hud .hl-token-action")');
  assert.ok(await gm.eval('document.querySelectorAll("#token-hud .control-icon:not(.hl-token-action)").length>0'));
  results.combatDefeatAndHUD=true;
  await gm.eval(`(async()=>{await fromUuidSync(lootQA.t2).setFlag('holosuite-loot','config',{mode:'disabled',source:'inventory'});return true})()`);
  assert.equal(await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t2}).then(()=>false,e=>e.code)`),'Unavailable');
  results.disabledOverride=true;
  await gm.eval(`(async()=>{
    const scene=game.scenes.get(lootQA.scene);
    const [observer]=await scene.createEmbeddedDocuments('Token',[{name:'Hero Observer',actorId:lootQA.a1,actorLink:true,x:300,y:400,sight:{enabled:true,range:0}}]);
    globalThis.observerQA=observer.id;
    await scene.update({tokenVision:true,'environment.globalLight.enabled':true});return true;
  })()`);
  await gm.until('canvas.ready && canvas.scene.tokenVision && canvas.tokens.placeables.some(t=>t.id===observerQA)');
  await p1.until('canvas.scene.tokenVision');
  assert.equal((await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(combatToken)}})`)).entries.length,2);
  await gm.eval(`(async()=>{await canvas.scene.createEmbeddedDocuments('Wall',[{c:[800,0,800,1200],sight:20,move:20}]);return true})()`);
  await new Promise(resolve=>setTimeout(resolve,500));
  assert.equal(await p1.eval(`lootAPI.request({action:'view',tokenUuid:${JSON.stringify(combatToken)}}).then(()=>false,e=>e.code)`),'AccessDenied');
  results.visionAndWalls=true;
  results.version=await gm.eval('({foundry:game.version,dnd5e:game.system.version})');
  const gmId=await gm.eval('game.user.id');
  await gm.eval('game.socket.disconnect();true');
  await p1.until(`!game.users.get(${JSON.stringify(gmId)}).active`);
  assert.equal(await p1.eval(`lootAPI.request({action:'view',tokenUuid:lootQA.t1}).then(()=>false,e=>e.code)`),'NoGM');
  results.noGMFeedback=true;
  fs.writeFileSync(`${root}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
} catch(error) {
  if(gm) console.log('GM diagnostic',await gm.eval('({url:location.href,body:document.body.innerText.slice(0,2500),ready:game.ready,loot:!!game.modules.get("holosuite-loot")?.api,canvasReady:canvas.ready,tokenVision:canvas.scene?.tokenVision,observer:globalThis.observerQA,tokens:canvas.tokens?.placeables.map(t=>t.id),notices:[...document.querySelectorAll(".notification")].map(e=>e.textContent)})').catch(()=>null));
  if(p1) await p1.screenshot(`${root}/failure-player.png`).catch(()=>{});
  if(p1) console.log('Player diagnostic',await p1.eval('({scene:game.user.viewedScene,notices:[...document.querySelectorAll(".notification")].map(e=>e.textContent)})').catch(()=>null));
  throw error;
} finally {
  p1?.ws.close();p2?.ws.close();control?.ws.close();
  if(gm){await gm.call('Browser.close').catch(()=>{});gm.ws.close();}else browser.kill();
}
