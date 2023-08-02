"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6060],{16060:(Ze,P,t)=>{t.r(P),t.d(P,{ANIMATION_RESET_DELAY_MS:()=>j,default:()=>ye});var s=t(52322),L=t(42713),z=t(54675),p=t(20379),A=t(87037),v=t(7896),E=t(31461),l=t(2784),R=t(6277),H=t(49863),N=t(43853),M=t(65992),I=t(20411),U=t(51538);function B(e){return(0,U.Z)("MuiTableContainer",e)}const xe=(0,I.Z)("MuiTableContainer",["root"]),be=null,W=["className","component"],Y=e=>{const{classes:n}=e,r={root:["root"]};return(0,H.Z)(r,B,n)},X=(0,M.ZP)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:(e,n)=>n.root})({width:"100%",overflowX:"auto"}),G=l.forwardRef(function(n,r){const a=(0,N.Z)({props:n,name:"MuiTableContainer"}),{className:f,component:i="div"}=a,m=(0,E.Z)(a,W),u=(0,v.Z)({},a,{component:i}),h=Y(u);return(0,s.jsx)(X,(0,v.Z)({ref:r,as:i,className:(0,R.Z)(h.root,f),ownerState:u},m))});var F=t(6281),K=t(23502);function Q(e){return(0,U.Z)("MuiTableHead",e)}const je=(0,I.Z)("MuiTableHead",["root"]),Se=null,w=["className","component"],k=e=>{const{classes:n}=e,r={root:["root"]};return(0,H.Z)(r,Q,n)},q=(0,M.ZP)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(e,n)=>n.root})({display:"table-header-group"}),_={variant:"head"},O="thead",ee=l.forwardRef(function(n,r){const a=(0,N.Z)({props:n,name:"MuiTableHead"}),{className:f,component:i=O}=a,m=(0,E.Z)(a,w),u=(0,v.Z)({},a,{component:i}),h=k(u);return(0,s.jsx)(K.Z.Provider,{value:_,children:(0,s.jsx)(q,(0,v.Z)({as:i,className:(0,R.Z)(h.root,f),ref:r,role:i===O?null:"rowgroup",ownerState:u},m))})});var V=t(70969),d=t(98214),te=t(74073),J=t(68434),y=t(76635),se=t(8740),ne=t(94225),ae=t(90546),re=t(29268),oe=t(47824),b=t(42741),le=t(14075),$=t(76479),g=t(93812),D=t(24304);const j=3e3;function ie(){const e=document.activeElement;return e!=null&&(e.isContentEditable||e.tagName==="INPUT"||e.tagName==="TEXTAREA")}const ce=new Map;function de(e){return e.playerState.capabilities}function ue(e){return e.setParameter}function me(e){return e.playerState.activeData?.parameters??ce}const fe=(0,se.ZL)()((e,n,r)=>({tableRow:{[`&:hover .${r.copyIcon}`]:{visibility:"visible"}},copyIcon:{visibility:"hidden","&:hover":{backgroundColor:"transparent"}}}));function T(e){return e instanceof Uint8Array?Array.from(e):typeof e=="string"||typeof e=="number"||typeof e=="boolean"||Array.isArray(e)||(0,y.isObject)(e)?e:JSON.stringify(e)??""}function he(e){return e==null?"":e instanceof Date?e.toISOString():e instanceof Uint8Array?JSON.stringify(Array.from(e))??"":typeof e=="string"||typeof e=="number"||typeof e=="boolean"?String(e):JSON.stringify(e)??""}function ve(e){const[n,r]=(0,l.useState)(T(e.value));return(0,s.jsxs)(g.Z,{direction:"row",children:[(0,s.jsx)(oe.Z,{value:n,onChange:a=>{r(a)}}),!(0,y.isEqual)(T(n),T(e.value))&&[(0,s.jsx)(p.Z,{title:"Submit change",children:(0,s.jsx)(A.Z,{onClick:()=>{e.value instanceof Uint8Array?e.onSubmit(new Uint8Array(n)):e.onSubmit(n)},children:(0,s.jsx)(L.Z,{})})},"submit"),(0,s.jsx)(p.Z,{title:"Reset",children:(0,s.jsx)(A.Z,{onClick:()=>r(T(e.value)),children:(0,s.jsx)(z.Z,{})},"reset")},"reset")]]})}function S(){const{classes:e}=fe(),n=(0,b.An)(de),r=(0,b.An)(ue),a=(0,b.An)(me),f=(0,ne.y1)((0,l.useCallback)((o,c)=>r(o,c),[r]),500),[i,m]=(0,l.useState)([]),u=n.includes(D.C.getParameters),h=n.includes(D.C.setParameters),Te=(0,l.useMemo)(()=>Array.from(a.keys()),[a]),C=(0,l.useRef)(!0),Z=(0,l.useRef)(a);return(0,l.useEffect)(()=>{const o=setTimeout(()=>C.current=!1,j);return()=>clearTimeout(o)},[]),(0,l.useEffect)(()=>{if(C.current||ie()){Z.current=a;return}const o=(0,y.union)(Array.from(a.keys()),Array.from(Z.current?.keys()??[])).filter(x=>{const Ce=Z.current?.get(x);return!(0,y.isEqual)(Ce,a.get(x))});m(o),Z.current=a;const c=setTimeout(()=>m([]),j);return()=>clearTimeout(c)},[a,C]),u?(0,s.jsxs)(g.Z,{fullHeight:!0,children:[(0,s.jsx)($.Z,{}),(0,s.jsx)(G,{style:{flex:1},children:(0,s.jsxs)(F.Z,{size:"small",children:[(0,s.jsx)(ee,{children:(0,s.jsxs)(V.Z,{children:[(0,s.jsx)(d.Z,{children:"Parameter"}),(0,s.jsx)(d.Z,{children:"Value"}),(0,s.jsx)(d.Z,{children:"\xA0"})]})}),(0,s.jsx)(te.Z,{children:Te.map(o=>{const c=he(a.get(o));return(0,s.jsxs)(V.Z,{hover:!0,className:e.tableRow,selected:!C.current&&i.includes(o),children:[(0,s.jsx)(d.Z,{variant:"head",children:(0,s.jsx)(J.Z,{noWrap:!0,title:o,variant:"inherit",children:o})}),h?(0,s.jsx)(d.Z,{padding:"none",children:(0,s.jsx)(ve,{value:a.get(o),onSubmit:x=>{f(o,x)}})}):(0,s.jsx)(d.Z,{children:(0,s.jsx)(J.Z,{noWrap:!0,title:c,variant:"inherit",color:"text.secondary",children:c})}),(0,s.jsx)(d.Z,{padding:"none",align:"center",children:(0,s.jsx)(ae.Z,{className:e.copyIcon,edge:"end",size:"small",iconSize:"small",getText:()=>`${o}: ${c}`})})]},`parameter-${o}-${c}`)})})]})})]}):(0,s.jsxs)(g.Z,{fullHeight:!0,children:[(0,s.jsx)($.Z,{}),(0,s.jsx)(re.Z,{children:"Connect to a ROS source to view parameters"})]})}S.panelType="Parameters",S.defaultConfig={title:"Parameters"};const ye=(0,le.Z)(S)}}]);

//# sourceMappingURL=studio-6060.js.map