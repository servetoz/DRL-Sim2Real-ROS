"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3218],{3218:(b,w,r)=>{r.d(w,{Root:()=>L});var g=r(52322),l=r(2784),o=r(13258),h=r(56348),m=r(23503),S="../../packages/studio-web/src/services/IdbLayoutStorage.ts";const u=m.ZP.getLogger(S),p="foxglove-layouts",c="layouts";class v{#e=h.X3(p,1,{upgrade(e){e.createObjectStore(c,{keyPath:["namespace","layout.id"]}).createIndex("namespace","namespace")}});async list(e){const a=[],t=await(await this.#e).getAllFromIndex(c,"namespace",e);for(const s of t)try{a.push((0,o.bt)(s.layout))}catch(n){u.error(n)}return a}async get(e,a){const t=await(await this.#e).get(c,[e,a]);return t==null?void 0:(0,o.bt)(t.layout)}async put(e,a){return await(await this.#e).put(c,{namespace:e,layout:a}),a}async delete(e,a){await(await this.#e).delete(c,[e,a])}async importLayouts({fromNamespace:e,toNamespace:a}){const t=(await this.#e).transaction("layouts","readwrite"),s=t.objectStore("layouts");try{for await(const n of s.index("namespace").iterate(e))await s.put({namespace:a,layout:n.value.layout}),await n.delete();await t.done}catch(n){u.error(n)}}async migrateUnnamespacedLayouts(e){await this.#t()}async#t(){const e="studio.layouts",a=[];for(let t=0;t<localStorage.length;t++){const s=localStorage.key(t);s?.startsWith(`${e}.`)===!0&&a.push(s)}for(const t of a){const s=localStorage.getItem(t);if(s!=null)try{const n=(0,o.bt)(JSON.parse(s)),[E,I,f,y]=t.split(".");if(f==null||y==null||y!==n.id){u.error(`Failed to migrate ${t} from localStorage`);continue}await(await this.#e).put("layouts",{namespace:f,layout:n}),localStorage.removeItem(t)}catch(n){u.error(n)}}}}class i{static#e="studio.app-configuration.";#t;#a=new Map;constructor({defaults:e}){this.#t=e}get(e){const a=localStorage.getItem(i.#e+e);try{return a==null?this.#t?.[e]:JSON.parse(a)}catch{return}}async set(e,a){a==null?localStorage.removeItem(i.#e+e):localStorage.setItem(i.#e+e,JSON.stringify(a)??"");const t=this.#a.get(e);t&&[...t].forEach(s=>s(a))}addChangeListener(e,a){let t=this.#a.get(e);t||(t=new Set,this.#a.set(e,t)),t.add(a)}removeChangeListener(e,a){const t=this.#a.get(e);t&&t.delete(a)}}const x=!1;function L(d){const e=(0,l.useMemo)(()=>new i({defaults:{[o.oQ.SHOW_DEBUG_PANELS]:x}}),[]),a=(0,l.useMemo)(()=>new v,[]),[t]=(0,l.useState)(()=>[new o.sl("org"),new o.sl("local")]),s=(0,l.useMemo)(()=>{const n=[new o.EU,new o.Yc,new o.Gm,new o.w0,new o.Vu,new o.VO,new o.z8,new o.s6];return d.dataSources??n},[d.dataSources]);return(0,g.jsx)(g.Fragment,{children:(0,g.jsx)(o.gV,{enableLaunchPreferenceScreen:!0,deepLinks:[window.location.href],dataSources:s,appConfiguration:e,layoutStorage:a,extensionLoaders:t,enableGlobalCss:!0,extraProviders:d.extraProviders})})}}}]);

//# sourceMappingURL=studio-3218.js.map