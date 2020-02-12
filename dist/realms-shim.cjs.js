'use strict';function throwTantrum(a,b=void 0){const c=`please report internal shim error: ${a}`;console.error(c),b&&(console.error(`${b}`),console.error(`${b.stack}`));debugger;throw c}function assert(a,b){a||throwTantrum(b)}function cleanupSource(a){return a}function buildChildRealm(a,b){function c(a,...b){try{return a(...b)}catch(a){if(Object(a)!==a)throw a;let b,c,d;try{b=`${a.name}`,c=`${a.message}`,d=`${a.stack||c}`}catch(a){throw new Error("unknown error")}const e=j.get(b)||Error;try{throw new e(c)}catch(a){throw a.stack=d,a}}}const{initRootRealm:d,initCompartment:e,getRealmGlobal:f,realmEvaluate:g}=b,{create:h,defineProperties:i}=Object,j=new Map([["EvalError",EvalError],["RangeError",RangeError],["ReferenceError",ReferenceError],["SyntaxError",SyntaxError],["TypeError",TypeError],["URIError",URIError]]);class k{constructor(){throw new TypeError("Realm is not a constructor")}static makeRootRealm(b={}){const e=h(k.prototype);return c(d,a,e,b),e}static makeCompartment(b={}){const d=h(k.prototype);return c(e,a,d,b),d}get global(){return c(f,this)}evaluate(a,b,d={}){return c(g,this,a,b,d)}}return i(k,{toString:{value:()=>"function Realm() { [shim code] }",writable:!1,enumerable:!1,configurable:!0}}),i(k.prototype,{toString:{value:()=>"[object Realm]",writable:!1,enumerable:!1,configurable:!0}}),k}const buildChildRealmString=cleanupSource(`'use strict'; (${buildChildRealm})`);function createRealmFacade(a,b){const{unsafeEval:c}=a;return c(buildChildRealmString)(a,b)}const{assign,create,freeze,defineProperties,getOwnPropertyDescriptor,getOwnPropertyDescriptors,getOwnPropertyNames,getPrototypeOf,setPrototypeOf}=Object,{apply,ownKeys}=Reflect,uncurryThis=a=>(b,...c)=>apply(a,b,c),objectHasOwnProperty=uncurryThis(Object.prototype.hasOwnProperty),arrayFilter=uncurryThis(Array.prototype.filter),arrayPop=uncurryThis(Array.prototype.pop),arrayJoin=uncurryThis(Array.prototype.join),arrayConcat=uncurryThis(Array.prototype.concat),regexpTest=uncurryThis(RegExp.prototype.test),stringIncludes=uncurryThis(String.prototype.includes),frozenGlobalPropertyNames=["Infinity","NaN","undefined"],stableGlobalPropertyNames=["isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","Array","ArrayBuffer","Boolean","DataView","EvalError","Float32Array","Float64Array","Int8Array","Int16Array","Int32Array","Map","Number","Object","RangeError","ReferenceError","Set","String","Symbol","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet","JSON","Math","Reflect","escape","unescape"],unstableGlobalPropertyNames=["Date","Error","Promise","Proxy","RegExp","Intl"];function getSharedGlobalDescs(a){function b(b,d,e,f){for(const g of b){const b=getOwnPropertyDescriptor(a,g);b&&(assert("value"in b,`unexpected accessor on global property: ${g}`),c[g]={value:b.value,writable:d,enumerable:e,configurable:f})}}const c={};return b(frozenGlobalPropertyNames,!1,!1,!1),b(stableGlobalPropertyNames,!1,!1,!1),b(unstableGlobalPropertyNames,!0,!1,!0),c}function repairAccessors(){function a(a){if(a===void 0||null===a)throw new TypeError(`can't convert undefined or null to object`);return Object(a)}function b(a){return"symbol"==typeof a?a:`${a}`}function c(a,b){if("function"!=typeof a)throw TypeError(`invalid ${b} usage`);return a}const{defineProperty:d,defineProperties:e,getOwnPropertyDescriptor:f,getPrototypeOf:g,prototype:h}=Object;try{(0,h.__lookupGetter__)("x")}catch(a){return}e(h,{__defineGetter__:{value:function(b,e){const f=a(this);d(f,b,{get:c(e,"getter"),enumerable:!0,configurable:!0})}},__defineSetter__:{value:function(b,e){const f=a(this);d(f,b,{set:c(e,"setter"),enumerable:!0,configurable:!0})}},__lookupGetter__:{value:function(c){let d=a(this);c=b(c);let e;for(;d&&!(e=f(d,c));)d=g(d);return e&&e.get}},__lookupSetter__:{value:function(c){let d=a(this);c=b(c);let e;for(;d&&!(e=f(d,c));)d=g(d);return e&&e.set}}})}function repairFunctions(){function a(a,e){let f;try{f=(0,eval)(e)}catch(a){if(a instanceof SyntaxError)return;throw a}const g=c(f),h=function(){throw new TypeError("Not available")};b(h,{name:{value:a}}),b(g,{constructor:{value:h}}),b(h,{prototype:{value:g}}),h!==Function.prototype.constructor&&d(h,Function.prototype.constructor)}const{defineProperties:b,getPrototypeOf:c,setPrototypeOf:d}=Object;a("Function","(function(){})"),a("GeneratorFunction","(function*(){})"),a("AsyncFunction","(async function(){})"),a("AsyncGeneratorFunction","(async function*(){})")}const unsafeGlobalSrc="'use strict'; this",unsafeGlobalEvalSrc=`(0, eval)("'use strict'; this")`;function createNewUnsafeGlobalForNode(){const a=new Function("try {return this===global}catch(e){return false}")();if(!a)return;const b=require("vm"),c=b.runInNewContext(unsafeGlobalEvalSrc);return c}function createNewUnsafeGlobalForBrowser(){if("undefined"!=typeof document){const a=document.createElement("iframe");a.style.display="none",document.body.appendChild(a);const b=a.contentWindow.eval(unsafeGlobalSrc);return b}}const getNewUnsafeGlobal=()=>{const a=createNewUnsafeGlobalForBrowser(),b=createNewUnsafeGlobalForNode();if(!a&&!b||a&&b)throw new Error("unexpected platform, unable to create Realm");return a||b};function createUnsafeRec(a,b=[]){const c=getSharedGlobalDescs(a);return freeze({unsafeGlobal:a,sharedGlobalDescs:c,unsafeEval:a.eval,unsafeFunction:a.Function,allShims:b})}const repairAccessorsShim=cleanupSource(`"use strict"; (${repairAccessors})();`),repairFunctionsShim=cleanupSource(`"use strict"; (${repairFunctions})();`);function createNewUnsafeRec(a){const b=getNewUnsafeGlobal();return b.eval(repairAccessorsShim),b.eval(repairFunctionsShim),createUnsafeRec(b,a)}function createCurrentUnsafeRec(){const a=(0,eval)(unsafeGlobalSrc);return repairAccessors(),repairFunctions(),createUnsafeRec(a)}const identifierPattern=/^[a-zA-Z_$][\w$]*$/,keywords=new Set(["await","break","case","catch","class","const","continue","debugger","default","delete","do","else","export","extends","finally","for","function","if","import","in","instanceof","new","return","super","switch","this","throw","try","typeof","var","void","while","with","yield","let","static","enum","implements","package","protected","interface","private","public","await","null","true","false","this","arguments"]);function getOptimizableGlobals(a){const b=getOwnPropertyDescriptors(a),c=arrayFilter(getOwnPropertyNames(b),a=>{if("eval"===a||keywords.has(a)||!regexpTest(identifierPattern,a))return!1;const c=b[a];return!1===c.configurable&&!1===c.writable&&objectHasOwnProperty(c,"value")});return c}const alwaysThrowHandler=new Proxy(freeze({}),{get(a,b){throwTantrum(`unexpected scope handler trap called: ${b}`)}});function createScopeHandler(a,b,c){const{unsafeGlobal:d,unsafeEval:e}=a;let f=!1;return{__proto__:alwaysThrowHandler,allowUnsafeEvaluatorOnce(){f=!0},unsafeEvaluatorAllowed(){return f},get(a,b){return"eval"===b?!0==f?(f=!1,e):a.eval:b===Symbol.unscopables?void 0:b in a?a[b]:void 0},set(a,c,d){if(objectHasOwnProperty(a,c))throw new TypeError(`do not modify endowments like ${c+""}`);return b[c]=d,!0},has(a,b){return!!c||!!("eval"===b||b in a||b in d)}}}const importPattern=/\bimport\s*(?:\(|\/[/*])/;function rejectImportExpressions(a){const b=a.search(importPattern);if(-1!==b){const c=a.slice(0,b).split("\n").length;throw new SyntaxError(`possible import expression rejected around line ${c}`)}}const someDirectEvalPattern=/\beval\s*(?:\(|\/[/*])/;function rejectSomeDirectEvalExpressions(a){const b=a.search(someDirectEvalPattern);if(-1!==b){const c=a.slice(0,b).split("\n").length;throw new SyntaxError(`possible direct eval expression rejected around line ${c}`)}}function rejectDangerousSources(a){rejectImportExpressions(a),rejectSomeDirectEvalExpressions(a)}const rejectDangerousSourcesTransform={rewrite(a){return rejectDangerousSources(a.src),a}};function buildOptimizer(a){return 0===a.length?"":`const {${arrayJoin(a,",")}} = this;`}function createScopedEvaluatorFactory(a,b){const{unsafeFunction:c}=a,d=buildOptimizer(b);return c(`
    with (arguments[0]) {
      ${d}
      return function() {
        'use strict';
        return eval(arguments[0]);
      };
    }
  `)}function createSafeEvaluatorFactory(a,b,c,d){const{unsafeFunction:e}=a,f=createScopeHandler(a,b,d),g=getOptimizableGlobals(b),h=createScopedEvaluatorFactory(a,g);return function(a={},d={}){const g=d.transforms||[],i=[...g,...(c||[]),...[rejectDangerousSourcesTransform]],j={eval(c){c=`${c}`;const d=i.reduce((a,b)=>b.rewrite?b.rewrite(a):a,{src:c,endowments:a});c=d.src;const e=create(b,getOwnPropertyDescriptors(d.endowments)),g=new Proxy(e,f),j=apply(h,b,[g]);f.allowUnsafeEvaluatorOnce();let k;try{return apply(j,b,[c])}catch(a){throw k=a,a}finally{f.unsafeEvaluatorAllowed()&&throwTantrum("handler did not revoke useUnsafeEvaluator",k)}}}.eval;return setPrototypeOf(j,e.prototype),assert(getPrototypeOf(j).constructor!==Function,"hide Function"),assert(getPrototypeOf(j).constructor!==e,"hide unsafeFunction"),defineProperties(j,{toString:{value:j("() => 'function eval' + '() { [shim code] }'"),writable:!1,enumerable:!1,configurable:!0}}),j}}function createSafeEvaluator(a){return a()}function createSafeEvaluatorWhichTakesEndowments(a){return(b,c,d={})=>a(c,d)(b)}function createFunctionEvaluator(a,b){const{unsafeFunction:c,unsafeGlobal:d}=a,e=function(...a){const e=`${arrayPop(a)||""}`;let f=`${arrayJoin(a,",")}`;if(!regexpTest(/^[\w\s,]*$/,f))throw new d.SyntaxError("shim limitation: Function arg must be simple ASCII identifiers, possibly separated by commas: no default values, pattern matches, or non-ASCII parameter names");if(new c(e),stringIncludes(f,")"))throw new d.SyntaxError("shim limitation: Function arg string contains parenthesis");0<f.length&&(f+="\n/*``*/");const g=`(function(${f}){\n${e}\n})`;return b(g)};return setPrototypeOf(e,c.prototype),assert(getPrototypeOf(e).constructor!==Function,"hide Function"),assert(getPrototypeOf(e).constructor!==c,"hide unsafeFunction"),defineProperties(e,{prototype:{value:c.prototype},toString:{value:b("() => 'function Function() { [shim code] }'"),writable:!1,enumerable:!1,configurable:!0}}),e}const RealmRecForRealmInstance=new WeakMap;function getRealmRecForRealmInstance(a){return assert(Object(a)===a,"bad object, not a Realm instance"),assert(RealmRecForRealmInstance.has(a),"Realm instance has no record"),RealmRecForRealmInstance.get(a)}function registerRealmRecForRealmInstance(a,b){assert(Object(a)===a,"bad object, not a Realm instance"),assert(!RealmRecForRealmInstance.has(a),"Realm instance already has a record"),RealmRecForRealmInstance.set(a,b)}function setDefaultBindings(a,b,c){defineProperties(a,{eval:{value:b,writable:!0,configurable:!0},Function:{value:c,writable:!0,configurable:!0}})}function createRealmRec(a,b,c){const{sharedGlobalDescs:d,unsafeGlobal:e}=a,f=create(e.Object.prototype,d),g=createSafeEvaluatorFactory(a,f,b,c),h=createSafeEvaluator(g),i=createSafeEvaluatorWhichTakesEndowments(g),j=createFunctionEvaluator(a,h);setDefaultBindings(f,h,j);const k=freeze({safeGlobal:f,safeEval:h,safeEvalWhichTakesEndowments:i,safeFunction:j});return k}function initRootRealm(a,b,c){const{shims:d,transforms:e,sloppyGlobals:f,errorHandler:g}=c,h=arrayConcat(a.allShims,d),i=createNewUnsafeRec(h),{unsafeGlobal:j}=i;j.addEventListener("error",a=>{g&&g(a)});const k=createRealmFacade(i,BaseRealm);i.sharedGlobalDescs.Realm={value:k,writable:!0,configurable:!0};const l=createRealmRec(i,e,f),{safeEvalWhichTakesEndowments:m}=l;for(const d of h)m(d);registerRealmRecForRealmInstance(b,l)}function initCompartment(a,b,c={}){const{transforms:d,sloppyGlobals:e}=c,f=createRealmRec(a,d,e);registerRealmRecForRealmInstance(b,f)}function getRealmGlobal(a){const{safeGlobal:b}=getRealmRecForRealmInstance(a);return b}function realmEvaluate(a,b,c={},d={}){const{safeEvalWhichTakesEndowments:e}=getRealmRecForRealmInstance(a);return e(b,c,d)}const BaseRealm={initRootRealm,initCompartment,getRealmGlobal,realmEvaluate},currentUnsafeRec=createCurrentUnsafeRec(),Realm=buildChildRealm(currentUnsafeRec,BaseRealm);module.exports=Realm;
//# sourceMappingURL=realms-shim.cjs.js.map
