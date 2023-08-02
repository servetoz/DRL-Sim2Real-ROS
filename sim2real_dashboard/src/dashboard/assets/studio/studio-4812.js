"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4812],{33880:(C,E,i)=>{i.d(E,{A:()=>f});const f={canHandle:h=>h instanceof AbortSignal,deserialize:([h,y])=>{const w=new AbortController;return h?w.abort():y.onmessage=()=>{w.abort()},w.signal},serialize:h=>{const{port1:y,port2:w}=new MessageChannel;return h.addEventListener("abort",()=>{y.postMessage("aborted")}),[[h.aborted,w],[w]]}}},44587:(C,E,i)=>{i.d(E,{A:()=>l.A});var l=i(33880)},23503:(C,E,i)=>{i.d(E,{ZP:()=>w});const l=new Map,f=()=>{};class h{static default=new h("");#t;constructor(n){this.#t=n,this.setLevel("debug"),l.set(n,this)}name(){return this.#t}isLevelOn(n){switch(n){case"debug":return this.debug!==f;case"info":return this.info!==f;case"warn":return this.warn!==f;case"error":return this.error!==f}return!1}getLevel(){return this.debug!==f?"debug":this.info!==f?"info":this.warn!==f?"warn":"error"}setLevel(n){switch(this.debug=f,this.info=f,this.warn=f,this.error=f,n){case"debug":this.debug=console.debug.bind(i.g.console),this.info=console.info.bind(i.g.console),this.warn=console.warn.bind(i.g.console),this.error=console.error.bind(i.g.console);break;case"info":this.info=console.info.bind(i.g.console),this.warn=console.warn.bind(i.g.console),this.error=console.error.bind(i.g.console);break;case"warn":this.warn=console.warn.bind(i.g.console),this.error=console.error.bind(i.g.console);break;case"error":this.error=console.error.bind(i.g.console);break}}debug(...n){}info(...n){}warn(...n){}error(...n){}getLogger(n){const c=n.replace(/^.+\.(asar|webpack)[\\/\\]/,"").replace(/^(\.\.\/)+/,""),u=this.#t.length>0?`${this.#t}.${c}`:c,g=l.get(u);if(g)return g;const R=new h(u);return l.set(u,R),R}channels(){return Array.from(l.values())}}function y(t){switch(t){case"debug":return"debug";case"info":return"info";case"warn":return"warn";case"error":return"error";default:return"warn"}}const w=h.default},12511:(C,E,i)=>{i.d(E,{C:()=>y});var l=i(44668),f=i.n(l);const h=Object.freeze({sec:0,nsec:0});class y{#t;#e;#s;constructor(t,n){this.#t=t,this.#s=n}async next(){return this.#s?.aborted===!0?void 0:(await this.#t.next()).value}async nextBatch(t){const n=await this.next();if(!n)return;if(n.type==="problem")return[n];const c=[n];let u=h;switch(n.type){case"stamp":u=(0,l.add)(n.stamp,{sec:0,nsec:t*1e6});break;case"message-event":u=(0,l.add)(n.msgEvent.receiveTime,{sec:0,nsec:t*1e6});break}for(;;){const g=await this.next();if(!g)return c;if(c.push(g),g.type==="problem"||g.type==="stamp"&&(0,l.compare)(g.stamp,u)>0||g.type==="message-event"&&(0,l.compare)(g.msgEvent.receiveTime,u)>0)break}return c}async readUntil(t){if(this.#s?.aborted===!0)return;const c=[];if(this.#e?.type==="stamp"&&(0,l.compare)(this.#e.stamp,t)>=0||this.#e?.type==="message-event"&&(0,l.compare)(this.#e.msgEvent.receiveTime,t)>0)return c;for(this.#e&&(c.push(this.#e),this.#e=void 0);;){const u=await this.#t.next();if(this.#s?.aborted===!0)return;if(u.done===!0)break;const g=u.value;if(g.type==="stamp"&&(0,l.compare)(g.stamp,t)>=0){this.#e=g;break}if(g.type==="message-event"&&(0,l.compare)(g.msgEvent.receiveTime,t)>0){this.#e=g;break}c.push(g)}return c}async end(){await this.#t.return?.()}}},41253:(C,E,i)=>{i.d(E,{a:()=>y});var l=i(90758),f=i(44587),h=i(12511);class y{_source;constructor(t){this._source=t}async initialize(){return await this._source.initialize()}messageIterator(t){return l.sj(this._source.messageIterator(t))}async getBackfillMessages(t,n){return await this._source.getBackfillMessages({...t,abortSignal:n})}getMessageCursor(t,n){const c=this._source.messageIterator(t),u=new h.C(c,n);return l.sj(u)}}l.Y6.set("abortsignal",f.A)},20865:(C,E,i)=>{i.d(E,{Z:()=>y});var l=i(30686);class f extends l.v{#t;#e;#s;#r=!1;#n;constructor(t,n){super(),this.#n=t,this.#s=new AbortController,this.#t=fetch(t,{...n,signal:this.#s.signal})}async#o(){if(this.#e)return this.#e;let t;try{t=await this.#t}catch(n){this.emit("error",new Error(`GET <${this.#n}> failed: ${n}`));return}if(!t.ok){const n=t.statusText;this.emit("error",new Error(`GET <$${this.#n}> failed with status ${t.status}${n?` (${n})`:""}`));return}if(!t.body){this.emit("error",new Error(`GET <${this.#n}> succeeded, but returned no data`));return}try{this.#e=t.body.getReader()}catch{this.emit("error",new Error(`GET <${this.#n}> succeeded, but failed to stream`));return}return this.#e}read(){this.#o().then(t=>{t&&t.read().then(({done:n,value:c})=>{if(n){this.emit("end");return}this.emit("data",c),this.read()}).catch(n=>{if(this.#r){this.emit("end");return}const c=n instanceof Error?n:new Error(n);this.emit("error",c)})}).catch(t=>{const n=t instanceof Error?t:new Error(t);this.emit("error",n)})}destroy(){this.#r=!0,this.#s.abort()}}function h(){return Boolean(i.g.desktopBridge)}class y{#t;constructor(t){this.#t=t}async open(){let t;try{const c=new AbortController;t=await fetch(this.#t,{signal:c.signal,cache:"no-store"}),c.abort()}catch(c){let u=`Fetching remote file failed. ${c}`;throw h()||(u+=`

