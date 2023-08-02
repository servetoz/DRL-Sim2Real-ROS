"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1159],{66838:(C,F,t)=>{t.r(F),t.d(F,{default:()=>st});var e=t(52322),H=t(93553),ce=t(28504),de=t(58777),ue=t(36754),b=t(68434),J=t(63249),B=t(86232),z=t(56961),P=t(87037),pe=t(24394),Me=t(3104),y=t(2784),Y=t(8740),ge=t(91004),je=t(29268),ye=t(14075),me=t(76479),c=t(93812),$=t(88099),X=t(31748),K=t(97851),q=t(32199),Q=t(72283),_=t(52296),L=t(41574),ee=t(44909),xe=t(27379),he=t(85321),Ae=t(16549),fe=t(69208),Ie=t(35296),O=t(81774),T=t(15400),De=t(83993),Z=t(82056),ve=t(76635),Ne=t(56924);const Ce={Hint:(0,e.jsx)(Ae.Z,{fontSize:"small"}),Info:(0,e.jsx)(fe.Z,{fontSize:"small",color:"info"}),Warning:(0,e.jsx)(Ie.Z,{fontSize:"small",color:"warning"}),Error:(0,e.jsx)(he.Z,{fontSize:"small",color:"error"})},Te=(0,Y.ZL)()(s=>({listItem:{paddingTop:0,paddingBottom:0,marginBlock:s.spacing(.5)},listItemText:{display:"flex",flexDirection:"row",margin:0,gap:s.spacing(1)},listItemIcon:{alignSelf:"flex-start",minWidth:s.spacing(3)}})),Ze=({diagnostics:s})=>{const{classes:a}=Te();return s.length===0?(0,e.jsx)(c.Z,{gap:.5,padding:2,children:(0,e.jsx)(b.Z,{variant:"body2",color:"text.secondary",children:"No problems to display."})}):(0,e.jsx)(O.Z,{dense:!0,disablePadding:!0,children:s.map(({severity:d,message:M,source:o,startColumn:i,startLineNumber:n},m)=>{const x=(0,ve.invert)(Ne.H_)[d]??"Error",I=n!=null&&i!=null?`[${n+1},${i+1}]`:"";return(0,e.jsxs)(T.ZP,{className:a.listItem,children:[(0,e.jsx)(De.Z,{className:a.listItemIcon,children:Ce[x]}),(0,e.jsx)(Z.Z,{className:a.listItemText,primary:M,secondary:`${o} ${I}`,secondaryTypographyProps:{color:"text.secondary"}})]},`${M}_${m}`)})})};var k=t(14117),we=t(30650),Se=t(11701);const be=({logs:s})=>{const a=(0,Se.lk)(),d={string:a.base0B,number:a.base09,boolean:a.base09,object:a.base08,undefined:a.base08};return s.length===0?(0,e.jsxs)(c.Z,{gap:.5,padding:2,children:[(0,e.jsx)(b.Z,{variant:"body2",color:"text.secondary",children:"No logs to display."}),(0,e.jsxs)(b.Z,{variant:"body2",color:"text.secondary",children:["Invoke ",(0,e.jsx)("code",{children:"log(someValue)"})," in your Foxglove Studio node code to see data printed here."]})]}):(0,e.jsx)(O.Z,{dense:!0,disablePadding:!0,children:s.map(({source:M,value:o},i)=>{const n=o!=null&&typeof o=="object";return(0,e.jsx)(T.ZP,{disablePadding:!0,secondaryAction:(0,e.jsx)(J.Z,{underline:"always",variant:"body2",color:"text.secondary",children:M}),children:(0,e.jsx)(k.Z,{children:n?(0,e.jsx)(we.ZP,{hideRoot:!0,data:o,invertTheme:!1,theme:a}):(0,e.jsx)(Z.Z,{primary:o==null||o===!1?String(o):o,primaryTypographyProps:{color:d[typeof o]??"text.primary"}})})},`${i}${M}`)})})},ze=36,Le=(0,Y.ZL)()(s=>({badge:{alignItems:"center",[`.${K.Z.badge}`]:{margin:s.spacing(-.25,0,-.25,1),position:"relative",transform:"none",[`&.${K.Z.invisible}`]:{display:"none"}}},tabs:{minHeight:ze,position:"relative",bottom:-1,[`.${q.Z.root}`]:{minHeight:"auto",minWidth:s.spacing(8),padding:s.spacing(1.5,2),color:s.palette.text.secondary,"&.Mui-selected":{color:s.palette.text.primary}}}})),Oe=({nodeId:s,isSaved:a,save:d,diagnostics:M,logs:o})=>{const{classes:i}=Le(),[n,m]=(0,y.useState)("closed"),[x,I]=(0,y.useState)(!0),{clearUserNodeLogs:w}=(0,X.BQ)(),h=(0,y.useRef)(null),S=(f,j)=>{m(j)},D=f=>{n===f&&m("closed")};return(0,y.useEffect)(()=>{x&&h.current&&(h.current.scrollTop=h.current.scrollHeight)},[x,o]),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)(Q.Z,{elevation:0,children:[(0,e.jsx)(z.Z,{}),(0,e.jsxs)(c.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",gap:1,paddingRight:1,children:[(0,e.jsxs)(_.Z,{className:i.tabs,textColor:"inherit",value:n!=="closed"?n:!1,onChange:S,children:[(0,e.jsx)(L.Z,{label:(0,e.jsx)(ee.Z,{color:"error",badgeContent:M.length,invisible:M.length===0,className:i.badge,children:"Problems"}),value:"diagnostics","data-testid":"np-errors",onClick:()=>D("diagnostics")}),(0,e.jsx)(L.Z,{label:(0,e.jsx)(ee.Z,{color:"error",className:i.badge,badgeContent:o.length,invisible:o.length===0,children:"Logs"}),value:"logs","data-testid":"np-logs",onClick:()=>D("logs")})]}),(0,e.jsxs)(c.Z,{direction:"row",alignItems:"center",gap:.5,children:[n==="logs"&&(0,e.jsx)(B.Z,{size:"small",color:"primary",variant:"contained","data-testid":"np-logs-clear",disabled:o.length===0,onClick:()=>{s!=null&&w(s)},children:"Clear logs"}),(0,e.jsx)(B.Z,{size:"small",color:"primary",variant:"contained",disabled:a,title:"Ctrl/Cmd + S",onClick:()=>{s!=null&&(d(),w(s))},children:a?"Saved":"Save"})]})]}),n!=="closed"&&(0,e.jsx)(z.Z,{})]}),(0,e.jsx)(Q.Z,{elevation:0,children:(0,e.jsx)(c.Z,{fullHeight:!0,position:"relative",children:(0,e.jsx)(xe.Z,{onScroll:({currentTarget:f})=>{const j=f.scrollHeight-f.scrollTop>f.clientHeight;j&&x?I(!1):!j&&!x&&I(!0)},ref:h,in:n!=="closed",children:(0,e.jsxs)(c.Z,{overflow:"auto",style:{height:150},children:[n==="diagnostics"&&(0,e.jsx)(Ze,{diagnostics:M}),n==="logs"&&(0,e.jsx)(be,{logs:o})]})})})})]})};var ke=t(92679),Ee=t(28614),Pe=t(50334),Ye=t(63077),Be=t(44419),Qe=t(65154),te=t(34651),We=t(64942);const Re=[{name:"Skeleton",description:"An empty script",template:`import { Input, Message } from "./types";

type Output = {};

export const inputs = ["/topic"];
export const output = "/studio_script/output_topic";

export default function script(event: Input<"/topic">): Output {
  return {};
};
`},{name:"Markers",description:"A script that publishes one or more markers",template:`// This example shows how to publish a Marker message from a User Script.
//
// Publishing Marker messages with a User Script is a good way to visualize non-visual
// data.
//
// For example, if your robot calculates some projected paths and publishes them between two
// subsystems as a message, you can make a node that visualizes the path as a line list marker and view it in the 3D
// panel.

import { Input, Message } from "./types";

// The \`./markers\` utility provides a helper function to build a Marker.
import { buildRosMarker, MarkerTypes } from "./markers";

type GlobalVariables = { id: number };

export const inputs = ["/input/topic"];
export const output = "/studio_script/my_custom_topic";

// Our node will output a Marker message.
type Marker = Message<"visualization_msgs/Marker">;

// If you want to output multiple markers for a single input message, use a MarkerArray.
// The marker array message has one field, \`markers\`, which is an array of Marker messaages.
// type MarkerArray = Message<"visualization_msgs/MarkerArray">;

export default function script(event: Input<"/input/topic">, globalVars: GlobalVariables): Marker {
  return buildRosMarker({
      // Add any fields you want to set in the marker here
      // Any fields you omit will use default values
      // e.g 'type: MarkerTypes.ARROW' */
  });
};
`},{name:"Multiple Inputs",description:"A script that receives inputs on multiple topics",template:`// This example shows how to subscribe to multiple input topics.
//
// NOTE:
// User Scripts can subscribe to multiple input topics, but can only publish on a single topic.

import { Input } from "./types";

type Output = { topic: string };
type GlobalVariables = { id: number };

// List all the input topics in the \`input\` array
export const inputs = ["/input/topic", "/input/another"];
export const output = "/studio_script/output_topic";

// Make an InputEvent type alias. Since our node will get a message from either input topic, we need to enumerate the topics.
type InputEvent = Input<"/input/topic"> | Input<"/input/another">;

export default function script(event: InputEvent, globalVars: GlobalVariables): Output {
  // Remember that your node will get messages on each topic, so you
  // need to check each event's topic to know which fields are available on the message.
  switch (event.topic) {
    case "/input/topic":
      // topic specific input logic
      // Our message fields are specific to our topic message
      break;
    case "/input/another":
      // another specific logic
      break;
  }

  // Nodes can only output one type of message regardless of the inputs
  // Here we echo back the input topic as an example.
  return {
    topic: event.topic,
  };
};
`},{name:"GPS Location",description:"A script that publishes foxglove.LocationFix",template:`// This example shows how to publish a foxglove.LocationFix message
//
// https://foxglove.dev/docs/studio/messages/location-fix
//
// You can visualize this message with the Map panel
// https://foxglove.dev/docs/studio/panels/map

import { Input, Message } from "./types";

export const inputs = ["/input/topic"];
export const output = "/studio_script/my_gps";

// Our node will output a LocationFix message
type LocationFix = Message<"foxglove.LocationFix">;

export default function script(event: Input<"/input/topic">): LocationFix {
  return {
    latitude: 51.477928,
    longitude: -0.001545,
    altitude: 0,
    position_covariance_type: 0,
    position_covariance: new Float64Array(),
  };
};
`}],Ve=(0,Y.ZL)()(s=>({tabs:{[`.${q.Z.root}`]:{minWidth:"auto",padding:s.spacing(1,1.125)}},explorerWrapper:{backgroundColor:s.palette.background.paper,width:350,overflow:"auto"}})),Ge=({nodes:s,selectNode:a,deleteNode:d,collapse:M,selectedNodeId:o})=>(0,e.jsxs)(c.Z,{flex:"auto",children:[(0,e.jsx)(W,{title:"Scripts",collapse:M}),(0,e.jsx)(O.Z,{dense:!0,children:Object.keys(s).map(i=>(0,e.jsx)(T.ZP,{disablePadding:!0,secondaryAction:(0,e.jsx)(P.Z,{size:"small",onClick:()=>d(i),edge:"end","aria-label":"delete",title:"Delete",color:"error",children:(0,e.jsx)(Pe.Z,{fontSize:"small"})}),children:(0,e.jsx)(k.Z,{selected:o===i,onClick:()=>a(i),children:(0,e.jsx)(Z.Z,{primary:s[i]?.name,primaryTypographyProps:{variant:"body1"}})})},i))})]}),{utilityFiles:Ue}=(0,We.v)(),W=({title:s,subheader:a,collapse:d})=>(0,e.jsx)(Qe.Z,{title:s,titleTypographyProps:{variant:"h5",gutterBottom:!0},subheader:a,subheaderTypographyProps:{variant:"body2",color:"text.secondary"},action:(0,e.jsx)(P.Z,{size:"small",onClick:d,title:"Collapse",children:(0,e.jsx)(ke.Z,{})})}),Fe=({userNodes:s,selectNode:a,deleteNode:d,selectedNodeId:M,explorer:o,updateExplorer:i,setScriptOverride:n,script:m,addNewNode:x})=>{const{classes:I}=Ve(),w=o==="nodes",h=o==="utils",S=o==="templates",D=(0,y.useCallback)(v=>{const l=te.Uri.parse(`file://${v}`),u=te.editor.getModel(l);u&&n({filePath:u.uri.path,code:u.getValue(),readOnly:!0,selection:void 0},2)},[n]),f=(0,y.useMemo)(()=>{switch(o){case void 0:return!1;case"nodes":return"nodes";case"templates":return"templates";case"utils":return"utils"}return!1},[o]),j=(0,y.useMemo)(()=>({nodes:(0,e.jsx)(Ge,{nodes:s,selectNode:a,deleteNode:d,collapse:()=>i(void 0),selectedNodeId:M}),utils:(0,e.jsxs)(c.Z,{flex:"auto",position:"relative",children:[(0,e.jsx)(W,{collapse:()=>i(void 0),title:"Utilities",subheader:(0,e.jsxs)(b.Z,{variant:"body2",color:"text.secondary",children:["You can import any of these modules into your script using the following syntax:"," ",(0,e.jsx)("pre",{children:'import { ... } from "./pointClouds.ts".'})]})}),(0,e.jsxs)(O.Z,{dense:!0,children:[Ue.map(({fileName:v,filePath:l})=>(0,e.jsx)(T.ZP,{disablePadding:!0,onClick:D.bind(void 0,l),selected:m?l===m.filePath:!1,children:(0,e.jsx)(k.Z,{children:(0,e.jsx)(Z.Z,{primary:v,primaryTypographyProps:{variant:"body1"}})})},l)),(0,e.jsx)(T.ZP,{disablePadding:!0,onClick:D.bind(void 0,"/studio_script/generatedTypes.ts"),selected:m?m.filePath==="/studio_script/generatedTypes.ts":!1,children:(0,e.jsx)(k.Z,{children:(0,e.jsx)(Z.Z,{primary:"generatedTypes.ts",primaryTypographyProps:{variant:"body1"}})})})]})]}),templates:(0,e.jsxs)(c.Z,{flex:"auto",children:[(0,e.jsx)(W,{title:"Templates",subheader:"Create scripts from these templates, click a template to create a new script.",collapse:()=>i(void 0)}),(0,e.jsx)(O.Z,{dense:!0,children:Re.map(({name:v,description:l,template:u})=>(0,e.jsx)(T.ZP,{disablePadding:!0,onClick:()=>x(u),children:(0,e.jsx)(k.Z,{children:(0,e.jsx)(Z.Z,{primary:v,primaryTypographyProps:{variant:"body1"},secondary:l})})},v))})]})}),[x,d,D,m,a,M,i,s]);return(0,e.jsx)(Q.Z,{elevation:0,children:(0,e.jsxs)(c.Z,{direction:"row",fullHeight:!0,children:[(0,e.jsxs)(_.Z,{className:I.tabs,orientation:"vertical",value:f,children:[(0,e.jsx)(L.Z,{disableRipple:!0,value:"nodes",title:"Scripts",icon:(0,e.jsx)(Be.Z,{fontSize:"large"}),"data-testid":"node-explorer",onClick:()=>i(w?void 0:"nodes")}),(0,e.jsx)(L.Z,{disableRipple:!0,value:"utils",title:"Utilities",icon:(0,e.jsx)(Ee.Z,{fontSize:"large"}),"data-testid":"utils-explorer",onClick:()=>i(h?void 0:"utils")}),(0,e.jsx)(L.Z,{disableRipple:!0,value:"templates",title:"Templates",icon:(0,e.jsx)(Ye.Z,{fontSize:"large"}),"data-testid":"templates-explorer",onClick:()=>i(S?void 0:"templates")})]}),o!=null&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(z.Z,{flexItem:!0,orientation:"vertical"}),(0,e.jsx)("div",{className:I.explorerWrapper,children:j[o]})]}),(0,e.jsx)(z.Z,{flexItem:!0,orientation:"vertical"})]})})};var He=t(39367),A=t(2784);const Je=A.lazy(async()=>await t.e(9596).then(t.bind(t,19596))),$e=`// The ./types module provides helper types for your Input events and messages.
import { Input, Message } from "./types";

// Your script can output well-known message types, any of your custom message types, or
// complete custom message types.
//
// Use \`Message\` to access your data source types or well-known types:
// type Twist = Message<"geometry_msgs/Twist">;
//
// Conventionally, it's common to make a _type alias_ for your script's output type
// and use that type name as the return type for your script function.
// Here we've called the type \`Output\` but you can pick any type name.
type Output = {
  hello: string;
};

// These are the topics your script "subscribes" to. Studio will invoke your script function
// when any message is received on one of these topics.
export const inputs = ["/input/topic"];

// Any output your script produces is "published" to this topic. Published messages are only visible within Studio, not to your original data source.
export const output = "/studio_script/output_topic";

// This function is called with messages from your input topics.
// The first argument is an event with the topic, receive time, and message.
// Use the \`Input<...>\` helper to get the correct event type for your input topic messages.
export default function script(event: Input<"/input/topic">): Output {
  return {
    hello: "world!",
  };
};`,se=(0,Y.ZL)()(s=>({emptyState:{backgroundColor:s.palette.background.default},unsavedDot:{width:6,height:6,borderRadius:"50%",top:"50%",position:"absolute",right:s.spacing(1),transform:"translateY(-50%)",backgroundColor:s.palette.text.secondary},input:{[`.${de.Z.input}`]:{padding:s.spacing(1)}}}));function Xe(s){return{general:{fields:{autoFormatOnSave:{input:"boolean",label:"Auto-format on save",value:s.autoFormatOnSave}}}}}const Ke=({addNewNode:s})=>{const{classes:a}=se();return(0,e.jsx)(je.Z,{className:a.emptyState,children:(0,e.jsx)(ue.Z,{maxWidth:"xs",children:(0,e.jsxs)(c.Z,{justifyContent:"center",alignItems:"center",gap:1,fullHeight:!0,children:[(0,e.jsxs)(b.Z,{variant:"inherit",gutterBottom:!0,children:["Welcome to User Scripts!",(0,e.jsx)("br",{}),"Get started by reading the"," ",(0,e.jsx)(J.Z,{color:"primary",underline:"hover",href:"https://foxglove.dev/docs/studio/panels/user-scripts",target:"_blank",children:"docs"}),", or just create a new script."]}),(0,e.jsx)(B.Z,{color:"inherit",variant:"contained",onClick:()=>s(),startIcon:(0,e.jsx)(H.Z,{}),children:"New script"})]})})})},qe=Object.freeze({}),_e=s=>s.selectedLayout?.data?.userNodes??qe;function et(s){const{config:a,saveConfig:d}=s,{classes:M,theme:o}=se(),{autoFormatOnSave:i=!1,selectedNodeId:n,editorForStorybook:m}=a,x=(0,He.W0)(),[I,w]=A.useState(void 0),h=(0,$.NS)(_e),{state:{nodeStates:S,rosLib:D,typesLib:f}}=(0,X.BQ)(),{setUserNodes:j}=(0,$._B)(),v=(n!=null?S[n]?.diagnostics:void 0)??[],l=n!=null?h[n]:void 0,[u,E]=A.useState([]),p=u.length>0?u[u.length-1]:void 0,R=!!l&&!!p&&p.filePath===l.name,ne=!R||p.code===l.sourceCode,nt=(n!=null?S[n]?.logs:void 0)??[],[oe,ae]=(0,y.useState)(()=>p?p.filePath+(p.readOnly?" (READONLY)":""):"script name"),V=o.palette.mode==="dark",ot={backgroundColor:o.palette.background[V?"default":"paper"],width:`${Math.max(oe.length+4,10)}ch`},ie=(0,y.useCallback)(r=>{if(r.action!=="update")return;const{input:g,value:N,path:lt}=r.payload;g==="boolean"&&lt[1]==="autoFormatOnSave"&&d({autoFormatOnSave:N})},[d]);(0,y.useEffect)(()=>{x({actionHandler:ie,nodes:Xe(a)})},[ie,a,x]),A.useLayoutEffect(()=>{if(l){const r=s.config.additionalBackStackItems??[];E([{filePath:l.name,code:l.sourceCode,readOnly:!1},...r])}},[s.config.additionalBackStackItems,l]),A.useLayoutEffect(()=>{ae(()=>p?p.filePath+(p.readOnly?" (READONLY)":""):"script name")},[p]);const G=(0,y.useCallback)(()=>{n!=null&&l&&p&&R&&j({[n]:{...l,sourceCode:p.code}})},[p,R,l,n,j]),U=A.useCallback(r=>{G();const g=(0,ge.Z)(),N=r??$e;j({[g]:{sourceCode:N,name:`${g.split("-")[0]}`}}),d({selectedNodeId:g})},[d,G,j]),le=A.useCallback(r=>{n==null||r==null||r===""||!l||j({[n]:{...l,sourceCode:r}})},[l,n,j]),re=A.useCallback((r,g)=>{g!=null&&g>0&&u.length>=g?E([...u.slice(0,g-1),r]):E([...u,r])},[u]),at=A.useCallback(()=>{E(u.slice(0,u.length-1))},[u]),it=A.useCallback(r=>{const g=[...u];if(g.length>0){const N=g.pop();N&&!N.readOnly&&E([...g,{...N,code:r}])}},[u]);return(0,e.jsxs)(c.Z,{fullHeight:!0,children:[(0,e.jsx)(me.Z,{}),(0,e.jsx)(z.Z,{}),(0,e.jsxs)(c.Z,{direction:"row",fullHeight:!0,overflow:"hidden",children:[(0,e.jsx)(Fe,{explorer:I,updateExplorer:w,selectNode:r=>{G(),d({selectedNodeId:r})},deleteNode:r=>{j({...h,[r]:void 0}),d({selectedNodeId:void 0})},selectedNodeId:n,userNodes:h,script:p,setScriptOverride:re,addNewNode:U}),(0,e.jsxs)(c.Z,{flexGrow:1,fullHeight:!0,overflow:"hidden",style:{backgroundColor:o.palette.background[V?"paper":"default"]},children:[(0,e.jsxs)(c.Z,{direction:"row",alignItems:"center",children:[u.length>1&&(0,e.jsx)(P.Z,{title:"Go back","data-testid":"go-back",size:"small",onClick:at,children:(0,e.jsx)(ce.Z,{})}),n!=null&&l&&(0,e.jsxs)("div",{style:{position:"relative"},children:[(0,e.jsx)(pe.Z,{className:M.input,size:"small",disableUnderline:!0,placeholder:"script name",value:oe,disabled:!p||p.readOnly,onChange:r=>{const g=r.target.value;ae(g),j({...h,[n]:{...l,name:g}})},inputProps:{spellCheck:!1,style:ot}}),!ne&&(0,e.jsx)("div",{className:M.unsavedDot})]}),(0,e.jsx)(P.Z,{title:"New node","data-testid":"new-node",size:"small",onClick:()=>U(),children:(0,e.jsx)(H.Z,{})})]}),(0,e.jsxs)(c.Z,{flexGrow:1,overflow:"hidden ",children:[n==null&&(0,e.jsx)(Ke,{addNewNode:U}),(0,e.jsx)(c.Z,{flexGrow:1,fullWidth:!0,overflow:"hidden",style:{display:n!=null?"flex":"none"},children:(0,e.jsx)(y.Suspense,{fallback:(0,e.jsx)(c.Z,{direction:"row",flex:"auto",alignItems:"center",justifyContent:"center",fullHeight:!0,fullWidth:!0,style:{backgroundColor:o.palette.background[V?"default":"paper"]},children:(0,e.jsx)(Me.Z,{size:28})}),children:m??(0,e.jsx)(Je,{autoFormatOnSave:i,script:p,setScriptCode:it,setScriptOverride:re,rosLib:D,typesLib:f,save:le})})}),(0,e.jsx)(c.Z,{children:(0,e.jsx)(Oe,{nodeId:n,isSaved:ne,save:()=>le(p?.code),diagnostics:v,logs:nt})})]})]})]})]})}const tt={selectedNodeId:void 0,autoFormatOnSave:!0},st=(0,ye.Z)(Object.assign(et,{panelType:"NodePlayground",defaultConfig:tt}))},94748:C=>{C.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII="},6161:C=>{C.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="},51096:C=>{C.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="}}]);

//# sourceMappingURL=studio-1159.js.map