/* Run with: node tests/runtime-regressions.cjs (Node 18+; no dependencies).
   Browser APIs are simulated. This does not replace visual/browser QA. */
async function runRegressions(readSource, execute) {
  const results = [];
  function assert(value, message) { if (!value) throw new Error(message); }
  async function test(name, fn) {
    try { await fn(); results.push({name, passed:true}); }
    catch (error) { results.push({name, passed:false, error:error.message}); }
  }
  function events(object = {}) {
    const listeners = {};
    object.addEventListener = (type, fn, options) => {
      (listeners[type] ||= []).push({fn, once:!!(options && options.once)});
    };
    object.removeEventListener = (type, fn) => {
      listeners[type] = (listeners[type] || []).filter(item => item.fn !== fn);
    };
    object.dispatchEvent = event => {
      event.target ||= object;
      for (const item of [...(listeners[event.type] || [])]) {
        if (item.once) object.removeEventListener(event.type, item.fn);
        item.fn(event);
      }
      return !event.defaultPrevented;
    };
    object.emit = (type, data = {}) => object.dispatchEvent({
      type, defaultPrevented:false, preventDefault(){this.defaultPrevented=true;}, stopPropagation(){},
      ...data
    });
    return object;
  }
  function element() {
    const classes = new Set(), attributes = {};
    const el = events({style:{}, dataset:{}, value:'', textContent:'', innerHTML:'',
      querySelector(){return null;}, querySelectorAll(){return [];},
      contains(node){return node === this;}, closest(){return null;},
      reportValidity(){return true;}, getAttribute(key){return attributes[key] ?? null;},
      hasAttribute(key){return key in attributes;},
      setAttribute(key,value){attributes[key]=String(value);},
      removeAttribute(key){delete attributes[key];},
      toggleAttribute(key,on){if(on)attributes[key]='';else delete attributes[key];},
      classList:{add(...names){names.forEach(n=>classes.add(n));},
        remove(...names){names.forEach(n=>classes.delete(n));},
        contains(name){return classes.has(name);},
        toggle(name,on){if(on === undefined)on=!classes.has(name);
          if(on)classes.add(name);else classes.delete(name);return on;}},
      focus(){if(el.ownerDocument)el.ownerDocument.activeElement=el;}
    });
    el.style.setProperty = (key,value) => {el.style[key]=value;};
    el.style.removeProperty = key => {delete el.style[key];};
    return el;
  }
  function environment({reduced=false, blockedStorage=false} = {}) {
    let id=0;
    const timers = new Map(), frames = new Map(), storage = new Map();
    const document=events({readyState:'loading', documentElement:element(), body:element(),
      activeElement:element(), title:'', querySelector(){return null;},
      querySelectorAll(){return [];}, getElementById(){return null;}});
    document.documentElement.lang='en'; document.body.dataset.page='home';
    const window=events({innerWidth:390, innerHeight:800, scrollY:240,
      matchMedia(){return {matches:reduced};},
      scrollTo(x,y){window.scrollY=y;}, location:{pathname:'/index.html',hash:'',href:''}});
    const localStorage={
      getItem(key){if(blockedStorage)throw Error('storage blocked');return storage.get(key)||null;},
      setItem(key,value){if(blockedStorage)throw Error('storage blocked');storage.set(key,value);},
      removeItem(key){if(blockedStorage)throw Error('storage blocked');storage.delete(key);}
    };
    const session = new Map();
    const sessionStorage={getItem:k=>session.get(k)||null,
      setItem:(k,v)=>session.set(k,v), removeItem:k=>session.delete(k)};
    const globals={window,document,location:window.location,localStorage,sessionStorage,
      innerWidth:390,innerHeight:800,performance:{now:()=>0},
      matchMedia:window.matchMedia,
      addEventListener:window.addEventListener,
      setTimeout(fn){const next=++id;timers.set(next,fn);return next;},
      clearTimeout(next){timers.delete(next);},
      requestAnimationFrame(fn){const next=++id;frames.set(next,fn);return next;},
      cancelAnimationFrame(next){frames.delete(next);},
      Event:class {constructor(type,options){this.type=type;Object.assign(this,options);}},
      CustomEvent:class {constructor(type,options){this.type=type;Object.assign(this,options);}},
      FormData:class {constructor(form){this.form=form;}},
      fetch(){throw Error('Unexpected network request');}
    };
    window.requestAnimationFrame=globals.requestAnimationFrame;
    function flushFrames(){const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(16));}
    function flushTimers(){const batch=[...timers.values()];timers.clear();batch.forEach(fn=>fn());}
    return {globals, document,window,timers,frames,storage,session,flushFrames,flushTimers};
  }
  function startSite(env) {
    execute(readSource('assets/js/site-v1.js'),env.globals);
    env.document.emit('DOMContentLoaded');
  }
  function formEnvironment(options) {
    const env=environment(options),shell=element(),form=element(),button=element();
    const continueBtn=element(),status=element(),textarea=element(),expand=element(),received=element();
    const fields={property:element(),message:textarea,name:element(),email:element()};
    fields.property.value='https://example.com';textarea.scrollHeight=120;
    for(const el of [shell,form,button,continueBtn,status,textarea,expand,received,...Object.values(fields)])
      el.ownerDocument=env.document;
    const mapping={'form':form,'.dear-continue':continueBtn,'.dear-status':status,
      '.dear-textarea':textarea,'.dear-expand':expand,'.dear-received':received,
      '[name="property_link"]':fields.property,'[name="message"]':fields.message,
      '[name="name"]':fields.name,'[name="email"]':fields.email};
    shell.querySelector=s=>mapping[s]||null;
    form.querySelector=s=>s==='.dear-send'?button:null;
    form.action='https://formspree.io/f/xgojyjpq';
    env.document.querySelector=s=>s==='.dear-letter-shell'?shell:null;
    let calls=0,resolve,reject;
    env.globals.fetch=()=>{calls++;return new Promise((a,b)=>{resolve=a;reject=b;});};
    return Object.assign(env,{shell,form,button,continueBtn,status,textarea,expand,received,fields,
      calls:()=>calls, respond:ok=>resolve({ok}), reject:()=>reject(Error('offline'))});
  }
  async function settle(){for(let i=0;i<8;i++)await Promise.resolve();}

  await test('URL editing never uses unsupported URL caret APIs',()=>{
    const env=environment(),input=element();
    input.setSelectionRange=()=>{throw Error('InvalidStateError: URL input');};
    Object.defineProperty(input,'selectionStart',{get(){return null;}});
    env.document.querySelector=s=>s==='#property-url'?input:null;
    execute(readSource('assets/js/190926.js'),env.globals);
    env.document.emit('DOMContentLoaded');input.value='http://example.com';
    input.emit('focus');env.flushFrames();input.emit('click');
    assert(input.value==='http://example.com','Explicit HTTP URL was rewritten');
  });
  await test('Bare domain normalizes on blur and updates the draft listener',()=>{
    const env=environment(),input=element();let inputEvents=0;
    input.addEventListener('input',()=>inputEvents++);
    env.document.querySelector=s=>s==='#property-url'?input:null;
    execute(readSource('assets/js/190926.js'),env.globals);
    env.document.emit('DOMContentLoaded');input.value=' example.com ';input.emit('blur');
    assert(input.value==='https://example.com','Domain not normalized');
    assert(inputEvents===1,'Draft listener did not receive normalization');
    input.value='';input.emit('blur');assert(input.value==='','Empty input changed');
  });
  await test('Language toggle works both directions with blocked localStorage',()=>{
    const env=environment({blockedStorage:true}),btn=element();
    env.document.querySelectorAll=s=>s==='.lang-toggle'?[btn]:[];
    startSite(env);btn.emit('click');assert(env.document.documentElement.lang==='es','First switch failed');
    btn.emit('click');assert(env.document.documentElement.lang==='en','Second switch failed');
  });
  await test('Continue validates the property before expanding',()=>{
    const env=formEnvironment();env.fields.property.reportValidity=()=>false;
    startSite(env);env.continueBtn.emit('click');
    assert(!env.shell.classList.contains('is-expanded'),'Invalid property expanded');
  });
  await test('Enter in the first form step expands without sending',()=>{
    const env=formEnvironment();startSite(env);env.form.emit('submit');
    assert(env.form.noValidate===true,'Hidden fields still undergo automatic native validation');
    assert(env.shell.classList.contains('is-expanded'),'First step did not expand');
    assert(env.calls()===0,'Premature request');
    assert(!env.expand.hasAttribute('inert'),'Expanded fields remain inert');
  });
  await test('Expanded invalid form never sends',()=>{
    const env=formEnvironment();startSite(env);env.continueBtn.emit('click');
    env.form.reportValidity=()=>false;env.form.emit('submit');
    assert(env.calls()===0,'Invalid form sent');
  });
  await test('Form prevents duplicate sends, clears draft on success, and focuses receipt',async()=>{
    const env=formEnvironment();startSite(env);env.continueBtn.emit('click');
    env.fields.name.value='Guest';env.fields.name.emit('input');
    env.form.emit('submit');env.form.emit('submit');
    assert(env.calls()===1,'Duplicate request');
    env.respond(true);await settle();
    assert(env.shell.classList.contains('is-sent'),'Success not shown');
    assert(!env.session.has('exif-dear-draft'),'Sent draft retained');
    assert(env.document.activeElement===env.received,'Focus lost after form hides');
    env.form.emit('submit');assert(env.calls()===1,'Sent form resubmitted');
  });
  await test('Sending and error text follow language changes; failure keeps draft',async()=>{
    const env=formEnvironment();startSite(env);env.continueBtn.emit('click');
    env.fields.message.value='Test letter';env.fields.message.emit('input');
    env.form.emit('submit');env.window.exifApplyLanguage('es');
    assert(env.button.textContent==='ENVIANDO…','Sending state overwritten by translation');
    env.respond(false);await settle();
    assert(env.button.textContent==='ENVIAR CARTA','Button restored in wrong language');
    assert(env.status.textContent.startsWith('No pudimos'),'Error not translated');
    assert(env.session.has('exif-dear-draft'),'Failed draft discarded');
    env.window.exifApplyLanguage('en');
    assert(env.status.textContent.startsWith('We could not'),'Existing error not translated');
    assert(!env.button.disabled,'Retry button disabled');
  });
  await test('Back-forward cache clears the outgoing page cover',()=>{
    const env=environment();startSite(env);
    env.document.documentElement.classList.add('exif-transition-out');
    env.window.emit('pageshow',{persisted:true});
    assert(!env.document.documentElement.classList.contains('exif-transition-out'),'Cover remains over restored page');
  });
  await test('Drawer reset restores mobile scroll, clears pending close, and hides closed links',()=>{
    const env=environment(),nav=element(),toggle=element();
    env.document.querySelector=s=>s==='.exif-drawer, .main-nav'?nav:s==='.nav-toggle'?toggle:null;
    startSite(env);
    assert(nav.hasAttribute('inert'),'Closed navigation remains interactive');
    assert(toggle.getAttribute('aria-controls')==='exif-navigation','Toggle has no controlled drawer');
    toggle.emit('click');assert(!nav.hasAttribute('inert'),'Open navigation inert');
    assert(env.document.body.style.position==='fixed','Mobile scroll not locked');
    env.window.scrollY=0;env.window.exifCloseNav();
    env.window.exifResetNav();
    assert(env.window.scrollY===240,'Original mobile scroll not restored');
    assert(env.document.body.style.position==='','Mobile body remained fixed');
    assert(nav.hasAttribute('inert'),'Closed drawer not inert');
    assert(nav.getAttribute('aria-hidden')==='true','Closed drawer exposed');
    assert(env.timers.size===0,'Pending drawer close timer retained');
  });

  await test('Existing draft restores all fields and opens the letter',()=>{
    const env=formEnvironment();
    const draft={property:'http://example.com',message:'A saved letter',name:'Guest',email:'guest@example.com'};
    env.session.set('exif-dear-draft',JSON.stringify(draft));startSite(env);
    for(const key of Object.keys(draft))assert(env.fields[key].value===draft[key],'Draft field changed: '+key);
    assert(env.shell.classList.contains('is-expanded'),'Draft did not expand');
    assert(!env.expand.hasAttribute('inert'),'Draft fields inaccessible');
  });
  await test('Normal language toggle persists the selection',()=>{
    const env=environment(),btn=element();
    env.document.querySelectorAll=s=>s==='.lang-toggle'?[btn]:[];
    startSite(env);btn.emit('click');
    assert(env.storage.get('exif-language')==='es','Language not saved');
    assert(env.document.documentElement.lang==='es','Document language not updated');
    btn.emit('click');assert(env.storage.get('exif-language')==='en','Return language not saved');
  });
  await test('Network failure leaves the form available for retry',async()=>{
    const env=formEnvironment();startSite(env);env.continueBtn.emit('click');
    env.form.emit('submit');env.reject();await settle();
    assert(!env.shell.classList.contains('is-sent'),'Failed request displayed success');
    assert(!env.button.disabled,'Cannot retry');
    env.form.emit('submit');assert(env.calls()===2,'Retry request missing');
    env.respond(true);await settle();assert(env.shell.classList.contains('is-sent'),'Retry did not succeed');
  });

  await test('Gallery renders 39 WebP items with lazy loading and no high priority',()=>{
    const env=environment(),mount=element();
    env.document.querySelector=s=>s==='#selected-work'?mount:null;
    execute(readSource('assets/js/190926.js'),env.globals);env.document.emit('DOMContentLoaded');
    const images=[...mount.outerHTML.matchAll(/<img[^>]+>/g)];
    assert(images.length===39,'Gallery item count changed');
    assert(images.every(m=>/loading="lazy"/.test(m[0])),'Gallery eagerly loads offscreen photos');
    assert(images.every(m=>!/fetchpriority="high"/.test(m[0])),'Gallery competes with hero');
    assert(images.every(m=>/exif-gallery-[^"]+\.webp"/.test(m[0])),'Gallery format changed');
  });
  await test('Desktop intro finishes without Web Animations API',()=>{
    const env=environment(),hero=element(),wrap=element(),bg=element(),copy=element(),stage=element();
    env.window.innerWidth=1024;env.window.scrollY=0;hero.offsetHeight=800;
    bg.getBoundingClientRect=()=>({left:300,top:80,width:450,height:600});
    stage.getBoundingClientRect=()=>({left:400,top:300,width:220,height:150});
    stage.appendChild=()=>{};wrap.insertAdjacentHTML=()=>{};
    hero.querySelector=s=>({'.wrap':wrap,'.exif-hero-bg':bg,'.exif-hero-copy':copy}[s]||null);
    env.document.querySelector=s=>s==='#what-exif-does'?hero:null;
    const created=[];
    env.document.createElement=tag=>{
      const el=element();el.naturalWidth=1536;el.naturalHeight=1024;
      el.querySelector=s=>s==='.exif-loader-stage'?stage:null;
      el.appendChild=()=>{};el.remove=()=>{el.removed=true;};
      created.push(el);return el;
    };
    env.document.body.appendChild=()=>{};
    execute(readSource('assets/js/180902.js'),env.globals);env.document.emit('DOMContentLoaded');
    for(let i=0;i<16;i++){env.flushTimers();env.flushFrames();}
    assert(!env.document.body.classList.contains('exif-intro-running'),'Intro still locks the page');
    assert(env.document.body.classList.contains('exif-header-ready'),'Header never enabled');
    assert(copy.classList.contains('is-visible'),'Hero title never shown');
    assert(created.filter(el=>el.className==='exif-loader').every(el=>el.removed),'Loader not removed');
  });

  function galleryEnvironment() {
    const env=environment({reduced:true}),chapter=element(),section=element(),viewport=element(),track=element(),controls=element();
    chapter.getBoundingClientRect=()=>({top:100,height:700});
    viewport.clientWidth=500;
    track.children=Array.from({length:6},(_,i)=>({getBoundingClientRect:()=>({left:i*100})}));
    track.querySelectorAll=()=>[];
    track.querySelector=()=>null;
    chapter.querySelector=s=>({'.motion-gallery':section,'.motion-gallery-controls':controls}[s]||null);
    section.querySelector=s=>s==='.motion-gallery-viewport'?viewport:s==='.motion-gallery-track'?track:null;
    env.document.querySelector=s=>s==='.gallery-chapter'?chapter:null;
    execute(readSource('assets/js/motion-gallery.js'),env.globals);env.document.emit('DOMContentLoaded');
    env.flushFrames();
    return {...env,chapter,section,viewport,track,controls};
  }
  await test('Reduced-motion gallery arrows move immediately and animation queue settles',()=>{
    const env=galleryEnvironment(),before=env.track.style.transform,b=element();
    b.dataset.galleryStep='next';b.closest=()=>b;env.controls.emit('click',{target:b});
    assert(env.track.style.transform!==before,'Arrow does nothing under reduced motion');
    env.flushFrames();assert(env.frames.size===0,'Idle gallery loops indefinitely');
  });
  await test('Reduced-motion gallery wheel moves immediately',()=>{
    const env=galleryEnvironment(),before=env.track.style.transform;
    env.viewport.emit('wheel',{deltaX:31,deltaY:0,cancelable:true});
    assert(env.track.style.transform!==before,'Wheel does nothing under reduced motion');
  });
  await test('Reduced-motion gallery horizontal drag moves immediately',()=>{
    const env=galleryEnvironment(); // Touch fallback, also supported without PointerEvent.
    const before=env.track.style.transform;
    env.viewport.emit('touchstart',{touches:[{identifier:1,clientX:100,clientY:100}]});
    env.viewport.emit('touchmove',{touches:[{identifier:1,clientX:70,clientY:101}],cancelable:true});
    assert(env.track.style.transform!==before,'Drag does nothing under reduced motion');
  });
  return results;
}
module.exports = runRegressions;
if (require.main === module) {
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
  const root=path.resolve(__dirname,'..');
  runRegressions(p=>fs.readFileSync(path.join(root,p),'utf8'),
    (source,globals)=>vm.runInNewContext(source,globals))
    .then(results=>{
      for(const result of results)console.log((result.passed?'PASS ':'FAIL ')+result.name+(result.error?' — '+result.error:''));
      if(results.some(result=>!result.passed))process.exitCode=1;
    }).catch(error=>{console.error(error);process.exitCode=1;});
}
