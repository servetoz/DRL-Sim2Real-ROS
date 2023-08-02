"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5807],{14571:(A,c,l)=>{l.d(c,{o:()=>f});var s=l(52322),o=l(2784);class f extends o.Component{state={hadError:!1};componentDidCatch(g){this.setState({hadError:!0}),this.props.onError(g)}render(){return this.state.hadError?(0,s.jsx)(s.Fragment,{}):this.props.children}}},96133:(A,c,l)=>{l.d(c,{J:()=>s});function s(o,f){if(typeof o.value=="object")throw new Error("filterMatches only works on paths where global variables have been filled in");if(o.value==null)return!1;let u=f;for(const g of o.path)if(typeof u!="object"||u==null||(u=u[g],u==null))return!1;return u!=null&&u==o.value}},62273:(A,c,l)=>{l.d(c,{T:()=>f});var s=l(49302),o=l(96133);function f(u,g){if(u.topic!==g.topicName)return[];const j=[];function m(p,v){const h=g.messagePath[v];if(h==null){j.push(p);return}if(p!=null)switch(h.type){case"slice":{if(!Array.isArray(p)&&!(0,s.f)(p))return;if(typeof h.start=="object"||typeof h.end=="object")throw new Error("Variables in slices are not supported");const{start:M,end:I}=h;for(let y=M;y<p.length&&y<=I;y++)m(p[y],v+1);return}case"filter":return(0,o.J)(h,p)?m(p,v+1):void 0;case"name":return typeof p!="object"?void 0:m(p[h.name],v+1)}}return m(u.message,0),j}},15807:(A,c,l)=>{l.r(c),l.d(c,{default:()=>q});var s=l(52322),o=l(2784),f=l(28316),u=l(7506),g=l(14571),j=l(14075),m=l(77357),p=l(88724),v=l(47746),h=l(68434),M=l(76635),I=l(8740),y=l(1012),B=l(62273),L=l(93812),N=l(77075),U=l(10363);function V(e,a){const t=typeof e=="object"?e.data:e;if(t!=null)for(const r of a){let n;try{if(typeof t=="boolean"||typeof t=="number"){if(n=JSON.parse(r.rawValue),typeof n!="boolean"&&typeof n!="number")continue}else typeof t=="string"?n=r.rawValue:typeof t=="bigint"?n=BigInt(r.rawValue):(0,U.v)(t,"Unsupported rule value")}catch{continue}if(r.operator==="="&&t===n)return r;if(r.operator==="<"&&t<n)return r;if(r.operator==="<="&&t<=n)return r;if(r.operator===">"&&t>n)return r;if(r.operator===">="&&t>=n)return r}}var Z=l(67067),x=l(5817),F=l.n(x);function K(e){return`data ${{"=":"=","<":"<","<=":"\u2264",">":">",">=":"\u2265"}[e.operator]} ${e.rawValue}`}function W(e,a){return(0,Z.Uy)(e,t=>{switch(a.action){case"perform-node-action":if(a.payload.path[0]==="rules"){if(a.payload.id==="delete-rule"){const r=+a.payload.path[1];t.rules.splice(r,1)}else if(a.payload.id==="add-rule"||a.payload.id==="add-rule-above"||a.payload.id==="add-rule-below"){let r=t.rules.length;a.payload.id==="add-rule-above"&&a.payload.path[1]!=="default"?r=+a.payload.path[1]:a.payload.id==="add-rule-below"&&(r=+a.payload.path[1]+1),t.rules.splice(r,0,{operator:"=",rawValue:"true",color:`#${Math.floor(Math.random()*16777216).toString(16)}`,label:"Label"})}else if(a.payload.id==="move-up"){const r=+a.payload.path[1],[n]=t.rules.splice(r,1);t.rules.splice(r-1,0,n)}else if(a.payload.id==="move-down"){const r=+a.payload.path[1],[n]=t.rules.splice(r,1);t.rules.splice(r+1,0,n)}}break;case"update":switch(a.payload.path[0]){case"general":(0,M.set)(t,[a.payload.path[1]],a.payload.value);break;case"rules":if(a.payload.path[1]==="default")(0,M.set)(t,[a.payload.path[2]],a.payload.value);else{const r=+a.payload.path[1];(0,M.set)(t.rules[r],[a.payload.path[2]],a.payload.value)}break;default:throw new Error(`Unexpected payload.path[0]: ${a.payload.path[0]}`)}break}})}const G=F()((e,a,t)=>{const r=[{type:"action",id:"delete-rule",label:"Delete rule",icon:"Delete"},a>0&&{type:"action",id:"move-up",label:"Move up",icon:"MoveUp"},a<t.length-1&&{type:"action",id:"move-down",label:"Move down",icon:"MoveDown"},{type:"action",id:"add-rule-above",label:"Add rule above",icon:"Add"},{type:"action",id:"add-rule-below",label:"Add rule below",icon:"Add"}];return{label:K(e),actions:r.filter(n=>n!==!1),fields:{operator:{label:"Comparison",input:"select",value:e.operator,options:[{label:"Equal to",value:"="},{label:"Less than",value:"<"},{label:"Less than or equal to",value:"<="},{label:"Greater than",value:">"},{label:"Greater than or equal to",value:">="}]},rawValue:{label:"Compare with",input:"string",value:e.rawValue},color:{label:"Color",input:"rgb",value:e.color},label:{label:"Label",input:"string",value:e.label}}}});function $(e,a,t){const{path:r,style:n,rules:i}=e,d=(0,o.useMemo)(()=>({error:t,fields:{path:{label:"Message path",input:"messagepath",value:r,error:a},style:{label:"Style",input:"select",value:n,options:[{label:"Bulb",value:"bulb"},{label:"Background",value:"background"}]}}}),[t,r,a,n]),{fallbackColor:E,fallbackLabel:C}=e,w=(0,o.useMemo)(()=>({label:"Rules (first matching rule wins)",actions:[{type:"action",id:"add-rule",label:"Add rule",icon:"Add"}],children:Object.fromEntries(i.map((T,P)=>[P.toString(),G(T,P,i)]).concat([["default",{label:"Otherwise",fields:{fallbackColor:{label:"Color",input:"rgb",value:E,help:"Color to use when no other rules match"},fallbackLabel:{label:"Label",input:"string",value:C,help:"Label to use when no other rules match"}},actions:[{type:"action",id:"add-rule-above",label:"Add rule above",icon:"Add"}]}]]))}),[E,C,i]);return(0,u.O4)({general:d,rules:w})}const z={path:"",style:"bulb",fallbackColor:"#a0a0a0",fallbackLabel:"False",rules:[{operator:"=",rawValue:"true",color:"#68e24a",label:"True"}]},H=(0,I.D2)("div",{root:{width:40,height:40,borderRadius:"50%",position:"relative",backgroundImage:["radial-gradient(transparent, transparent 55%, rgba(255,255,255,0.4) 80%, rgba(255,255,255,0.4))","radial-gradient(circle at 38% 35%, rgba(255,255,255,0.8), transparent 30%, transparent)","radial-gradient(circle at 46% 44%, transparent, transparent 61%, rgba(0,0,0,0.7) 74%, rgba(0,0,0,0.7))"].join(",")}});function Q(e){if(e.length<=1)return e[0];throw new Error("Message path produced multiple results")}function J(e,a){try{switch(a.type){case"frame":{if(e.pathParseError!=null)return{...e,latestMessage:(0,M.last)(a.messages),error:void 0};let t=e.latestMatchingQueriedData,r=e.latestMessage;if(e.parsedPath)for(const n of a.messages){if(n.topic!==e.parsedPath.topicName)continue;const i=Q((0,B.T)(n,e.parsedPath));i!=null&&(t=i,r=n)}return{...e,latestMessage:r,latestMatchingQueriedData:t,error:void 0}}case"path":{const t=(0,y.ZP)(a.path);let r;t?.messagePath.some(d=>d.type==="filter"&&typeof d.value=="object"||d.type==="slice"&&(typeof d.start=="object"||typeof d.end=="object"))===!0&&(r="Message paths using variables are not currently supported");let n,i;try{n=t&&r==null&&e.latestMessage?Q((0,B.T)(e.latestMessage,t)):void 0}catch(d){i=d}return{...e,path:a.path,parsedPath:t,latestMatchingQueriedData:n,error:i,pathParseError:r}}case"seek":return{...e,latestMessage:void 0,latestMatchingQueriedData:void 0,error:void 0}}}catch(t){return{...e,latestMatchingQueriedData:void 0,error:t}}}function Y({context:e}){const[a,t]=(0,o.useState)(()=>()=>{}),{palette:{augmentColor:r}}=(0,v.Z)(),[n,i]=(0,o.useState)(()=>({...z,...e.initialState})),[d,E]=(0,o.useReducer)(J,n,({path:b})=>({path:b,parsedPath:(0,y.ZP)(b),latestMessage:void 0,latestMatchingQueriedData:void 0,pathParseError:void 0,error:void 0}));(0,o.useLayoutEffect)(()=>{E({type:"path",path:n.path})},[n.path]),(0,o.useEffect)(()=>{e.saveState(n),e.setDefaultPanelTitle(n.path===""?void 0:n.path)},[n,e]),(0,o.useEffect)(()=>(e.onRender=(b,R)=>{t(()=>R),b.didSeek===!0&&E({type:"seek"}),b.currentFrame&&E({type:"frame",messages:b.currentFrame})},e.watch("currentFrame"),e.watch("didSeek"),()=>{e.onRender=void 0}),[e]);const C=(0,o.useCallback)(b=>i(R=>W(R,b)),[i]),w=$(n,d.pathParseError,d.error?.message);(0,o.useEffect)(()=>{e.updatePanelSettingsEditor({actionHandler:C,nodes:w})},[e,C,w]),(0,o.useEffect)(()=>(d.parsedPath?.topicName!=null&&e.subscribe([d.parsedPath.topicName]),()=>e.unsubscribeAll()),[e,d.parsedPath?.topicName]),(0,o.useEffect)(()=>{a()},[a]);const T=typeof d.latestMatchingQueriedData=="boolean"||typeof d.latestMatchingQueriedData=="bigint"||typeof d.latestMatchingQueriedData=="string"||typeof d.latestMatchingQueriedData=="number"?d.latestMatchingQueriedData:void 0,{style:P,rules:k,fallbackColor:S,fallbackLabel:_}=n,D=(0,o.useMemo)(()=>V(T,k),[T,k]);return(0,s.jsx)(L.Z,{fullHeight:!0,children:(0,s.jsx)(L.Z,{flexGrow:1,justifyContent:"space-around",alignItems:"center",overflow:"hidden",padding:1,style:{backgroundColor:P==="background"?D?.color??S:void 0},children:(0,s.jsxs)(L.Z,{direction:"row",alignItems:"center",gap:2,children:[P==="bulb"&&(0,s.jsx)(H,{style:{backgroundColor:D?.color??S}}),(0,s.jsx)(h.Z,{color:P==="background"?r({color:{main:D?.color??S}}).contrastText:D?.color??S,fontFamily:N.R.MONOSPACE,variant:"h1",whiteSpace:"pre",children:D?.label??_})]})})})}function X(e,a){return f.render((0,s.jsx)(o.StrictMode,{children:(0,s.jsx)(g.o,{onError:e,children:(0,s.jsx)(p.Z,{isDark:!0,children:(0,s.jsx)(Y,{context:a})})})}),a.panelElement),()=>{f.unmountComponentAtNode(a.panelElement)}}function O(e){const a=(0,u.iY)(),t=(0,o.useMemo)(()=>X.bind(void 0,a),[a]);return(0,s.jsx)(m._,{config:e.config,saveConfig:e.saveConfig,initPanel:t,highestSupportedConfigVersion:1})}O.panelType="Indicator",O.defaultConfig={};const q=(0,j.Z)(O)},49302:(A,c,l)=>{l.d(c,{f:()=>f});var s=l(76635),o=l.n(s);function f(u){return(0,s.isTypedArray)(u)}}}]);

//# sourceMappingURL=studio-5807.js.map