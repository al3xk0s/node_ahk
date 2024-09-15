"use strict";var Ie=Object.create;var E=Object.defineProperty;var Se=Object.getOwnPropertyDescriptor;var Pe=Object.getOwnPropertyNames;var De=Object.getPrototypeOf,ve=Object.prototype.hasOwnProperty;var We=(e,t)=>{for(var o in t)E(e,o,{get:t[o],enumerable:!0})},q=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Pe(t))!ve.call(e,n)&&n!==o&&E(e,n,{get:()=>t[n],enumerable:!(r=Se(t,n))||r.enumerable});return e};var z=(e,t,o)=>(o=e!=null?Ie(De(e)):{},q(t||!e||!e.__esModule?E(o,"default",{value:e,enumerable:!0}):o,e)),Ee=e=>q(E({},"__esModule",{value:!0}),e);var ke={};We(ke,{BoolState:()=>f,BoolStateCompose:()=>ee,Cast:()=>J,DisposeWrapper:()=>S,Key:()=>ye,MouseKey:()=>de,Observable:()=>I,PromiseUtils:()=>g,Queue:()=>A,Rx:()=>M,ScrollDirection:()=>U,ScrollKey:()=>ue,StringUtils:()=>k,SuchKey:()=>O,SuchMouseKey:()=>_,combineDisposers:()=>$,combineListeners:()=>h,combineScriptsWithDoc:()=>te,doc:()=>d,force:()=>P,getHoldKey:()=>me,getTapKey:()=>fe,getTickByHold:()=>he,getTickKey:()=>Ke,holdKey:()=>F,inOfAny:()=>b,runScripts:()=>oe,stream:()=>x,tapKey:()=>j,tickKey:()=>Q,toDisposer:()=>D,toListener:()=>m,toggleStateByTap:()=>H,whileNeed:()=>Te,whileNeedAsync:()=>be,wrapToScriptWithDoc:()=>K});module.exports=Ee(ke);var J=(e,t,o)=>({match:t,typeName:o,cast:()=>{if(!t(e))throw new Error(`Value ${e} is not type ${o}`);return e},tryCast:()=>{if(t(e))return e}});var P=e=>{if(e==null)throw new Error("Value is not exist");return e},b=(e,t)=>{try{return e in t}catch{return!1}};var x=e=>{let t=typeof e!="function"?()=>e:e;return{forEach(o){let r=0;for(let n of t())o(n,r),r++;return this},map:o=>x(function*(){let n=0;for(let s of t())yield o(s,n),n++}),filter:o=>x(function*(){let n=0;for(let s of t())o(s,n)&&(yield s),n++}),get count(){let o=0;for(let r of t())o++;return o},toArray:()=>{let o=[];for(let r of t())o.push(r);return o},get first(){return P(this.firstOrNull)},get last(){return P(this.lastOrNull)},get firstOrNull(){for(let o of t())return o},get lastOrNull(){let o;for(let r of t())o=r;return o}}};var A=class e{static from(t){let o=new e;for(let r of t)o.push(r);return o}pop(){if(this.isEmpty)return;let t=this._head;return this._head=t?.next,this._head==null&&(this._tail=void 0),t?.value}*popAll(){let t;for(;;){if(t=this.pop(),t==null)return;yield t}}push(t){let o={value:t};if(this.isEmpty){this._tail=o,this._head=this._tail;return}this._tail.next=o,this._tail=o}get isEmpty(){return this._head==null||this._tail==null}get canPop(){return!this.isEmpty}get length(){return this.isEmpty?0:x(this.toArray()).count}*toArray(){let t=this._head;for(;t!=null;)yield t.value,t=t.next}stream(){return x(this.toArray())}};var k=class{constructor(){}static{this.toTitleCase=t=>t.split(" ").filter(o=>o!=null&&o!=="").map(o=>o.substring(0,1).toUpperCase()+o.substring(1)).join(" ")}};var g=class{constructor(){}static{this.delayed=(t,o)=>new Promise(r=>{setTimeout(()=>o!=null?r(o()):r(void 0),t)})}};var X=z(require("crypto")),B=new Uint8Array(256),w=B.length;function R(){return w>B.length-16&&(X.default.randomFillSync(B),w=0),B.slice(w,w+=16)}var c=[];for(let e=0;e<256;++e)c.push((e+256).toString(16).slice(1));function Y(e,t=0){return c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]}var Z=z(require("crypto")),C={randomUUID:Z.default.randomUUID};function Ae(e,t,o){if(C.randomUUID&&!t&&!e)return C.randomUUID();e=e||{};let r=e.random||(e.rng||R)();if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,t){o=o||0;for(let n=0;n<16;++n)t[o+n]=r[n];return t}return Y(r)}var N=Ae;var I=()=>{let e=new Map;return{listen:t=>{let o=N();return e.set(o,t),()=>e.delete(o)},notify:t=>{for(let o of e.values())o(t)},dispose:()=>e.clear()}},S=()=>{let e=[],t=o=>e.push(o);return{addDisposer:t,addDisposers:o=>o.forEach(t),dispose:()=>e=[]}};var M=(e,{comparer:t=(r,n)=>r===n,forceUpdate:o=!1}={})=>{let r=e,n=I();return{get value(){return r},setValue:(s,{forceUpdate:a=o}={})=>{let p=r;if(r=s,a||!t(p,s))return n.notify(r)},listen:n.listen,dispose:n.dispose}};var f=(e=!1,t={})=>{let o=M(e,t),r=()=>o.setValue(!o.value),n=()=>o.setValue(!0),s=()=>o.setValue(!1);return{get value(){return o.value},get isEnabled(){return o.value},setValue:o.setValue,dispose:o.dispose,listen:o.listen,toggle:r,enable:n,disable:s}},ee={onlyOneActive:(...e)=>{let t=S();for(let o=0;o<e.length;o++){let r=e[o],n=[];for(let s=0;s<e.length;s++)o!=s&&n.push(e[s]);t.addDisposer(r.listen(s=>s&&n.forEach(a=>a.disable())))}return t}};var d=(()=>{let e=i=>`activate ${i.toString()}`,t=i=>`tap ${i.toString()}`,o=i=>`hold ${i.toString()}`,r=i=>`tick ${i.toString()}`,n=({when:i,then:u})=>`When ${e(i)}, then ${o(u)}`,s=({when:i,then:u})=>`When ${t(i)}, then ${t(u)}`,a=({when:i,then:u})=>`When ${e(i)}, then ${r(u)}`,p=i=>b("doc",i),y=i=>{if(typeof i=="string")return[i];if(Array.isArray(i))return i.map(u=>y(u)).reduce((u,ge)=>[...u,...ge]);if(p(i))return y(i.doc);throw Error(`Value ${i} int't doc`)},T=i=>y(i).map(u=>u).join(`
`);return{holdKey:n,tapKey:s,tickKey:a,toStringArray:y,join:T,print:i=>console.log(T(i)),activate:e,tap:t,tick:r,hold:o,isWithDoc:p}})();var L=require("suchibot"),O=(()=>{let e={...L.Key};return delete e.PAGE_UP,delete e.NUM_LOCK,e})(),_=L.MouseButton;var D=e=>typeof e=="function"?()=>void e():b("stop",e)?()=>e.stop():()=>{},m=e=>({stop:D(e)}),$=e=>{let t=S();return t.addDisposers(e),D(t.dispose)},h=e=>m($(e.map(D)));var K=(e,{getDoc:t})=>(...o)=>Object.assign(()=>e(...o),{doc:t(...o)}),te=e=>Object.assign(()=>h(e.map(o=>m(o()))),{doc:d.toStringArray(e)}),oe=e=>{e.forEach(t=>t()),e.forEach(t=>d.print(t))};var re=require("suchibot");var v=e=>{let t=f(!1),o=()=>t.isEnabled,r=async y=>{for(;o();)e(),await(0,re.sleep)(y)},n=()=>t.disable();return{tick:({delayMs:y=50}={})=>{o()&&n(),t.enable(),r(y)},onTickStart:y=>{let T=t.listen(W=>{W&&y()});return m(T)},onTickRelease:y=>{let T=t.listen(W=>{W||y()});return m(T)},releaseTick:n,isTicked:o}};var l=require("suchibot");var ne=({onDown:e,onUp:t,hold:o,release:r})=>({onToggleEnabled:(n,{initialEnabled:s=!1,onDisable:a}={})=>{let p=f(s);return e(y=>{if(p.toggle(),p.isEnabled)return n(p,y);if(a!=null)return a(p,y)})},onHold:(n,s)=>{let a=f(!1);return h([e(p=>{a.isEnabled||(a.enable(),n(a,p))}),t(p=>{a.disable(),s?.(a,p)})])},holdTimed:async n=>{o(),await g.delayed(n),r()}}),se=e=>{let t=()=>l.Keyboard.tap(e),o=a=>l.Keyboard.onDown(e,p=>a(p.modifierKeys)),r=a=>l.Keyboard.onUp(e,p=>a(p.modifierKeys)),n=()=>l.Keyboard.hold(e),s=()=>l.Keyboard.release(e);return{isDown:()=>l.Keyboard.isDown(e),isUp:()=>l.Keyboard.isUp(e),onDown:o,onUp:r,tap:t,hold:n,release:s,get value(){return e},...v(t),...ne({hold:n,release:s,onDown:o,onUp:r}),type:"keyboard",toString:()=>`${e}`}},ie=e=>{let t=()=>l.Mouse.click(e),o=a=>l.Mouse.onDown(e,p=>a(p.modifierKeys)),r=a=>l.Mouse.onUp(e,p=>a(p.modifierKeys)),n=()=>l.Mouse.hold(e),s=()=>l.Mouse.release(e);return{isDown:()=>l.Mouse.isDown(e),isUp:()=>l.Mouse.isUp(e),onDown:o,onUp:r,tap:t,hold:n,release:s,get value(){return e},onClick:a=>l.Mouse.onClick(e,a),doubleClick:()=>l.Mouse.doubleClick(e),...v(t),...ne({hold:n,release:s,onDown:o,onUp:r}),type:"mouse",toString:()=>`${e} (mouse)`}};var ae=require("suchibot");var U=(o=>(o[o.up=1]="up",o[o.down=-1]="down",o))(U||{}),V=100,pe=({step:e=V,direction:t})=>{let o=I(),r=()=>{ae.Mouse.scroll({y:e*t}),o.notify()};return{step:e,direction:t,tap:r,...v(r),toString:()=>`${U[t]} (scroll)`}},le=(e=V)=>pe({step:e,direction:-1}),ce=(e=V)=>pe({step:e,direction:1});var ye=(()=>{let e={};return Object.entries(O).forEach(([t,o])=>e[t]=se(o)),e})(),de=(()=>{let e={};return Object.entries(_).forEach(([t,o])=>e[t]=ie(o)),e})(),ue={UP:ce,DOWN:le};var F=({when:e,then:t})=>e.onToggleEnabled(()=>{t.hold()},{onDisable:()=>{t.release()}}),me=K(F,{getDoc:e=>d.holdKey(e)});var j=({when:e,then:t})=>e.onDown(()=>t.tap()),fe=K(j,{getDoc:e=>d.tapKey(e)});var H=({initial:e=!1,key:t})=>{let o=f(e);return t.onDown(()=>o.toggle()),o};var Q=({when:e,then:t,delayMs:o=50})=>e.onToggleEnabled(()=>t.tick({delayMs:o}),{onDisable:()=>t.releaseTick()}),Ke=K(Q,{getDoc:e=>d.tickKey(e)}),he=K(({when:e,then:t,activate:o})=>{let r=H({key:o});return h([m(r.listen(n=>{n||t.releaseTick()})),e.onHold(()=>{r.isEnabled&&t.tick()},()=>t.releaseTick())])},{getDoc:({when:e,then:t,activate:o})=>[`When ${d.tap(o)}, then activate script`,"",`When ${d.hold(e)}, then ${d.hold(t)}`]});var G=require("suchibot"),xe=100,Te=async({needContinue:e,execute:t,delayMs:o=xe})=>{let r=1;for(;e(r);)t(),await(0,G.sleep)(o),r++},be=async({needContinue:e,execute:t,delayMs:o=xe})=>{let r=1;for(;e(r);)await t(),await(0,G.sleep)(o),r++};0&&(module.exports={BoolState,BoolStateCompose,Cast,DisposeWrapper,Key,MouseKey,Observable,PromiseUtils,Queue,Rx,ScrollDirection,ScrollKey,StringUtils,SuchKey,SuchMouseKey,combineDisposers,combineListeners,combineScriptsWithDoc,doc,force,getHoldKey,getTapKey,getTickByHold,getTickKey,holdKey,inOfAny,runScripts,stream,tapKey,tickKey,toDisposer,toListener,toggleStateByTap,whileNeed,whileNeedAsync,wrapToScriptWithDoc});