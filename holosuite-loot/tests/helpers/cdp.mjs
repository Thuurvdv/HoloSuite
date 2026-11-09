import fs from 'node:fs';
export class CDP {
  constructor(url) { this.url=url;this.nextId=0;this.pending=new Map(); }
  async connect() {
    this.ws=new WebSocket(this.url);
    await new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',({data})=>{const result=JSON.parse(data),request=this.pending.get(result.id);if(!request)return;this.pending.delete(result.id);result.error?request.reject(new Error(JSON.stringify(result.error))):request.resolve(result.result);});
  }
  call(method,params={}) {return new Promise((resolve,reject)=>{const id=++this.nextId;this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async eval(expression) {
    const result=await this.call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});
    if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
    return result.result?.value;
  }
  async until(expression,timeout=20000) {
    const start=Date.now();
    while(Date.now()-start<timeout){try{const value=await this.eval(expression);if(value)return value;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}
    throw new Error(`Timed out: ${expression}`);
  }
  async screenshot(path) {const{data}=await this.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path,Buffer.from(data,'base64'));}
}
