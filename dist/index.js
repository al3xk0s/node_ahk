"use strict";var De=Object.create;var w=Object.defineProperty;var We=Object.getOwnPropertyDescriptor;var Me=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,we=Object.prototype.hasOwnProperty;var Ae=(e,t)=>{for(var o in t)w(e,o,{get:t[o],enumerable:!0})},J=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Me(t))!we.call(e,i)&&i!==o&&w(e,i,{get:()=>t[i],enumerable:!(r=We(t,i))||r.enumerable});return e};var X=(e,t,o)=>(o=e!=null?De(ke(e)):{},J(t||!e||!e.__esModule?w(o,"default",{value:e,enumerable:!0}):o,e)),Ee=e=>J(w({},"__esModule",{value:!0}),e);var Be={};Ae(Be,{BoolState:()=>f,BoolStateCompose:()=>ie,Cast:()=>Y,Cursor:()=>xe,DisposeWrapper:()=>S,DocUtils:()=>u,Key:()=>me,MouseKey:()=>fe,Observable:()=>I,PromiseUtils:()=>g,Queue:()=>A,Rx:()=>L,ScrollDirection:()=>H,ScrollKey:()=>Ke,StringUtils:()=>E,SuchKey:()=>C,SuchMouseKey:()=>_,combineDisposers:()=>F,combineListeners:()=>x,combineScriptsWithDoc:()=>se,createTimer:()=>Z,createTimerSequence:()=>ee,force:()=>v,getHoldKey:()=>he,getTapKey:()=>Te,getTickByHold:()=>Pe,getTickKey:()=>be,holdKey:()=>q,inOfAny:()=>P,runScript:()=>ne,runScripts:()=>j,sleep:()=>T.sleep,stream:()=>h,tapKey:()=>G,tickKey:()=>z,toDisposer:()=>D,toListener:()=>m,toggleStateByTap:()=>R,whileNeed:()=>Ie,whileNeedAsync:()=>Se,wrapToScriptWithDoc:()=>K});module.exports=Ee(Be);var Y=(e,t,o)=>({match:t,typeName:o,cast:()=>{if(!t(e))throw new Error(`Value ${e} is not type ${o}`);return e},tryCast:()=>{if(t(e))return e}});var v=e=>{if(e==null)throw new Error("Value is not exist");return e},P=(e,t)=>{try{return e in t}catch{return!1}};var h=e=>{let t=typeof e!="function"?()=>e:e;return{forEach(o){let r=0;for(let i of t())o(i,r),r++;return this},map:o=>h(function*(){let i=0;for(let s of t())yield o(s,i),i++}),filter:o=>h(function*(){let i=0;for(let s of t())o(s,i)&&(yield s),i++}),get count(){let o=0;for(let r of t())o++;return o},toArray:()=>{let o=[];for(let r of t())o.push(r);return o},get first(){return v(this.firstOrNull)},get last(){return v(this.lastOrNull)},get firstOrNull(){for(let o of t())return o},get lastOrNull(){let o;for(let r of t())o=r;return o}}};var A=class e{static from(t){let o=new e;for(let r of t)o.push(r);return o}pop(){if(this.isEmpty)return;let t=this._head;return this._head=t?.next,this._head==null&&(this._tail=void 0),t?.value}*popAll(){let t;for(;;){if(t=this.pop(),t==null)return;yield t}}push(t){let o={value:t};if(this.isEmpty){this._tail=o,this._head=this._tail;return}this._tail.next=o,this._tail=o}get isEmpty(){return this._head==null||this._tail==null}get canPop(){return!this.isEmpty}get length(){return this.isEmpty?0:h(this.toArray()).count}*toArray(){let t=this._head;for(;t!=null;)yield t.value,t=t.next}stream(){return h(this.toArray())}};var E=class{constructor(){}static{this.toTitleCase=t=>t.split(" ").filter(o=>o!=null&&o!=="").map(o=>o.substring(0,1).toUpperCase()+o.substring(1)).join(" ")}};var g=class{constructor(){}static{this.delayed=(t,o)=>new Promise(r=>{setTimeout(()=>o!=null?r(o()):r(void 0),t)})}static{this.microtask=t=>this.delayed(0,t)}};var Z=({durationMs:e,onStart:t,onStop:o})=>{let r,i,s,n=()=>{r!=null&&(clearTimeout(r),r=null,s=void 0,i?.())};return{start:()=>(n(),t?.(),s=new Promise(l=>{i=l}).then(()=>o?.()),r=setTimeout(()=>{n()},e),s),stop:n}},ee=({onStart:e,onStop:t},...o)=>{let r,i=!0,s=()=>{i||(r?.stop(),i=!0)},n=async()=>{s(),i=!1,e?.();for(let l of o){if(i)break;r=l,await r.start()}s()};return{start:async()=>{await n(),t?.()},stop:s}};var te=X(require("crypto")),B=new Uint8Array(256),O=B.length;function N(){return O>B.length-16&&(te.default.randomFillSync(B),O=0),B.slice(O,O+=16)}var y=[];for(let e=0;e<256;++e)y.push((e+256).toString(16).slice(1));function oe(e,t=0){return y[e[t+0]]+y[e[t+1]]+y[e[t+2]]+y[e[t+3]]+"-"+y[e[t+4]]+y[e[t+5]]+"-"+y[e[t+6]]+y[e[t+7]]+"-"+y[e[t+8]]+y[e[t+9]]+"-"+y[e[t+10]]+y[e[t+11]]+y[e[t+12]]+y[e[t+13]]+y[e[t+14]]+y[e[t+15]]}var re=X(require("crypto")),$={randomUUID:re.default.randomUUID};function Oe(e,t,o){if($.randomUUID&&!t&&!e)return $.randomUUID();e=e||{};let r=e.random||(e.rng||N)();if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,t){o=o||0;for(let i=0;i<16;++i)t[o+i]=r[i];return t}return oe(r)}var V=Oe;var I=()=>{let e=new Map;return{listen:t=>{let o=V();return e.set(o,t),()=>e.delete(o)},notify:t=>{for(let o of e.values())o(t)},dispose:()=>e.clear()}},S=()=>{let e=[],t=o=>e.push(o);return{addDisposer:t,addDisposers:o=>o.forEach(t),dispose:()=>e=[]}};var L=(e,{comparer:t=(r,i)=>r===i,forceUpdate:o=!1}={})=>{let r=e,i=I();return{get value(){return r},setValue:(s,{forceUpdate:n=o}={})=>{let p=r;if(r=s,n||!t(p,s))return i.notify(r)},listen:i.listen,dispose:i.dispose}};var f=(e=!1,t={})=>{let o=L(e,t),r=()=>o.setValue(!o.value),i=()=>o.setValue(!0),s=()=>o.setValue(!1);return{get value(){return o.value},get isEnabled(){return o.value},setValue:o.setValue,dispose:o.dispose,listen:o.listen,toggle:r,enable:i,disable:s}},ie={onlyOneActive:(...e)=>{let t=S();for(let o=0;o<e.length;o++){let r=e[o],i=[];for(let s=0;s<e.length;s++)o!=s&&i.push(e[s]);t.addDisposer(r.listen(s=>s&&i.forEach(n=>n.disable())))}return t}};var u=(()=>{let e=a=>`activate ${a.toString()}`,t=a=>`tap ${a.toString()}`,o=a=>`hold ${a.toString()}`,r=a=>`tick ${a.toString()}`,i=({when:a,then:d})=>`When ${e(a)}, then ${o(d)}`,s=({when:a,then:d})=>`When ${t(a)}, then ${t(d)}`,n=({when:a,then:d})=>`When ${e(a)}, then ${r(d)}`,p=a=>P("doc",a),l=a=>{if(typeof a=="string")return[a];if(Array.isArray(a))return a.map(d=>l(d)).reduce((d,ve)=>[...d,...ve]);if(p(a))return l(a.doc);throw Error(`Value ${a} int't doc`)},b=a=>l(a).map(d=>d).join(`
`);return{holdKey:i,tapKey:s,tickKey:n,toStringArray:l,join:b,print:a=>console.log(b(a)),activate:e,tap:t,tick:r,hold:o,isWithDoc:p}})();var U=require("suchibot"),C=(()=>{let e={...U.Key};return delete e.PAGE_UP,delete e.NUM_LOCK,e})(),_=U.MouseButton;var D=e=>typeof e=="function"?()=>void e():P("stop",e)?()=>e.stop():()=>{},m=e=>({stop:D(e)}),F=e=>{let t=S();return t.addDisposers(e),D(t.dispose)},x=e=>m(F(e.map(D)));var T=require("suchibot");var K=(e,{getDoc:t})=>(...o)=>Object.assign(()=>e(...o),{doc:t(...o)}),se=e=>Object.assign(()=>x(e.map(o=>m(o()))),{doc:u.toStringArray(e)}),j=e=>{e.forEach(t=>t()),e.forEach(t=>u.print(t))},ne=e=>j([e]);var W=e=>{let t=f(!1),o=()=>t.isEnabled,r=async l=>{for(;o();)e(),await(0,T.sleep)(l)},i=()=>t.disable();return{tick:({delayMs:l=50}={})=>{o()&&i(),t.enable(),r(l)},onTickStart:l=>{let b=t.listen(k=>{k&&l()});return m(b)},onTickRelease:l=>{let b=t.listen(k=>{k||l()});return m(b)},releaseTick:i,isTicked:o}};var c=require("suchibot");var ae=({onDown:e,onUp:t,hold:o,release:r})=>({onToggleEnabled:(i,{initialEnabled:s=!1,onDisable:n}={})=>{let p=f(s);return e(l=>(p.toggle(),p.isEnabled?i(p,l):n?.(p,l)))},onHold:(i,{onDisable:s}={})=>{let n=f(!1);return x([e(p=>{n.isEnabled||(n.enable(),i(n,p))}),t(p=>{n.disable(),s?.(n,p)})])},holdOnTime:async i=>{o(),await g.delayed(i),r()}}),pe=e=>{let t=()=>c.Keyboard.tap(e),o=n=>c.Keyboard.onDown(e,p=>n(p.modifierKeys)),r=n=>c.Keyboard.onUp(e,p=>n(p.modifierKeys)),i=()=>c.Keyboard.hold(e),s=()=>c.Keyboard.release(e);return{isDown:()=>c.Keyboard.isDown(e),isUp:()=>c.Keyboard.isUp(e),onDown:o,onUp:r,tap:t,hold:i,release:s,get value(){return e},...W(t),...ae({hold:i,release:s,onDown:o,onUp:r}),type:"keyboard",toString:()=>`${e}`}},le=e=>{let t=()=>c.Mouse.click(e),o=n=>c.Mouse.onDown(e,p=>n(p.modifierKeys)),r=n=>c.Mouse.onUp(e,p=>n(p.modifierKeys)),i=()=>c.Mouse.hold(e),s=()=>c.Mouse.release(e);return{isDown:()=>c.Mouse.isDown(e),isUp:()=>c.Mouse.isUp(e),onDown:o,onUp:r,tap:t,hold:i,release:s,get value(){return e},onClick:n=>c.Mouse.onClick(e,n),doubleClick:()=>c.Mouse.doubleClick(e),...W(t),...ae({hold:i,release:s,onDown:o,onUp:r}),type:"mouse",toString:()=>`${e} (mouse)`}};var ce=require("suchibot");var H=(o=>(o[o.up=1]="up",o[o.down=-1]="down",o))(H||{}),Q=100,ye=({step:e=Q,direction:t})=>{let o=I(),r=()=>{ce.Mouse.scroll({y:e*t}),o.notify()};return{step:e,direction:t,tap:r,...W(r),toString:()=>`${H[t]} (scroll)`}},ue=(e=Q)=>ye({step:e,direction:-1}),de=(e=Q)=>ye({step:e,direction:1});var me=(()=>{let e={};return Object.entries(C).forEach(([t,o])=>e[t]=pe(o)),e})(),fe=(()=>{let e={};return Object.entries(_).forEach(([t,o])=>e[t]=le(o)),e})(),Ke={UP:de,DOWN:ue};var M=require("suchibot"),xe=(()=>{let e=()=>M.Mouse.getPosition(),t=({x:r,y:i})=>{if(r!=null&&i!=null)return M.Mouse.moveTo(r,i);let s=e();return M.Mouse.moveTo(r??s.x,i??s.y)};return{move:({x:r,y:i})=>{let s=e();return t({x:s.x+(r??0),y:s.y+(i??0)})},moveTo:t,getPosition:e,onMove:r=>M.Mouse.onMove(i=>r({x:i.x,y:i.y},i.modifierKeys,i))}})();var q=({when:e,then:t})=>e.onToggleEnabled(()=>{t.hold()},{onDisable:()=>{t.release()}}),he=K(q,{getDoc:e=>u.holdKey(e)});var G=({when:e,then:t})=>e.onDown(()=>t.tap()),Te=K(G,{getDoc:e=>u.tapKey(e)});var R=({initial:e=!1,key:t})=>{let o=f(e);return t.onDown(()=>o.toggle()),o};var z=({when:e,then:t,delayMs:o=50})=>e.onToggleEnabled(()=>t.tick({delayMs:o}),{onDisable:()=>t.releaseTick()}),be=K(z,{getDoc:e=>u.tickKey(e)}),Pe=K(({when:e,then:t,activate:o})=>{let r=R({key:o});return x([m(r.listen(i=>{i||t.releaseTick()})),e.onHold(()=>{r.isEnabled&&t.tick()},{onDisable:()=>t.releaseTick()})])},{getDoc:({when:e,then:t,activate:o})=>[`When ${u.tap(o)}, then activate script`,"",`When ${u.hold(e)}, then ${u.hold(t)}`]});var ge=100,Ie=async({needContinue:e,execute:t,delayMs:o=ge})=>{let r=1;for(;e(r);)t(),await(0,T.sleep)(o),r++},Se=async({needContinue:e,execute:t,delayMs:o=ge})=>{let r=1;for(;e(r);)await t(),await(0,T.sleep)(o),r++};0&&(module.exports={BoolState,BoolStateCompose,Cast,Cursor,DisposeWrapper,DocUtils,Key,MouseKey,Observable,PromiseUtils,Queue,Rx,ScrollDirection,ScrollKey,StringUtils,SuchKey,SuchMouseKey,combineDisposers,combineListeners,combineScriptsWithDoc,createTimer,createTimerSequence,force,getHoldKey,getTapKey,getTickByHold,getTickKey,holdKey,inOfAny,runScript,runScripts,sleep,stream,tapKey,tickKey,toDisposer,toListener,toggleStateByTap,whileNeed,whileNeedAsync,wrapToScriptWithDoc});