Sometimes this is due to a CORS configuration error on the server. Make sure CORS is enabled.`),new Error(u)}if(!t.ok)throw new Error(`Fetching remote file failed. <${this.#t}> Status code: ${t.status}.`);if(t.headers.get("accept-ranges")!=="bytes"){let c=`Support for HTTP Range requests was not detected on the remote file.

Confirm the resource has an 'Accept-Ranges: bytes' header.`;throw h()||(c+=`

Sometimes this is due to a CORS configuration error on the server. Make sure CORS is enabled with Access-Control-Allow-Origin, and that Access-Control-Expose-Headers includes Accept-Ranges.`),new Error(c)}const n=t.headers.get("content-length");if(n==null)throw new Error(`Remote file is missing file size. <${this.#t}>`);return{size:parseInt(n),identifier:t.headers.get("etag")??t.headers.get("last-modified")??void 0}}fetch(t,n){const c=new Headers({range:`bytes=${t}-${t+(n-1)}`}),u=new f(this.#t,{headers:c});return u.read(),u}}},88499:(C,E,i)=>{i.d(E,{Z:()=>M});var l=i(76635),f=i(23503),h=i(43345);function y(d,e){for(const s of e){if((0,h.RR)(d,s))return!1;if((0,h.VG)(d,s))return!0}return!1}function w(d,e){return(0,h.Cy)(d,(0,h.wf)([d],e))}const t=Math.pow(2,32);class n{byteLength;#t=[];#e=Math.trunc(t/2);#s=1/0;#r=[];#n=[];constructor(e){this.byteLength=e.size,this.#e=e.blockSize??this.#e,this.#s=e.numberOfBlocks??this.#s}hasData(e,s){return y({start:e,end:s},this.#n)}getRangesWithData(){return this.#n}copyFrom(e,s){if(s<0||s>=this.byteLength)throw new Error("VirtualLRUBuffer#copyFrom invalid input");const r={start:s,end:s+e.byteLength};let a=r.start;for(;a<r.end;){const{blockIndex:m,positionInBlock:o,remainingBytesInBlock:b}=this.#a(a);c(e,this.#o(m),o,a-s),a+=b}this.#n=(0,h.og)((0,h.LU)([r],this.#n))}slice(e,s){const r=s-e;if(e<0||s>this.byteLength||r<=0||r>t)throw new Error("VirtualLRUBuffer#slice invalid input");if(!this.hasData(e,s))throw new Error("VirtualLRUBuffer#slice range has no data set");const a=this.#a(e);if(r<=a.remainingBytesInBlock){const{blockIndex:b,positionInBlock:p}=a;return this.#o(b).slice(p,p+r)}const m=new Uint8Array(r);let o=e;for(;o<s;){const{blockIndex:b,positionInBlock:p,remainingBytesInBlock:B}=this.#a(o);c(this.#o(b),m,o-e,p),o+=B}return m}#o(e){if(!this.#t[e]){let r=this.#e;(e+1)*this.#e>this.byteLength&&(r=this.byteLength%this.#e),this.#t[e]=new Uint8Array(r)}if(this.#r=[...this.#r.filter(r=>r!==e),e],this.#r.length>this.#s){const r=this.#r.shift();r!=null&&(delete this.#t[r],this.#n=(0,h.og)((0,h.cb)(this.#n,[{start:r*this.#e,end:(r+1)*this.#e}])))}const s=this.#t[e];if(!s)throw new Error("invariant violation - no block at index");return s}#a(e){if(e<0||e>=this.byteLength)throw new Error("VirtualLRUBuffer#_calculatePosition invalid input");const s=Math.floor(e/this.#e),r=e-s*this.#e,a=this.#o(s).byteLength-r;return{blockIndex:s,positionInBlock:r,remainingBytesInBlock:a}}}function c(d,e,s,r,a){const m=(a??d.byteLength)-r;for(let o=0;o<m;o++)e[s+o]=d[r+o]}function u(d){const{readRequestRange:e,currentRemainingRange:s,...r}=d;if(e)return g({readRequestRange:e,currentRemainingRange:s,...r});if(!s)return R(r)}function g({currentRemainingRange:d,readRequestRange:e,downloadedRanges:s,maxRequestSize:r,fileSize:a,continueDownloadingThreshold:m}){if(e.end-e.start>r)throw new Error(`Range ${e.start}-${e.end} exceeds max request size ${r} (file size ${a})`);const o=w(e,s);if(!o[0])throw new Error("Range for the first read request is fully downloaded, so it should have been deleted");if(!d||!(0,h.dI)(o,[d])||d.start+m<o[0].start){if(r>=a){const p={start:o[0].start,end:a};return w(p,s)[0]}return o[0].end===e.end?{...o[0],end:Math.min(e.start+r,a)}:o[0]}}function R({downloadedRanges:d,lastResolvedCallbackEnd:e,maxRequestSize:s,fileSize:r}){let a;if(s>=r){const m={start:e??0,end:r};y(m,d)?a={start:0,end:r}:a=m}else e!=null&&(a={start:e,end:Math.min(e+s,r)});if(a)return w(a,d)[0]}var T="../../packages/studio-base/src/util/CachedFilelike.ts";const L=1024*1024*100,I=1024*1024*10,A=1024*1024*5,$=f.ZP.getLogger(T);class M{#t;#e=1/0;#s;#r;#n;#o=!1;#a;#i;#c=[];#d;#h;constructor(e){this.#t=e.fileReader,this.#e=e.cacheSizeInBytes??this.#e,this.#a=e.keepReconnectingCallback,this.#n=e.log??$,this.#r=new n({size:0})}async open(){if(this.#s!=null)return;const{size:e}=await this.#t.open();this.#s=e,this.#e>=e?this.#r=new n({size:e}):this.#r=new n({size:e,blockSize:I,numberOfBlocks:Math.ceil(this.#e/I)+2}),this.#n.info(`Opening file with size ${k(this.#s)}MiB`)}size(){if(this.#s==null)throw new Error("CachedFilelike has not been opened");return this.#s}read(e,s){if(s===0)return Promise.resolve(new Uint8Array);const r={start:e,end:e+s};if(e<0||s<0)throw new Error("CachedFilelike#read invalid input");if(s>this.#e)throw new Error(`Requested more data than cache size: ${s} > ${this.#e}`);return new Promise((a,m)=>{this.open().then(()=>{const o=this.size();if(r.end>o){m(new Error("CachedFilelike#read past size"));return}this.#c.push({range:r,resolve:a,reject:m,requestTime:Date.now()}),this.#l()}).catch(o=>{m(o)})})}#l(){if(this.#o)return;this.#c=this.#c.filter(({range:r,resolve:a})=>{if(!this.#r.hasData(r.start,r.end))return!0;this.#d=r.end;const m=this.#r.slice(r.start,r.end);return a(m),!1});const e=this.size(),s=u({currentRemainingRange:this.#i?this.#i.remainingRange:void 0,readRequestRange:this.#c[0]?this.#c[0].range:void 0,downloadedRanges:this.#r.getRangesWithData(),lastResolvedCallbackEnd:this.#d,maxRequestSize:this.#e,fileSize:e,continueDownloadingThreshold:A});s&&this.#u(s)}#u(e){if(this.#n.debug(`Setting new connection @ ${v(e)}`),this.#i){const o=this.#i;o.stream.destroy(),this.#n.debug(`Destroyed current connection @ ${v(o.remainingRange)}`)}const s=this.#t.fetch(e.start,e.end-e.start);this.#i={stream:s,remainingRange:e},s.on("error",o=>{const b=this.#i;if(!(!b||s!==b.stream)){if(this.#a)this.#h==null&&this.#a(!0);else{const p=this.#h;if(p!=null&&Date.now()-p<100){this.#n.error(`Connection @ ${v(e)} threw another error; closing: ${o.toString()}`),this.#o=!0;for(const B of this.#c)B.reject(o);return}}this.#n.info(`Connection @ ${v(e)} threw error; trying to continue: ${o.toString()}`),this.#h=Date.now(),b.stream.destroy(),this.#i=void 0,this.#l()}});const r=Date.now();let a=0,m=0;s.on("data",o=>{const b=this.#i;if(!(!b||s!==b.stream)){if(this.#h!=null&&(this.#h=void 0,this.#a&&this.#a(!1)),this.#r.copyFrom(o,b.remainingRange.start),a+=o.byteLength,a-m>L){m=a;const p=(Date.now()-r)/1e3,B=k(a),O=(0,l.round)(B/p,2);this.#n.debug(`Connection @ ${v(b.remainingRange)} downloading at ${O} MiB/s`)}this.#r.hasData(e.start,e.end)?(this.#n.info(`Connection @ ${v(b.remainingRange)} finished!`),s.destroy(),this.#i=void 0):this.#i={stream:s,remainingRange:{start:e.start+a,end:e.end}},this.#l()}})}}function k(d){return(0,l.round)(d/1024/1024,3)}function v(d){return`${k(d.start)}-${k(d.end)}MiB`}}}]);

//# sourceMappingURL=studio-4812.js.map