"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1234],{11234:(Xe,H,t)=>{t.r(H),t.d(H,{default:()=>Ze,openSiblingStateTransitionsPanel:()=>We,transitionableRosTypes:()=>Ne});var g=t(52322),_=t(52498),ee=t(86232),te=t(68434),N=t(76635),r=t(2784),ne=t(62515),se=t(1547),ae=t(8740),U=t(7506),y=t(44668),z=t(59506),Y=t(1012),F=t(36922);function oe(e,n=1/0){const i=(0,U.O4)(e),h=(0,r.useMemo)(()=>(0,Y.UU)(i),[i]),s=z.V7({topics:h,historySize:n}),c=(0,F.wm)(i);return(0,r.useMemo)(()=>c(s),[c,s])}var $=t(42741),ie=t(14075),le=t(82044),re=t(76479),R=t(93812),ce=t(31458),de=t(88099),ue=t(26775),me=t(77075),he=t(9839),pe=t.n(he),G=t(68071),fe=t(27999),ge=t(25302);function ve(e,n){return(e%n+n)%n}const X=[ge.B,...G.A2];function V(e){const{path:n,pathIndex:i,startTime:h,y:s,blocks:c}=e,d=[];let p,u=[];const P=new Map;let T;for(const A of c){if(!A){u.push({x:NaN,y:NaN}),T=void 0,p=void 0;continue}for(const B of A){const m=(0,fe.w0)(B.messageEvent,n.timestampMethod);if(!m)continue;const C=B.queriedData[0];if(B.queriedData.length!==1||!C)continue;const{constantName:b,value:a}=C,S=P.get(a);if(p&&(0,y.toSec)((0,y.subtract)(p,m))===0&&S===T||(p=m,Number.isNaN(a)&&typeof a!="string")||typeof a!="number"&&typeof a!="bigint"&&typeof a!="boolean"&&typeof a!="string")continue;const E=typeof a=="string"?pe()(a):Math.round(Number(a)),v=X[ve(E,Object.values(X).length)]??"grey",x=(0,y.toSec)((0,y.subtract)(m,h)),j=S!==T;j&&(u.push({x,y:s}),u.push({x:NaN,y:NaN}));const I=b!=null?`${b} (${String(a)})`:String(a);if(S==null){P.set(a,d.length),u=[{x,y:s,label:I,labelColor:v,value:a,constantName:b}];const D={borderWidth:10,borderColor:v,data:u,label:i.toString(),pointBackgroundColor:(0,G.eE)(v),pointBorderColor:"transparent",pointHoverRadius:3,pointRadius:1.25,pointStyle:"circle",showLine:!0,datalabels:{color:v}};T=d.length,d.push(D)}else u=d[S]?.data??[],j?u.push({x,y:s,label:I,labelColor:v,value:a,constantName:b}):u.push({x,y:s,value:a,constantName:b}),T=S}}return d}var L=t(67067),ye=t(5817),J=t.n(ye),Se=t(90873),Te=t(39367);function K(e){if(e!=="")return e??void 0}function Q(e,n){return K(e.label)??K(e.value)??`Series ${n+1}`}const be=J()((e,n)=>({actions:[{type:"action",id:"delete-series",label:"Delete series",display:"inline",icon:"Clear"}],label:Q(e,n),fields:{value:{label:"Message path",input:"messagepath",value:e.value,validTypes:Se.plotableRosTypes},label:{input:"string",label:"Label",value:e.label},timestampMethod:{input:"select",label:"Timestamp",value:e.timestampMethod,options:[{label:"Receive Time",value:"receiveTime"},{label:"Header Stamp",value:"headerStamp"}]}}})),xe=J()(e=>({label:"Series",children:Object.fromEntries(e.map((i,h)=>[`${h}`,be(i,h)])),actions:[{type:"action",id:"add-series",label:"Add series",display:"inline",icon:"Addchart"}]}));function Me(e){return{general:{label:"General",fields:{isSynced:{label:"Sync with other plots",input:"boolean",value:e.isSynced}}},paths:xe(e.paths)}}function Pe(e,n,i){const h=(0,Te.W0)(),s=(0,r.useCallback)(c=>{if(c.action==="update"){const{input:d,path:p,value:u}=c.payload;d==="boolean"&&(0,N.isEqual)(p,["general","isSynced"])?n({isSynced:u}):n((0,L.Uy)(P=>{(0,N.set)(P,p,u)}))}if(c.action==="perform-node-action"){if(c.payload.id==="add-series")n((0,L.Uy)(d=>{d.paths.push({timestampMethod:"receiveTime",value:"",enabled:!0})}));else if(c.payload.id==="delete-series"){const d=c.payload.path[1];n((0,L.Uy)(p=>{p.paths.splice(Number(d),1)}))}}},[n]);(0,r.useEffect)(()=>{h({actionHandler:s,focusedPath:i,nodes:Me(e)})},[s,e,i,h])}var Ce=t(2784);const Ne=["bool","int8","uint8","int16","uint16","int32","uint32","int64","uint64","string","json"],Be=me.R.MONOSPACE,Ie=10,Ae="bold",Ee={},je=(0,ae.ZL)()(e=>({chartWrapper:{position:"relative",marginTop:e.spacing(.5)},chartOverlay:{top:0,left:0,right:0,pointerEvents:"none"},row:{paddingInline:e.spacing(.5),pointerEvents:"none"},button:{minWidth:"auto",textAlign:"left",pointerEvents:"auto",fontWeight:"normal",padding:e.spacing(0,1),maxWidth:"100%","&:hover":{backgroundColor:(0,se.Z)(e.palette.background.paper).setAlpha(.67).toString(),backgroundImage:`linear-gradient(to right, ${e.palette.action.focus}, ${e.palette.action.focus})`},".MuiButton-endIcon":{opacity:.8,fontSize:14,marginLeft:e.spacing(.5),svg:{fontSize:"1em",height:"1em",width:"1em"}},":not(:hover) .MuiButton-endIcon":{display:"none"}}})),De={datalabels:{display:"auto",anchor:"center",align:-45,offset:0,clip:!0,font:{family:Be,size:Ie,weight:Ae}},zoom:{zoom:{enabled:!0,mode:"x",sensitivity:3,speed:.1},pan:{mode:"x",enabled:!0,speed:20,threshold:10}}};function We(e,n){e({panelType:"StateTransitions",updateIfExists:!0,siblingConfigCreator:i=>({...i,paths:(0,N.uniq)(i.paths.concat([{value:n,timestampMethod:"receiveTime"}]))})})}function ze(e){return e.playerState.activeData?.currentTime}const Re=Ce.memo(function(n){const{config:i,saveConfig:h}=n,{paths:s}=i,{classes:c}=je(),d=(0,r.useMemo)(()=>s.map(({value:o})=>o),[s]),p=(0,r.useMemo)(()=>(0,Y.UU)(d),[d]),{openPanelSettings:u}=(0,ue.W)(),{id:P}=(0,le.R)(),{setSelectedPanelIds:T}=(0,de.iy)(),[A,B]=(0,r.useState)(void 0),{startTime:m}=z.Ui(),C=(0,$.An)(ze),b=(0,r.useMemo)(()=>!C||!m?void 0:(0,y.toSec)((0,y.subtract)(C,m)),[C,m]),a=oe(d),S=(0,F.wm)(d),E=(0,z.Bv)(p),v=(0,r.useMemo)(()=>E.map(S),[E,S]),{height:x,heightPerTopic:j}=(0,r.useMemo)(()=>{const o=s.length*64;return{height:Math.max(80,o+30),heightPerTopic:o/s.length}},[s.length]),I=(0,r.useMemo)(()=>{const o=(0,N.pickBy)(a,(l,f)=>!v.some(M=>M[f]));return(0,N.isEmpty)(o)?Ee:o},[v,a]),{datasets:k,minY:D}=(0,r.useMemo)(()=>{if(!m)return{datasets:[],minY:void 0};let o,l=[];return s.forEach((f,M)=>{const W=(M+1)*6*-1;o=Math.min(o??W,W-3);const $e=v.map(O=>O[f.value]),Ge=V({path:f,startTime:m,y:W,pathIndex:M,blocks:$e});l=l.concat(Ge);const q=I[f.value];if(q){const O=V({path:f,startTime:m,y:W,pathIndex:M,blocks:[q]});l=l.concat(O)}}),{datasets:l,minY:o}},[m,s,v,I]),Oe=(0,r.useMemo)(()=>({ticks:{display:!1},grid:{display:!1},type:"linear",min:D,max:-3}),[D]),He=(0,r.useMemo)(()=>({type:"linear",border:{display:!1}}),[]),{width:Ue,ref:Z}=(0,ne.NB)({handleHeight:!1,refreshRate:0,refreshMode:"debounce"});(0,r.useEffect)(()=>{const o=Z.current,l=f=>{f.preventDefault()};return o?.addEventListener("wheel",l),()=>{o?.removeEventListener("wheel",l)}},[Z]);const w=(0,$.m7)(),Ye=(0,r.useCallback)(({x:o})=>{const{seekPlayback:l,playerState:{activeData:{startTime:f}={}}}=w();if(!l||o==null||f==null)return;const M=(0,y.add)(f,(0,y.fromSec)(o));l(M)},[w]),Fe=(0,U.O4)({datasets:k});return Pe(i,h,A),(0,g.jsxs)(R.Z,{flexGrow:1,overflow:"hidden",style:{zIndex:0},children:[(0,g.jsx)(re.Z,{}),(0,g.jsx)(R.Z,{fullWidth:!0,flex:"auto",overflowX:"hidden",overflowY:"auto",children:(0,g.jsxs)("div",{className:c.chartWrapper,style:{height:x},ref:Z,children:[(0,g.jsx)(ce.Z,{zoom:!0,isSynced:i.isSynced,showXAxisLabels:!0,width:Ue??0,height:x,data:Fe,type:"scatter",xAxes:He,xAxisIsPlaybackTime:!0,yAxes:Oe,plugins:De,onClick:Ye,currentTime:b}),(0,g.jsx)(R.Z,{className:c.chartOverlay,position:"absolute",paddingTop:.5,children:s.map((o,l)=>(0,g.jsx)("div",{className:c.row,style:{height:j},children:(0,g.jsx)(ee.Z,{size:"small",color:"inherit","data-testid":"edit-topic-button",className:c.button,endIcon:(0,g.jsx)(_.An,{}),onClick:()=>{T([P]),u(),B(["paths",String(l)])},children:(0,g.jsx)(te.Z,{variant:"inherit",noWrap:!0,children:Q(o,l)})})},l))})]})})]})}),Le={paths:[{value:"",timestampMethod:"receiveTime"}],isSynced:!0},Ze=(0,ie.Z)(Object.assign(Re,{panelType:"StateTransitions",defaultConfig:Le}))}}]);

//# sourceMappingURL=studio-1234.js.map