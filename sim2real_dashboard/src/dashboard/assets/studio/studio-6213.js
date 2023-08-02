"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6213],{86213:(F,y,c)=>{c.r(y),c.d(y,{UnconnectedPlaybackPerformance:()=>S,default:()=>z});var a=c(52322),b=c(68434),j=c(76635),R=c(44668),M=c(42741),k=c(14075),Z=c(76479),h=c(2784),B=c(8740),E=c(62515);const A=({draw:e,overrideDevicePixelRatioForTest:n})=>{const{width:s,height:i,ref:t}=(0,E.NB)({refreshRate:0,refreshMode:"debounce"}),[r,m]=(0,h.useState)(window.devicePixelRatio);(0,h.useLayoutEffect)(()=>{const o=()=>m(window.devicePixelRatio),u=window.matchMedia(`(resolution: ${r}dppx)`);return u.addEventListener("change",o,{once:!0}),()=>{u.removeEventListener("change",o)}},[r]);const d=n??r,f=d*(s??0),l=d*(i??0);return(0,h.useLayoutEffect)(()=>{const o=t.current;if(!o||s==null||i==null)return;const u=o.getContext("2d");u&&(u.setTransform(d,0,0,d,0,0),e(u,s,i))}),(0,a.jsx)("canvas",{ref:t,width:f,height:l,style:{width:"100%",height:"100%"}})},I=(0,B.ZL)()(e=>({root:{flex:"none",backgroundColor:e.palette.grey[300]}}));function L(e,n,s,i,t,r,m,d){const f=Math.max(n,...e.map(({value:o})=>o));t.clearRect(0,0,r,m),t.beginPath(),t.strokeStyle=d;let l=!0;for(const{value:o,timestamp:u}of e){const w=(s+u-i)/s*r,C=(1-o/f)*m;l?(t.moveTo(w,C),l=!1):t.lineTo(w,C)}t.stroke()}function D(e){const{classes:n,theme:s}=I(),i=(0,h.useCallback)((t,r,m)=>{L(e.points,e.maximum??0,e.timeRange,e.nowStamp??Date.now(),t,r,m,s.palette.text.primary)},[e.maximum,e.nowStamp,e.points,e.timeRange,s.palette]);return(0,a.jsx)("div",{className:n.root,style:{height:e.height,width:e.width},children:(0,a.jsx)(A,{draw:i})})}var v=c(93812),x=c(2784);const T=5e3;function g(e){return(0,a.jsxs)(v.Z,{direction:"row",alignItems:"center",gap:1,children:[(0,a.jsx)(D,{points:e.points,maximum:e.maximum,width:100,height:30,timeRange:T}),(0,a.jsxs)(v.Z,{children:[(0,a.jsxs)(b.Z,{variant:"body2",children:[((0,j.last)(e.points)??{value:0}).value.toFixed(e.decimalPlaces),e.label]}),(0,a.jsxs)(b.Z,{variant:"body2",color:"text.secondary",children:[((0,j.sumBy)(e.points,"value")/e.points.length).toFixed(e.decimalPlaces)," avg"]})]})]})}function S({timestamp:e,activeData:n}){const s=x.useRef(),i=s.current;n&&(!s.current||s.current.activeData!==n)&&(s.current={timestamp:e,activeData:n});const t=x.useRef({speed:[],framerate:[],bagTimeMs:[],megabitsPerSecond:[]});if(n&&s.current&&i&&i.activeData!==n){const r=e-i.timestamp;if(i.activeData.isPlaying&&n.isPlaying&&i.activeData.lastSeekTime===n.lastSeekTime&&i.activeData.currentTime!==n.currentTime){const l=(0,R.toSec)((0,R.subtract)(n.currentTime,i.activeData.currentTime))*1e3;t.current.speed.push({value:l/r,timestamp:e}),t.current.framerate.push({value:1e3/r,timestamp:e}),t.current.bagTimeMs.push({value:l,timestamp:e})}const f=8*(n.totalBytesReceived-i.activeData.totalBytesReceived)/1e6/(r/1e3);t.current.megabitsPerSecond.push({value:f,timestamp:e});for(const l of Object.values(t.current))for(;l[0]&&l[0].timestamp<e-T;)l.shift()}return(0,a.jsxs)(v.Z,{flex:"auto",children:[(0,a.jsx)(Z.Z,{}),(0,a.jsxs)(v.Z,{flex:"auto",justifyContent:"center",gap:2,padding:1,children:[(0,a.jsx)(g,{points:t.current.speed,maximum:1.6,decimalPlaces:2,label:(0,a.jsx)(a.Fragment,{children:"\xD7 realtime"})}),(0,a.jsx)(g,{points:t.current.framerate,maximum:30,decimalPlaces:1,label:"fps"}),(0,a.jsx)(g,{points:t.current.bagTimeMs,maximum:300,decimalPlaces:0,label:"ms bag frame"}),(0,a.jsx)(g,{points:t.current.megabitsPerSecond,maximum:100,decimalPlaces:1,label:"Mbps"})]})]})}function P(){const e=Date.now(),n=(0,M.An)(x.useCallback(({playerState:s})=>s.activeData,[]));return(0,a.jsx)(S,{timestamp:e,activeData:n})}P.panelType="PlaybackPerformance",P.defaultConfig={};const z=(0,k.Z)(P)}}]);

//# sourceMappingURL=studio-6213.js.map