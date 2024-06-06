(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var Pe;class it extends Error{}it.prototype.name="InvalidTokenError";function Gs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ks(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Gs(t)}catch{return atob(t)}}function ss(i,t){if(typeof i!="string")throw new it("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new it(`Invalid token specified: missing part #${e+1}`);let r;try{r=Ks(s)}catch(n){throw new it(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new it(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Js="mu:context",Xt=`${Js}:change`;class Zs{constructor(t,e){this._proxy=Qs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ae extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Zs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Qs(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let p=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Xs(i,t){const e=rs(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function rs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return rs(i,r.host)}class tr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function is(i="mu:message"){return(t,...e)=>t.dispatchEvent(new tr(e,i))}class le{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function er(i){return t=>({...t,...i})}const te="mu:auth:jwt",kt=class ns extends le{constructor(t,e){super((s,r)=>this.update(s,r),t,ns.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(ir(s)),Wt(r);case"auth/signout":return e(Ce()),Wt(this._redirectForLogin);case"auth/redirect":return e(Ce()),Wt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};kt.EVENT_TYPE="auth:message";kt.dispatch=is(kt.EVENT_TYPE);let sr=kt;function Wt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class rr extends ae{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:Y.authenticateFromLocalStorage()})}connectedCallback(){new sr(this.context,this.redirect).attach(this)}}class W{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class Y extends W{constructor(t){super();const e=ss(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Y(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?Y.authenticate(t):new W}}function ir(i){return er({user:Y.authenticate(i),token:i})}function Ce(){return i=>{const t=i.user;return{user:t&&t.authenticated?W.deauthenticate(t):t,token:""}}}function nr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function or(i){return i.authenticated?ss(i.token||""):{}}const nt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Y,Provider:rr,User:W,headers:nr,payload:or},Symbol.toStringTag,{value:"Module"}));function xt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function ee(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const ce=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ee,relay:xt},Symbol.toStringTag,{value:"Module"})),ar=new DOMParser;function gt(i,...t){const e=i.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=ar.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function jt(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const os=class as extends HTMLElement{constructor(){super(),this._state={},jt(as.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),xt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},cr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};os.template=gt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let lr=os;function cr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const ls=Object.freeze(Object.defineProperty({__proto__:null,Element:lr},Symbol.toStringTag,{value:"Module"})),cs=class hs extends le{constructor(t){super((e,s)=>this.update(e,s),t,hs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(ur(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(dr(s,r));break}}}};cs.EVENT_TYPE="history:message";let he=cs;class Te extends ae{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=hr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this)}}function hr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ur(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function dr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ue=is(he.EVENT_TYPE),It=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class _t{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Oe(this._provider,t);this._effects.push(r),e(r)}else Xs(this._target,this._contextLabel).then(r=>{const n=new Oe(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Oe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const de=class us extends HTMLElement{constructor(){super(),this._state={},this._user=new W,this._authObserver=new _t(this,"blazing:auth"),jt(us.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;fr(r,this._state,e,this.authorization).then(n=>et(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},et(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&se(this.src,this.authorization).then(e=>{this._state=e,et(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&se(this.src,this.authorization).then(r=>{this._state=r,et(r,this)});break;case"new":s&&(this._state={},et({},this));break}}};de.observedAttributes=["src","new","action"];de.template=gt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let pr=de;function se(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function et(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function fr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()}).catch(r=>console.log("Error submitting form:",r))}const ds=Object.freeze(Object.defineProperty({__proto__:null,FormElement:pr,fetchData:se},Symbol.toStringTag,{value:"Module"})),ps=class fs extends le{constructor(t,e){super(e,t,fs.EVENT_TYPE,!1)}};ps.EVENT_TYPE="mu:message";let ms=ps;class mr extends ae{constructor(t,e,s){super(e),this._user=new W,this._updateFn=t,this._authObserver=new _t(this,s)}connectedCallback(){const t=new ms(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const yr=Object.freeze(Object.defineProperty({__proto__:null,Provider:mr,Service:ms},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,pe=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),Re=new WeakMap;let ys=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Re.set(e,t))}return t}toString(){return this.cssText}};const gr=i=>new ys(typeof i=="string"?i:i+"",void 0,fe),_r=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ys(e,i,fe)},vr=(i,t)=>{if(pe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=wt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ue=pe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return gr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$r,defineProperty:br,getOwnPropertyDescriptor:Ar,getOwnPropertyNames:Er,getOwnPropertySymbols:wr,getPrototypeOf:Sr}=Object,G=globalThis,Ne=G.trustedTypes,kr=Ne?Ne.emptyScript:"",Le=G.reactiveElementPolyfillSupport,ot=(i,t)=>i,Pt={toAttribute(i,t){switch(t){case Boolean:i=i?kr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},me=(i,t)=>!$r(i,t),Me={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Me){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&br(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Ar(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Me}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=Sr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const e=this.properties,s=[...Er(e),...wr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ue(r))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Pt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Pt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??me)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[ot("elementProperties")]=new Map,F[ot("finalized")]=new Map,Le==null||Le({ReactiveElement:F}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,Tt=Ct.trustedTypes,je=Tt?Tt.createPolicy("lit-html",{createHTML:i=>i}):void 0,gs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,_s="?"+k,xr=`<${_s}>`,j=document,ct=()=>j.createComment(""),ht=i=>i===null||typeof i!="object"&&typeof i!="function",vs=Array.isArray,Pr=i=>vs(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ie=/-->/g,He=/>/g,R=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),De=/'/g,ze=/"/g,$s=/^(?:script|style|textarea|title)$/i,Cr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),Gt=Cr(1),K=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ve=new WeakMap,N=j.createTreeWalker(j,129);function bs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(t):t}const Tr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=st;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===st?f[1]==="!--"?o=Ie:f[1]!==void 0?o=He:f[2]!==void 0?($s.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=r??st,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?R:f[3]==='"'?ze:De):o===ze||o===De?o=R:o===Ie||o===He?o=st:(o=R,r=void 0);const h=o===R&&i[l+1].startsWith("/>")?" ":"";n+=o===st?a+xr:u>=0?(s.push(p),a.slice(0,u)+gs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[bs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let re=class As{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Tr(t,e);if(this.el=As.createElement(p,s),N.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=N.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(gs)){const c=f[o++],h=r.getAttribute(u).split(k),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Rr:d[1]==="?"?Ur:d[1]==="@"?Nr:Ht}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(u));if($s.test(r.tagName)){const u=r.textContent.split(k),c=u.length-1;if(c>0){r.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ct()),N.nextNode(),a.push({type:2,index:++n});r.append(u[c],ct())}}}else if(r.nodeType===8)if(r.data===_s)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}};function J(i,t,e=i,s){var r,n;if(t===K)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=ht(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=J(i,o._$AS(i,t.values),o,s)),t}let Or=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??j).importNode(e,!0);N.currentNode=r;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new ye(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Lr(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=j,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ye=class Es{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),ht(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=re.createElement(bs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Or(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ve.get(t.strings);return e===void 0&&Ve.set(t.strings,e=new re(t)),e}k(t){vs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Es(this.S(ct()),this.S(ct()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=J(this,t,e,0),o=!ht(t)||t!==this._$AH&&t!==K,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=J(this,l[s+a],e,a),p===K&&(p=this._$AH[a]),o||(o=!ht(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Rr=class extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Ur=class extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},Nr=class extends Ht{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??$)===K)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Lr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}};const Fe=Ct.litHtmlPolyfillSupport;Fe==null||Fe(re,ye),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.1.3");const Mr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new ye(t.insertBefore(ct(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let q=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return K}};q._$litElement$=!0,q.finalized=!0,(Pe=globalThis.litElementHydrateSupport)==null||Pe.call(globalThis,{LitElement:q});const Be=globalThis.litElementPolyfillSupport;Be==null||Be({LitElement:q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jr={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:me},Ir=(i=jr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function ws(i){return(t,e)=>typeof e=="object"?Ir(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}function Hr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Dr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ss={};(function(i){var t=function(){var e=function(u,c,h,d){for(h=h||{},d=u.length;d--;h[u[d]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,y,m,g,zt){var E=g.length-1;switch(m){case 1:return new y.Root({},[g[E-1]]);case 2:return new y.Root({},[new y.Literal({value:""})]);case 3:this.$=new y.Concat({},[g[E-1],g[E]]);break;case 4:case 5:this.$=g[E];break;case 6:this.$=new y.Literal({value:g[E]});break;case 7:this.$=new y.Splat({name:g[E]});break;case 8:this.$=new y.Param({name:g[E]});break;case 9:this.$=new y.Optional({},[g[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(y,m){this.message=y,this.hash=m};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],y=[null],m=[],g=this.table,zt="",E=0,Se=0,Bs=2,ke=1,qs=m.slice.call(arguments,1),v=Object.create(this.lexer),T={yy:{}};for(var Vt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Vt)&&(T.yy[Vt]=this.yy[Vt]);v.setInput(c,T.yy),T.yy.lexer=v,T.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Ft=v.yylloc;m.push(Ft);var Ws=v.options&&v.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ys=function(){var z;return z=v.lex()||ke,typeof z!="number"&&(z=h.symbols_[z]||z),z},A,O,w,Bt,D={},At,S,xe,Et;;){if(O=d[d.length-1],this.defaultActions[O]?w=this.defaultActions[O]:((A===null||typeof A>"u")&&(A=Ys()),w=g[O]&&g[O][A]),typeof w>"u"||!w.length||!w[0]){var qt="";Et=[];for(At in g[O])this.terminals_[At]&&At>Bs&&Et.push("'"+this.terminals_[At]+"'");v.showPosition?qt="Parse error on line "+(E+1)+`:
`+v.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[A]||A)+"'":qt="Parse error on line "+(E+1)+": Unexpected "+(A==ke?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(qt,{text:v.match,token:this.terminals_[A]||A,line:v.yylineno,loc:Ft,expected:Et})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+O+", token: "+A);switch(w[0]){case 1:d.push(A),y.push(v.yytext),m.push(v.yylloc),d.push(w[1]),A=null,Se=v.yyleng,zt=v.yytext,E=v.yylineno,Ft=v.yylloc;break;case 2:if(S=this.productions_[w[1]][1],D.$=y[y.length-S],D._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Ws&&(D._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Bt=this.performAction.apply(D,[zt,Se,E,T.yy,w[1],y,m].concat(qs)),typeof Bt<"u")return Bt;S&&(d=d.slice(0,-1*S*2),y=y.slice(0,-1*S),m=m.slice(0,-1*S)),d.push(this.productions_[w[1]][0]),y.push(D.$),m.push(D._$),xe=g[d[d.length-2]][d[d.length-1]],d.push(xe);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===y.length?this.yylloc.first_column:0)+y[y.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,y,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),y=c[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var g in m)this[g]=m[g];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,y;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),g=0;g<m.length;g++)if(d=this._input.match(this.rules[m[g]]),d&&(!h||d[0].length>h[0].length)){if(h=d,y=g,this.options.backtrack_lexer){if(c=this.test_match(d,m[g]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[y]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,y,m){switch(y){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Dr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ss);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var ks={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},xs=Ss.parser;xs.yy=ks;var zr=xs,Vr=Object.keys(ks);function Fr(i){return Vr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ps=Fr,Br=Ps,qr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Cs(i){this.captures=i.captures,this.re=i.re}Cs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Wr=Br({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(qr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Cs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Yr=Wr,Gr=Ps,Kr=Gr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Jr=Kr,Zr=zr,Qr=Yr,Xr=Jr;vt.prototype=Object.create(null);vt.prototype.match=function(i){var t=Qr.visit(this.ast),e=t.match(i);return e||!1};vt.prototype.reverse=function(i){return Xr.visit(this.ast,i)};function vt(i){var t;if(this?t=this:t=Object.create(vt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Zr.parse(i),t}var ti=vt,ei=ti,si=ei;const ri=Hr(si);var ii=Object.defineProperty,ni=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ii(t,e,r),r};class Ot extends q{constructor(t,e){super(),this._cases=[],this._fallback=()=>Gt`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new ri(s.path)})),this._historyObserver=new _t(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),Gt`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),Gt`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ue(this,"history/redirect",{href:t})}}Ot.styles=_r`
    :host,
    main {
      display: contents;
    }
  `;ni([ws()],Ot.prototype,"_match");const oi=Object.freeze(Object.defineProperty({__proto__:null,Element:Ot,Switch:Ot},Symbol.toStringTag,{value:"Module"})),Ts=class Os extends HTMLElement{constructor(){if(super(),jt(Os.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ts.template=gt`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let ai=Ts;const li=Object.freeze(Object.defineProperty({__proto__:null,Element:ai},Symbol.toStringTag,{value:"Module"})),ci=class Rs extends HTMLElement{constructor(){super(),this._array=[],jt(Rs.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Us("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?xt(t,"input-array:add"):ee(t,"button.remove")&&xt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],hi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ci.template=gt`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function hi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Us(e)))}function Us(i,t){const e=i===void 0?"":`value="${i}"`;return gt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function X(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ui=Object.defineProperty,di=Object.getOwnPropertyDescriptor,pi=(i,t,e,s)=>{for(var r=di(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ui(t,e,r),r};class $t extends q{constructor(t){super(),this._pending=[],this._observer=new _t(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}pi([ws()],$t.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,ge=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),qe=new WeakMap;let Ns=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ge&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&qe.set(e,t))}return t}toString(){return this.cssText}};const fi=i=>new Ns(typeof i=="string"?i:i+"",void 0,_e),tt=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ns(e,i,_e)},mi=(i,t)=>{if(ge)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=St.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},We=ge?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return fi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yi,defineProperty:gi,getOwnPropertyDescriptor:_i,getOwnPropertyNames:vi,getOwnPropertySymbols:$i,getPrototypeOf:bi}=Object,P=globalThis,Ye=P.trustedTypes,Ai=Ye?Ye.emptyScript:"",Kt=P.reactiveElementPolyfillSupport,at=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?Ai:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ve=(i,t)=>!yi(i,t),Ge={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ve};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),P.litPropertyMetadata??(P.litPropertyMetadata=new WeakMap);class B extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ge){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&gi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=_i(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ge}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;const t=bi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){const e=this.properties,s=[...vi(e),...$i(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(We(r))}else t!==void 0&&e.push(We(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Rt;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ve)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[at("elementProperties")]=new Map,B[at("finalized")]=new Map,Kt==null||Kt({ReactiveElement:B}),(P.reactiveElementVersions??(P.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=globalThis,Ut=lt.trustedTypes,Ke=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ls="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Ms="?"+x,Ei=`<${Ms}>`,I=document,ut=()=>I.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",js=Array.isArray,wi=i=>js(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ze=/>/g,U=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Qe=/'/g,Xe=/"/g,Is=/^(?:script|style|textarea|title)$/i,Si=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),_=Si(1),Z=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ts=new WeakMap,L=I.createTreeWalker(I,129);function Hs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(t):t}const ki=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=rt;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=Je:f[1]!==void 0?o=Ze:f[2]!==void 0?(Is.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=r??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?U:f[3]==='"'?Xe:Qe):o===Xe||o===Qe?o=U:o===Je||o===Ze?o=rt:(o=U,r=void 0);const h=o===U&&i[l+1].startsWith("/>")?" ":"";n+=o===rt?a+Ei:u>=0?(s.push(p),a.slice(0,u)+Ls+a.slice(u)+x+h):a+x+(u===-2?l:h)}return[Hs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class pt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=ki(t,e);if(this.el=pt.createElement(p,s),L.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ls)){const c=f[o++],h=r.getAttribute(u).split(x),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Pi:d[1]==="?"?Ci:d[1]==="@"?Ti:Dt}),r.removeAttribute(u)}else u.startsWith(x)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Is.test(r.tagName)){const u=r.textContent.split(x),c=u.length-1;if(c>0){r.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ut()),L.nextNode(),a.push({type:2,index:++n});r.append(u[c],ut())}}}else if(r.nodeType===8)if(r.data===Ms)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(x,u+1))!==-1;)a.push({type:7,index:n}),u+=x.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}}function Q(i,t,e=i,s){var o,l;if(t===Z)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=dt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=Q(i,r._$AS(i,t.values),r,s)),t}class xi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);L.currentNode=r;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new bt(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Oi(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),dt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):wi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==b&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=pt.createElement(Hs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new xi(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ts.get(t.strings);return e===void 0&&ts.set(t.strings,e=new pt(t)),e}k(t){js(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new bt(this.S(ut()),this.S(ut()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Q(this,l[s+a],e,a),p===Z&&(p=this._$AH[a]),o||(o=!dt(p)||p!==this._$AH[a]),p===b?t=b:t!==b&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pi extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ci extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ti extends Dt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??b)===Z)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Oi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Zt=lt.litHtmlPolyfillSupport;Zt==null||Zt(pt,bt),(lt.litHtmlVersions??(lt.litHtmlVersions=[])).push("3.1.3");const Ri=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new bt(t.insertBefore(ut(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class C extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ri(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}}var es;C._$litElement$=!0,C.finalized=!0,(es=globalThis.litElementHydrateSupport)==null||es.call(globalThis,{LitElement:C});const Qt=globalThis.litElementPolyfillSupport;Qt==null||Qt({LitElement:C});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ui={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ve},Ni=(i=Ui,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function H(i){return(t,e)=>typeof e=="object"?Ni(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}var Li=Object.defineProperty,Ds=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Li(t,e,r),r};const Lt=class Lt extends $t{constructor(){super(...arguments),this.username="anonymous",this.authenticated=!1,this._authObserver=new _t(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),console.log("Connected"),this._authObserver.observe(({user:t})=>{if(console.log("User",t),t&&t.authenticated){this.username=t.username,this.authenticated=!0;return}this.authenticated=!1,this.username="anonymous"})}render(){return _`
      <header>
        <a id="title" href="/app">Permit Tracker</a>

        ${this.authenticated?_`
                  <a href="/app/request">New Request</a>

        <a href="/app/tracker">My Trackers</a>
        <a href="/app/login" onclick="relayEvent(event, 'auth:message', ['auth/signout'])">
                    Sign out
                </a>
       `:_`
        <a href="/app/login?next=/app/tracker">Log In</a>
       `}

       <dark-mode></dark-mode>
      </header>
    `}};Lt.uses=X({"drop-down":li.Element}),Lt.styles=tt`
    header {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 1em;

    }

    #title {
        color: var(--color-primary);
        font-size: 1.2em;
        font-weight: bold;
    }

    a {
        color: var(--text-color);
        /* remove underline */
        text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;let ft=Lt;Ds([H()],ft.prototype,"username");Ds([H()],ft.prototype,"authenticated");function Mi(i){const e=i.target.checked;ce.relay(i,"dark-mode:toggle",{checked:e})}class ji extends C{render(){return _`
        <label @change=${Mi}>
            <input type="checkbox" autocomplete="off" />
            Dark mode
        </label>`}}const Ii={};function Hi(i,t,e){switch(console.log("GETIING UPDATE"),i[0]){case"update-tracker":console.log("Updating tracker");const s=i[1].tracker;fetch(`/api/trackers/${s._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...nt.headers(e)},body:JSON.stringify(s)}).then(n=>{if(!n.ok)throw"Could not update tracker";return n.json()}).then(()=>{i[1].onSuccess()}).catch(n=>{i[1].onFailure(n)});break;case"get-user":console.log("GETTING USER"),fetch(`/api/trackers/alltrackers/${e.username}`,{headers:nt.headers(e)}).then(n=>{if(!n.ok)throw"Could not get user";return n.json()}).then(n=>{t(o=>({profile:o.profile,trackers:n}))}).catch(n=>{console.error(n)});break;case"new-tracker":console.log("NEW TRACKER",i[1]);const r=i[1].tracker;r.userId=e.username,fetch("/api/trackers/",{method:"POST",headers:{"Content-Type":"application/json",...nt.headers(e)},body:JSON.stringify(i[1].tracker)}).then(n=>{if(!n.ok)throw"Could not save tracker";return n.json()}).then(()=>{t(n=>({profile:n.profile,trackers:[...n.trackers?n.trackers:[],i[1].tracker]})),i[1].onSuccess()}).catch(n=>{console.error(n)});break;case"remove-tracker":fetch(`/api/trackers/${i[1].id}`,{method:"DELETE",headers:{"Content-Type":"application/json",...nt.headers(e)}}).then(n=>{if(!n.ok)throw"Could not delete tracker"}).then(()=>{t(n=>{var o;return{profile:n.profile,trackers:(o=n.trackers)==null?void 0:o.filter(l=>l._id!==i[1].id)}})}).catch(n=>{console.error(n)});break;default:throw"Unknown message type"}}const $e=class $e extends C{render(){return _`
        <div class="hero">
            <div class="hero_content">
                <h1>Permit Tracker</h1>
                <div>Get notified via SMS when <a href="https://recreation.gov" target="_blank">recreation.gov</a>
                    permits
                    become available</div>
                <br>
                <a class="button" href="/app/login?next=/app/tracker">Get started today</a>
            </div>

            <img class="hero_img" src="/assets/mountain.jpeg" alt="mountain" width="400px" />
        </div>
        `}};$e.styles=tt`
        .hero {
            display: flex;
            justify-content: center;
            flex-wrap:wrap;
            gap: 30px;
            margin-top: 6em;
        }
        
        .hero img {
            border-radius: 4%;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        }
        
        .hero_content {
            align-self: center;
        }

        .button {
            /* Make a green button with white text */
            background-color: var(--color-primary);
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 5px; 
        }

    `;let ie=$e;X({"restful-form":ds.FormElement});const be=class be extends C{render(){return _`
            <div>
                <h2>Login</h2>
                <restful-form new src="/auth/login">
                    <label>
                        <span>Username:</span>
                        <input name="username" autocomplete="off" />
                    </label>
                    <label>
                        <span>Password:</span>
                        <input type="password" name="password" />
                    </label>
                </restful-form>
            </div>
            
        `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Login successful",e,r),ce.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}])})}};be.styles=tt`
        label {
            margin: 5px;
        }
    `;let ne=be;const M={445859:{region_name:"Yosemite",api:"permitinyo",trailheads:{44585901:"Alder Creek",44585902:"Aspen Valley",44585903:"Base Line Camp Road",44585904:"Beehive Meadows",44585905:"Bridevail Creek",44585906:"Budd Creek (cross-country only)",44585907:"Cathedral Lakes",44585908:"Chilnualna Falls",44585909:"Cottonwood Creek",44585910:"Deer Camp",44585911:"Gaylor Creek/Lake (cross-country only)",44585912:"Glacier Point->Illilouette",44585913:"Glacier Point->Little Yosemite Valley",44585914:"Glen Aulin",44585915:"Glen Aulin->Cold Canyon/Waterwheel (pass through)",44585916:"Happy Isles->Illilouette (No Donohue Pass)",44585917:"Happy Isles->Little Yosemite Valley (No Donohue Pass)",44585918:"Happy Isles->Past LYV (Donohue Pass Eligible)",44585919:"Luken->Lukens Lake",44585920:"Lukens Lake->Yosemite Creek",44585921:"Lyell (No Donohue Pass)",44585922:"Lyell Canyon (Donohue Pass Eligible)",44585923:"Mather Ranger Station",44585924:"May Lake",44585925:"May Lake->Snow Creek",44585926:"McGurk Meadow",44585927:"Miguel Meadow",44585928:"Mirror Lake->Snow Creek",44585929:"Mono Meadow",44585930:"Mono/Parker Pass",44585931:"Murphy Creek",44585932:"Nelson Lake (cross-country only)",44585933:"Old Big Oak Flat Road",44585934:"Ostrander (Lost Bear Meadow)",44585935:"Pohono Trail (Glacier Point)",44585936:"Pohono Trail (Taft Point)",44585937:"Pohono Trail (Wawona Tunnel/Bridalveil Parking)",44585938:"Poopenaut Valley",44585939:"Porcupine Creek",44585940:"Rafferty Creek->Vogelsang",44585941:"Rancheria Falls",44585942:"Rockslides (cross-country only)",44585943:"Smith Peak",44585944:"South Fork of Tuolumne River",44585945:"Sunrise (No Donohue Pass)",44585946:"Tamarack Creek",44585947:"Ten Lakes",44585948:"Westfall Meadow",44585949:"White Wolf Campground",44585950:"White Wolf->Aspen Valley",44585951:"White Wolf->Pate Valley",44585952:"White Wolf->Smith Meadow (including Harden Lake)",44585953:"Yosemite Creek",44585954:"Yosemite Falls",44585955:"Young Lakes via Dog Lake",44585956:"Young Lakes via Glen Aulin Trail"}},4675334:{region_name:"Lassen",api:"permititinerary",trailheads:{}},445860:{region_name:"Mount Whitney",api:"permitinyo",trailheads:{}},445858:{region_name:"Sierra National Forest",api:"permitinyo",trailheads:{}}},zs=Object.keys(M).reduce((i,t)=>(Object.keys(M[t].trailheads).forEach(e=>{i[e]=M[t].trailheads[e]}),i),{});var Di=Object.defineProperty,zi=Object.getOwnPropertyDescriptor,Vs=(i,t,e,s)=>{for(var r=s>1?void 0:s?zi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Di(t,e,r),r};const Ae=class Ae extends $t{constructor(){super("blazing:model"),this.username=""}get trackers(){return this.model.trackers}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["get-user"])}_deleteTracker(t){console.log("Deleting tracker",t),this.dispatchMessage(["remove-tracker",{id:t}])}render(){var t;return _`
            <h2>Your Trackers</h2>
            <div class="card_container">${(t=this.trackers)==null?void 0:t.map(e=>_`
                    <div class="card">
                        <div class="toolbar">
                            <a href="/app/tracker/edit/${e._id}">✏️</a>
                            <button @click=${()=>this._deleteTracker(e._id)}>🗑️</button>
                        </div>
                        <h2>${zs[e.trailheadId]}</h2>
                        
                        <p>📞 ${e.phoneNumber}</p>
                        <p>👥 ${e.partySize}</p>
                        <p>📅 ${e.dates}</p>
                    </div>`)}
            <div class="card" id="new_tracker" @click=${()=>It.dispatch(this,"history/navigate",{href:"/app/request"})}>
                <h2>Create Tracker</h2>
                <h1 class="plus">+</h1>
                
            </div>
            </div>

            

            
    `}};Ae.styles=tt`
        @keyframes bounceIn {
            0% {
                transform: scale(1);
                opacity: 0;
            }
            60% {
                transform: scale(1.02);
                opacity: 1;
            }
            100% {
                transform: scale(1);
            }
        }
        .card {
            background-color: var(--color-background-card);
            padding: 10px;
            margin: 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
            width: 250px;
            animation: bounceIn 0.2s ease-out;

        }

        .card_container {
            display: flex;
            flex-wrap: wrap;
        }

        .toolbar {
            display: flex;
            justify-content: end;
            font-size: 0.8em;

        }

        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
        }

        .card#new_tracker {
            background-color: var(--color-primary);
            color: white;
            text-align: center;
            cursor: pointer;
        }

        .card#new_tracker:hover {
            /* Make the card a little darker when hovered */
            background-color: #425c4a
        }

        .plus {
            font-size: 2em;
        }
    `;let mt=Ae;Vs([H({attribute:"username",reflect:!0})],mt.prototype,"username",2);Vs([H()],mt.prototype,"trackers",1);var Vi=Object.defineProperty,Fi=Object.getOwnPropertyDescriptor,Fs=(i,t,e,s)=>{for(var r=s>1?void 0:s?Fi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Vi(t,e,r),r};X({"restful-form":ds.FormElement});const Mt=class Mt extends $t{constructor(){super("blazing:model"),this.trackerId=""}get trackers(){const t=this.model.trackers,e=t==null?void 0:t.filter(s=>s._id===this.trackerId)[0];if(e)return console.log(e),e.dates=new Date(e.dates),e}connectedCallback(){super.connectedCallback(),this.trackers||this.dispatchMessage(["get-user"])}_handleSubmit(t){console.log("SUBMITTING"),this.dispatchMessage(["update-tracker",{tracker:t.detail,onSuccess:()=>It.dispatch(this,"history/navigate",{href:"/app/tracker"}),onFailure:e=>console.log("ERROR:",e)}])}render(){return _`
      <h2>Edit Tracker</h2>
      <mu-form .init=${this.trackers} @mu-form:submit=${this._handleSubmit}>
        <label>
          <span>Phone Number</span>
          <input name="phoneNumber" />
        </label>
        <label>
          <span>Party Size</span>
          <input name="partySize" />
        </label>
        <label>
          <span>Date</span>
          <input name="dates" type="date" />
        </label>

      </mu-form>
    `}};Mt.uses=X({"mu-form":ls.Element}),Mt.styles=tt`

    form {
      display: block
    }

    span {
      margin-bottom: 5px
    }

  `;let yt=Mt;Fs([H()],yt.prototype,"trackers",1);Fs([H({attribute:"tracker",reflect:!0})],yt.prototype,"trackerId",2);const Ee=class Ee extends C{handleSearch(t){var r;const e=t.target.value.toLowerCase();((r=this.shadowRoot)==null?void 0:r.querySelectorAll(".card")).forEach(n=>{n.innerText.toLowerCase().includes(e)?n.style.display="block":n.style.display="none"})}render(){return _`
            <h1>Trailheads</h1>
            <input class="search" type="text" id="search" placeholder="Search for a trailhead" @input=${this.handleSearch}>

            ${Object.keys(M).map(t=>_`
                    <h2>${M[t].region_name}</h2>
                    <div class="cardContainer">
                        ${Object.keys(M[t].trailheads).map(e=>_`
                                <div class="card">
                                    <a href='/app/request/${e}'>
                                        ${M[t].trailheads[e]}
                                    </a>
                                </div>
                            `)}
                    </div>
                    `)}
        `}};Ee.styles=tt`
        a {
            color: var(--color-text);
            text-decoration: none;
        }

        .cardContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .card {
            background-color: var(--color-background-card);
            padding: 15px;
            border-radius: 5px;
            border-color: grey;
            border-width: 1px;
        }

        .card:hover {
            box-shadow: 0 0 10px 0 var(--color-primary);
        }

        .search {
            padding: 10px;
            border-radius: 5px;
            border-color: grey;
        }
    `;let oe=Ee;var Bi=Object.defineProperty,qi=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Bi(t,e,r),r};const we=class we extends $t{constructor(){super("blazing:model"),this.trailhead=""}_handleSubmit(t){console.log("SUBMITTING"),console.log(t.detail);const e={...t.detail,trailheadId:this.trailhead};this.dispatchMessage(["new-tracker",{tracker:e,onSuccess:()=>{It.dispatch(this,"history/navigate",{href:"/app/tracker"})}}])}render(){return _`
            <h1>${zs[this.trailhead]}</h1>
            <h2>Create a Tracker</h2>
            <mu-form @mu-form:submit=${this._handleSubmit}>
              <label>
                <span>Phone Number</span>
                <input name="phoneNumber" type="tel" />
              </label>
              <label>
                <span>Party Size</span>
                <input name="partySize" type="number" min="1" max="10" />
              </label>
              <label>
                <span>Date</span>
                <input type="date" name="dates" />
              </label>
            </mu-form>
            `}};we.uses=X({"mu-form":ls.Element});let Nt=we;qi([H({attribute:"trailhead",reflect:!0})],Nt.prototype,"trailhead");const Wi=[{path:"/app",view:()=>_`
            <main-hero></main-hero>
        `},{path:"/",redirect:"/app"},{path:"/app/login",view:()=>_`
            <main-login></main-login>
        `},{path:"/app/tracker",view:()=>_`
            <profile-view></profile-view>
        `},{path:"/app/tracker/edit/:id",view:i=>_`
            <tracker-edit tracker=${i.id}></tracker-edit>
        `},{path:"/app/request",view:()=>_`
            <trailhead-list></trailhead-list>
        `},{path:"/app/request/:id",view:i=>_`
            <trailhead-request trailhead=${i.id}></trailhead-request>
        `}];class Yi extends yr.Provider{constructor(){super(Hi,Ii,"blazing:auth")}}X({"mu-auth":nt.Provider,"blazing-header":ft,"dark-mode":ji,"mu-store":Yi,"main-hero":ie,"mu-history":It.Provider,"mu-switch":class extends oi.Element{constructor(){super(Wi,"blazing:history")}},"main-login":ne,"profile-view":mt,"tracker-edit":yt,"trailhead-list":oe,"trailhead-request":Nt});window.relayEvent=ce.relay;const Gi=document.body;Gi.addEventListener("dark-mode:toggle",i=>{console.log(i);const{checked:t}=i.detail;document.body.classList.toggle("dark-mode",t)});
