(()=>{"use strict";var ie={};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const B=Symbol("Comlink.proxy"),O=Symbol("Comlink.endpoint"),G=Symbol("Comlink.releaseProxy"),k=Symbol("Comlink.finalizer"),w=Symbol("Comlink.thrown"),R=e=>typeof e=="object"&&e!==null||typeof e=="function",V={canHandle:e=>R(e)&&e[B],serialize(e){const{port1:t,port2:o}=new MessageChannel;return T(e,t),[o,[o]]},deserialize(e){return e.start(),N(e)}},z={canHandle:e=>R(e)&&w in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},A=new Map([["proxy",V],["throw",z]]);function U(e,t){for(const o of e)if(t===o||o==="*"||o instanceof RegExp&&o.test(t))return!0;return!1}function T(e,t=globalThis,o=["*"]){t.addEventListener("message",function s(n){if(!n||!n.data)return;if(!U(o,n.origin)){console.warn(`Invalid origin '${n.origin}' for comlink proxy`);return}const{id:r,type:i,path:a}=Object.assign({path:[]},n.data),c=(n.data.argumentList||[]).map(g);let d;try{const l=a.slice(0,-1).reduce((u,m)=>u[m],e),f=a.reduce((u,m)=>u[m],e);switch(i){case"GET":d=f;break;case"SET":l[a.slice(-1)[0]]=g(n.data.value),d=!0;break;case"APPLY":d=f.apply(l,c);break;case"CONSTRUCT":{const u=new f(...c);d=H(u)}break;case"ENDPOINT":{const{port1:u,port2:m}=new MessageChannel;T(e,m),d=S(u,[u])}break;case"RELEASE":d=void 0;break;default:return}}catch(l){d={value:l,[w]:0}}Promise.resolve(d).catch(l=>({value:l,[w]:0})).then(l=>{const[f,u]=I(l);t.postMessage(Object.assign(Object.assign({},f),{id:r}),u),i==="RELEASE"&&(t.removeEventListener("message",s),C(t),k in e&&typeof e[k]=="function"&&e[k]())}).catch(l=>{const[f,u]=I({value:new TypeError("Unserializable return value"),[w]:0});t.postMessage(Object.assign(Object.assign({},f),{id:r}),u)})}),t.start&&t.start()}function D(e){return e.constructor.name==="MessagePort"}function C(e){D(e)&&e.close()}function N(e,t){return p(e,[],t)}function x(e){if(e)throw new Error("Proxy has been released and is not useable")}function M(e){return b(e,{type:"RELEASE"}).then(()=>{C(e)})}const h=new WeakMap,y="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(h.get(e)||0)-1;h.set(e,t),t===0&&M(e)});function F(e,t){const o=(h.get(t)||0)+1;h.set(t,o),y&&y.register(e,t,e)}function j(e){y&&y.unregister(e)}function p(e,t=[],o=function(){}){let s=!1;const n=new Proxy(o,{get(r,i){if(x(s),i===G)return()=>{j(n),M(e),s=!0};if(i==="then"){if(t.length===0)return{then:()=>n};const a=b(e,{type:"GET",path:t.map(c=>c.toString())}).then(g);return a.then.bind(a)}return p(e,[...t,i])},set(r,i,a){x(s);const[c,d]=I(a);return b(e,{type:"SET",path:[...t,i].map(l=>l.toString()),value:c},d).then(g)},apply(r,i,a){x(s);const c=t[t.length-1];if(c===O)return b(e,{type:"ENDPOINT"}).then(g);if(c==="bind")return p(e,t.slice(0,-1));const[d,l]=P(a);return b(e,{type:"APPLY",path:t.map(f=>f.toString()),argumentList:d},l).then(g)},construct(r,i){x(s);const[a,c]=P(i);return b(e,{type:"CONSTRUCT",path:t.map(d=>d.toString()),argumentList:a},c).then(g)}});return F(n,e),n}function v(e){return Array.prototype.concat.apply([],e)}function P(e){const t=e.map(I);return[t.map(o=>o[0]),v(t.map(o=>o[1]))]}const L=new WeakMap;function S(e,t){return L.set(e,t),e}function H(e){return Object.assign(e,{[B]:!0})}function ce(e,t=globalThis,o="*"){return{postMessage:(s,n)=>e.postMessage(s,o,n),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function I(e){for(const[t,o]of A)if(o.canHandle(e)){const[s,n]=o.serialize(e);return[{type:"HANDLER",name:t,value:s},n]}return[{type:"RAW",value:e},L.get(e)||[]]}function g(e){switch(e.type){case"HANDLER":return A.get(e.name).deserialize(e.value);case"RAW":return e.value}}function b(e,t,o){return new Promise(s=>{const n=$();e.addEventListener("message",function r(i){!i.data||!i.data.id||i.data.id!==n||(e.removeEventListener("message",r),s(i.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:n},t),o)})}function $(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}function _(e,t,o,s,n,r){r[n]=e+1.402*s,r[n+1]=e-.34414*t-.71414*s,r[n+2]=e+1.772*t,r[n+3]=255,r[n+4]=o+1.402*s,r[n+5]=o-.34414*t-.71414*s,r[n+6]=o+1.772*t,r[n+7]=255}function W(e,t,o,s){let n=0,r=0;const i=o*t;for(let a=0;a<=i;a+=2){const c=e[r]-128,d=e[r+1],l=e[r+2]-128,f=e[r+3];_(d,c,f,l,n,s),n+=8,r+=4}}function Y(e,t,o,s){let n=0,r=0;const i=o*t;for(let a=0;a<=i;a+=2){const c=e[r],d=e[r+1]-128,l=e[r+2],f=e[r+3]-128;_(c,d,l,f,n,s),n+=8,r+=4}}function q(e,t,o,s){let n=0,r=0;for(let i=0;i<t*o;i++){const a=e[n++],c=e[n++],d=e[n++];s[r++]=a,s[r++]=c,s[r++]=d,s[r++]=255}}function X(e,t,o,s){let n=0,r=0;for(let i=0;i<t*o;i++){const a=e[n++],c=e[n++],d=e[n++],l=e[n++];s[r++]=a,s[r++]=c,s[r++]=d,s[r++]=l}}function J(e,t,o,s){let n=0,r=0;for(let i=0;i<t*o;i++){const a=e[n++],c=e[n++],d=e[n++],l=e[n++];s[r++]=d,s[r++]=c,s[r++]=a,s[r++]=l}}function K(e,t,o,s){let n=0,r=0;for(let i=0;i<t*o;i++){const a=e[n++],c=e[n++],d=e[n++];s[r++]=d,s[r++]=c,s[r++]=a,s[r++]=255}}function Q(e,t,o,s,n){const r=new DataView(e.buffer,e.byteOffset);let i=0;for(let a=0;a<t*o*4;a+=4){const c=r.getFloat32(a,!s)*255;n[i++]=c,n[i++]=c,n[i++]=c,n[i++]=255}}function Z(e,t,o,s){let n=0,r=0;for(let i=0;i<t*o;i++){const a=e[n++];s[r++]=a,s[r++]=a,s[r++]=a,s[r++]=255}}function ee(e,t,o,s,n,r){const i=new DataView(e.buffer,e.byteOffset),a=r?.minValue??0;let c=r?.maxValue??1e4;c===a&&(c=a+1);let d=0;for(let l=0;l<t*o*2;l+=2){let f=i.getUint16(l,!s);f=(f-a)/(c-a)*255,n[d++]=f,n[d++]=f,n[d++]=f,n[d++]=255}}function E(e,t,o,s){return new Function("data","width","height","output",`
  for (let i = 0; i < height / 2; i++) {
    let inIdx = i * 2 * width;
    let outTopIdx = i * 2 * width * 4; // Addresses top row
    let outBottomIdx = (i * 2 + 1) * width * 4; // Addresses bottom row
    for (let j = 0; j < width / 2; j++) {
      const tl = data[inIdx++];
      const tr = data[inIdx++];
      const bl = data[inIdx + width - 2];
      const br = data[inIdx + width - 1];

      const ${e} = tl;
      const ${t} = tr;
      const ${o} = bl;
      const ${s} = br;

      // Top row
      output[outTopIdx++] = r;
      output[outTopIdx++] = g0;
      output[outTopIdx++] = b;
      output[outTopIdx++] = 255;

      output[outTopIdx++] = r;
      output[outTopIdx++] = g0;
      output[outTopIdx++] = b;
      output[outTopIdx++] = 255;

      // Bottom row
      output[outBottomIdx++] = r;
      output[outBottomIdx++] = g1;
      output[outBottomIdx++] = b;
      output[outBottomIdx++] = 255;

      output[outBottomIdx++] = r;
      output[outBottomIdx++] = g1;
      output[outBottomIdx++] = b;
      output[outBottomIdx++] = 255;
    }
  }`)}const te=E("r","g0","g1","b"),ne=E("b","g0","g1","r"),re=E("g0","b","r","g1"),oe=E("g0","r","b","g1");async function de(e,t){const o=new Blob([e.data],{type:`image/${e.format}`});return await createImageBitmap(o,{resizeWidth:t})}function se(e,t,o){const{encoding:s,width:n,height:r}=e,i="is_bigendian"in e?e.is_bigendian:!1,a=e.data;switch(s){case"yuv422":case"uyuv":W(e.data,n,r,o);break;case"yuyv":Y(e.data,n,r,o);break;case"rgb8":q(a,n,r,o);break;case"rgba8":X(a,n,r,o);break;case"bgra8":J(a,n,r,o);break;case"bgr8":case"8UC3":K(a,n,r,o);break;case"32FC1":Q(a,n,r,i,o);break;case"bayer_rggb8":te(a,n,r,o);break;case"bayer_bggr8":ne(a,n,r,o);break;case"bayer_gbrg8":re(a,n,r,o);break;case"bayer_grbg8":oe(a,n,r,o);break;case"mono8":case"8UC1":Z(a,n,r,o);break;case"mono16":case"16UC1":ee(a,n,r,i,o,t);break;default:throw new Error(`Unsupported encoding ${s}`)}}function ae(e,t){const o=new ImageData(e.width,e.height);return se(e,t,o.data),S(o,[o.data.buffer])}T({decode:ae})})();

//# sourceMappingURL=studio-2977.js.map