// EXIF V1 — global navigation, bilingual copy, correspondence and page transitions.
(function(){
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var returning=false;
  try{returning=sessionStorage.getItem('exif-intro-seen')==='1';sessionStorage.setItem('exif-intro-seen','1');}catch(e){}
  if(returning)document.body.classList.add('exif-returning');
  var language='en';
  try{language=localStorage.getItem('exif-language')==='es'?'es':'en';}catch(e){}
  function getLang(){return language;}
  function saveLang(lang){language=lang==='es'?'es':'en';try{localStorage.setItem('exif-language',language);}catch(e){}}
  function replaceCopy(lang){if(lang!=='es')lang='en';language=lang;document.documentElement.lang=lang;document.querySelectorAll('[data-en][data-es]').forEach(function(el){el.textContent=lang==='es'?el.dataset.es:el.dataset.en;});document.querySelectorAll('[data-placeholder-en][data-placeholder-es]').forEach(function(el){el.placeholder=lang==='es'?el.dataset.placeholderEs:el.dataset.placeholderEn;});document.querySelectorAll('[data-aria-en][data-aria-es]').forEach(function(el){el.setAttribute('aria-label',lang==='es'?el.dataset.ariaEs:el.dataset.ariaEn);});document.querySelectorAll('[data-alt-en][data-alt-es]').forEach(function(el){el.alt=lang==='es'?el.dataset.altEs:el.dataset.altEn;});document.querySelectorAll('.lang-toggle').forEach(function(btn){btn.dataset.lang=lang;btn.textContent=lang==='en'?'ES':'EN';btn.setAttribute('aria-label',lang==='en'?'Cambiar a español':'Switch to English');btn.setAttribute('aria-pressed',lang==='es'?'true':'false');});document.querySelectorAll('.v1-nav-label').forEach(function(el){el.dataset.normal=(lang==='es'?el.dataset.normalEs:el.dataset.normalEn)||el.dataset.normal;el.textContent=el.dataset.normal||el.textContent;el.classList.remove('is-hover-copy','is-swapping');});var page=document.body.dataset.page||'home';if(page==='home'){document.title=lang==='es'?'EXIF Studio — Dirección visual para hospitalidad independiente':'EXIF Studio — Visual Direction for Independent Hospitality';setMeta('description',lang==='es'?'Dirección visual para hoteles, villas y propiedades independientes. EXIF identifica qué distingue a un lugar y lo hace reconocible antes de llegar.':'Visual direction for independent hotels, villas and hospitality properties. EXIF identifies what makes a place distinct and helps make it recognizable before arrival.');setPropertyMeta('og:title',lang==='es'?'EXIF — Un lugar, inconfundible.':'EXIF — A place, made unmistakable.');setPropertyMeta('og:description',lang==='es'?'Dirección visual para hacer visible lo que distingue a una propiedad antes de llegar.':'Visual direction for independent hospitality. Making visible what distinguishes a place before arrival.');}else if(page==='studio'){document.title='Studio — EXIF';setMeta('description',lang==='es'?'EXIF es un estudio independiente de dirección visual para hospitalidad, fundado por Katia Pérez y con base en México.':'EXIF is an independent visual direction studio for hospitality, founded by Katia Pérez and based in Mexico.');setPropertyMeta('og:title',lang==='es'?'Una carta de nuestra fundadora — EXIF':'A letter from our founder — EXIF');}window.dispatchEvent(new CustomEvent('exif:languagechange',{detail:{lang:lang}}));}
  function setMeta(name,value){var m=document.querySelector('meta[name="'+name+'"]');if(m)m.content=value;}function setPropertyMeta(name,value){var m=document.querySelector('meta[property="'+name+'"]');if(m)m.content=value;}
  function getNav(){return document.querySelector('.exif-drawer, .main-nav');}
  function buildNav(){
    var nav=getNav();if(!nav)return null;
    var routes=[
      ['/', 'home', 'HOME', 'INICIO', 'A PLACE, MADE UNMISTAKABLE.', 'UN LUGAR, INCONFUNDIBLE.'],
      ['/expertise', 'expertise', 'WHAT WE DO', 'QUÉ HACEMOS', 'RESEARCH. DIRECTION. CREATIVE WORK.', 'INVESTIGACIÓN. DIRECCIÓN. CREACIÓN.'],
      ['/approach', 'approach', 'APPROACH', 'CÓMO TRABAJAMOS', 'HOW A DECISION TAKES SHAPE.', 'CÓMO TOMA FORMA UNA DECISIÓN.'],
      ['/studio', 'studio', 'STUDIO', 'ESTUDIO', 'INSIDE THE STUDIO.', 'DENTRO DEL ESTUDIO.']
    ];
    var numbers=['i.','ii.','iii.','iv.'];
    nav.innerHTML='<div class="v1-nav-inner"><div class="v1-nav-primary">'+routes.map(function(r,i){return '<a class="v1-nav-link" href="'+r[0]+'" data-transition data-route="'+r[1]+'" data-placement="drawer" aria-label="'+(getLang()==='es'?r[3]:r[2])+'" data-aria-en="'+r[2]+'" data-aria-es="'+r[3]+'"'+(document.body.dataset.page===r[1]?' aria-current="page"':'')+'><span class="v1-nav-num" aria-hidden="true">'+numbers[i]+'</span><span class="v1-nav-label" data-normal-en="'+r[2]+'" data-normal-es="'+r[3]+'" data-normal="'+(getLang()==='es'?r[3]:r[2])+'" data-hover-en="'+r[4]+'" data-hover-es="'+r[5]+'">'+(getLang()==='es'?r[3]:r[2])+'</span></a>';}).join('')+'</div><div class="v1-nav-side"><a class="v2-nav-inquire" href="/inquire" data-transition data-primary-cta data-placement="drawer"><strong data-en="Discuss Your Property →" data-es="Hablemos de tu propiedad →">Discuss Your Property →</strong><small data-en="A complimentary 30-minute discovery conversation." data-es="Una conversación inicial gratuita de 30 minutos.">A complimentary 30-minute discovery conversation.</small></a><a class="v1-nav-dear" href="/#dear-exif" data-dear-route><strong>DEAR EXIF,</strong><small><span data-en="WRITE TO US." data-es="ESCRÍBENOS.">WRITE TO US.</span><span>→</span></small></a></div><div class="v1-nav-meta"><div class="v1-nav-social"><a href="https://instagram.com/byexifstudio" target="_blank" rel="noopener">INSTAGRAM</a><a href="https://linkedin.com/company/exif-studio" target="_blank" rel="noopener">LINKEDIN</a></div><div class="v1-nav-place"><span data-en="BASED IN MEXICO / WORKING WHERE THE PLACE TAKES US." data-es="CON BASE EN MÉXICO / TRABAJANDO DONDE EL LUGAR NOS LLEVE.">BASED IN MEXICO / WORKING WHERE THE PLACE TAKES US.</span></div></div></div>';return nav;
  }
  function initNavHover(nav){if(!nav)return;var primary=nav.querySelector('.v1-nav-primary');if(!primary||primary.dataset.hoverBound==='1')return;primary.dataset.hoverBound='1';var links=Array.from(primary.querySelectorAll('.v1-nav-link'));var active=null,target=null,swapTimer=0,leaveTimer=0;function labelOf(link){return link&&link.querySelector('.v1-nav-label');}function clearAllBlur(){links.forEach(function(link){var label=labelOf(link);if(label)label.classList.remove('is-swapping');});}function setCopy(link,on){var label=labelOf(link);if(!label)return;var lang=getLang();label.textContent=on?(lang==='es'?label.dataset.hoverEs:label.dataset.hoverEn):label.dataset.normal;label.classList.toggle('is-hover-copy',on);}function resetAll(){clearTimeout(swapTimer);clearTimeout(leaveTimer);target=null;links.forEach(function(link){setCopy(link,false);});active=null;clearAllBlur();}function transitionTo(next){clearTimeout(swapTimer);clearAllBlur();target=next;if(active===next){if(next)setCopy(next,true);return;}var previous=active;if(previous){var oldLabel=labelOf(previous);if(oldLabel)oldLabel.classList.add('is-swapping');}else if(next){var newLabel=labelOf(next);if(newLabel)newLabel.classList.add('is-swapping');}swapTimer=setTimeout(function(){if(target!==next)return;clearAllBlur();if(previous&&previous!==next)setCopy(previous,false);if(next)setCopy(next,true);active=next;clearAllBlur();},190);}function targetFromPointer(e){if(!links.length)return null;for(var i=0;i<links.length;i++){var rect=links[i].getBoundingClientRect();if(e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom)return links[i];}return null;}function handlePointer(e){if(e.pointerType==='touch')return;clearTimeout(leaveTimer);var next=targetFromPointer(e);if(next!==target)transitionTo(next);}function scheduleNone(e){if(e&&e.pointerType==='touch')return;clearTimeout(leaveTimer);leaveTimer=setTimeout(function(){clearTimeout(swapTimer);target=null;clearAllBlur();var previous=active;if(!previous){resetAll();return;}var label=labelOf(previous);if(label)label.classList.add('is-swapping');swapTimer=setTimeout(function(){if(target!==null)return;links.forEach(function(link){setCopy(link,false);});active=null;clearAllBlur();},190);},170);}window.addEventListener('exif:languagechange',resetAll);primary.addEventListener('pointerenter',handlePointer);primary.addEventListener('pointermove',handlePointer);primary.addEventListener('pointerleave',scheduleNone);links.forEach(function(link){link.addEventListener('focusin',function(){clearTimeout(leaveTimer);transitionTo(link);});link.addEventListener('focusout',function(e){if(!primary.contains(e.relatedTarget))scheduleNone();});});}
  function initNav(nav){var toggle=document.querySelector('.nav-toggle');nav=nav||getNav();if(!toggle||!nav)return;initNavHover(nav);document.addEventListener('exif:drawer-mounted',function(e){var mounted=e.detail&&e.detail.drawer;if(mounted)initNavHover(mounted);},{once:true});var lockedY=0,mobileBodyLock=false,closing=false,closeTimer=0,closeDone=null;
    nav.id='exif-navigation';nav.setAttribute('inert','');nav.setAttribute('aria-hidden','true');toggle.setAttribute('aria-controls',nav.id);
    var backgroundState=[],lastWidth=window.innerWidth;
    function isolateBackground(on){
      if(on){backgroundState=[];document.querySelectorAll('main, footer').forEach(function(el){backgroundState.push([el,el.hasAttribute('inert')]);el.setAttribute('inert','');});}
      else{backgroundState.forEach(function(entry){if(!entry[1])entry[0].removeAttribute('inert');});backgroundState=[];}
    }
    function controlCopy(){var es=getLang()==='es',on=document.body.classList.contains('nav-open')&&!closing;toggle.setAttribute('aria-label',on?(es?'Cerrar menú':'Close menu'):(es?'Abrir menú':'Open menu'));var proxy=document.querySelector('.exif-close-proxy');if(proxy)proxy.setAttribute('aria-label',es?'Cerrar menú':'Close menu');}
    window.addEventListener('exif:languagechange',controlCopy);
    document.addEventListener('keydown',function(e){
      if(e.key!=='Tab'||!document.body.classList.contains('nav-open')||closing)return;
      var controls=Array.from(nav.querySelectorAll('a[href], button:not([disabled])'));
      var langButton=document.querySelector('.site-header .lang-toggle');if(langButton)controls.push(langButton);
      var closeButton=document.querySelector('.exif-close-proxy')||toggle;controls.push(closeButton);
      controls=controls.filter(function(el){return !el.hasAttribute('inert')&&(typeof getComputedStyle!=='function'||(getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'));});
      if(!controls.length)return;
      var index=controls.indexOf(document.activeElement);
      if(index===-1||(!e.shiftKey&&index===controls.length-1)||(e.shiftKey&&index===0)){e.preventDefault();controls[e.shiftKey?controls.length-1:0].focus({preventScroll:true});}
    });
    window.addEventListener('resize',function(){var next=window.innerWidth;if((lastWidth<860)!==(next<860)&&document.body.classList.contains('nav-open'))window.exifResetNav();lastWidth=next;},{passive:true});
    function cancelClose(){clearTimeout(closeTimer);if(closeDone)nav.removeEventListener('transitionend',closeDone);closeDone=null;}function lock(){lockedY=window.scrollY||window.pageYOffset||0;document.documentElement.style.scrollBehavior='auto';document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';document.body.style.overscrollBehavior='none';mobileBodyLock=window.innerWidth<860;if(mobileBodyLock){document.body.style.position='fixed';document.body.style.top='-'+lockedY+'px';document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';}}function unlock(){document.documentElement.style.overflow='';document.body.style.overflow='';document.body.style.overscrollBehavior='';if(mobileBodyLock){document.body.style.position='';document.body.style.top='';document.body.style.left='';document.body.style.right='';document.body.style.width='';window.scrollTo(0,lockedY);mobileBodyLock=false;}requestAnimationFrame(function(){document.documentElement.style.scrollBehavior='';});}function open(){var alreadyLocked=document.body.classList.contains('nav-open');if(closing){cancelClose();closing=false;document.body.classList.remove('nav-closing');}if(!alreadyLocked){lock();isolateBackground(true);}nav.removeAttribute('inert');nav.setAttribute('aria-hidden','false');document.body.classList.add('nav-open');nav.classList.add('open');toggle.setAttribute('aria-expanded','true');controlCopy();nav.setAttribute('tabindex','-1');nav.focus({preventScroll:true});}function finishClose(){if(!closing)return;closing=false;document.body.classList.remove('nav-closing','nav-open');toggle.setAttribute('aria-expanded','false');if(nav.contains(document.activeElement)||document.activeElement.classList.contains('exif-close-proxy'))toggle.focus({preventScroll:true});nav.setAttribute('inert','');nav.setAttribute('aria-hidden','true');isolateBackground(false);controlCopy();unlock();requestAnimationFrame(function(){window.dispatchEvent(new Event('scroll'));});}function close(){if(!document.body.classList.contains('nav-open')||closing)return;closing=true;nav.setAttribute('inert','');nav.setAttribute('aria-hidden','true');toggle.focus({preventScroll:true});controlCopy();document.body.classList.add('nav-closing');nav.classList.remove('open');var done=function(e){if(e&&e.target!==nav)return;if(e&&e.propertyName!=='transform')return;nav.removeEventListener('transitionend',done);clearTimeout(closeTimer);finishClose();};closeDone=done;nav.addEventListener('transitionend',done);closeTimer=setTimeout(function(){nav.removeEventListener('transitionend',done);finishClose();},reduced?20:720);}toggle.setAttribute('aria-expanded','false');toggle.addEventListener('click',function(){document.body.classList.contains('nav-open')?close():open();});document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});nav.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;if(a.hasAttribute('data-dear-route')&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();close();setTimeout(goDear,reduced?25:680);}});window.exifCloseNav=close;window.exifResetNav=function(){cancelClose();closing=true;finishClose();};}
  function goDear(){var home=location.pathname==='/'||location.pathname.endsWith('/index.html');if(home){var t=document.querySelector('#dear-exif');if(t)t.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});setTimeout(function(){var input=document.querySelector('#property-url');if(input)input.focus({preventScroll:true});},reduced?0:700);return;}var source=window.exifMeasurement?('?exif_source='+window.exifMeasurement.source()):'';transitionTo('/'+source+'#dear-exif');}
  function transitionTo(href){if(!href)return;try{sessionStorage.setItem('exif-transition','1');}catch(e){}if(reduced){location.href=href;return;}document.documentElement.classList.add('exif-transition-out');setTimeout(function(){location.href=href;},500);}
  function initTransitions(){window.addEventListener('pageshow',function(e){if(!e.persisted)return;document.documentElement.classList.remove('exif-transition-out','exif-transition-arrival','exif-transition-reveal');try{sessionStorage.removeItem('exif-transition');}catch(e){}if(window.exifResetNav)window.exifResetNav();});document.addEventListener('click',function(e){var a=e.target.closest('a[data-transition]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;var href=a.getAttribute('href');if(!href||href.charAt(0)==='#')return;e.preventDefault();if(window.exifCloseNav)window.exifCloseNav();transitionTo(href);});var arrival=false;try{arrival=sessionStorage.getItem('exif-transition')==='1';if(arrival)sessionStorage.removeItem('exif-transition');}catch(e){}if(arrival||document.documentElement.classList.contains('exif-transition-arrival')){requestAnimationFrame(function(){document.documentElement.classList.add('exif-transition-reveal');document.documentElement.classList.remove('exif-transition-arrival');setTimeout(function(){document.documentElement.classList.remove('exif-transition-reveal');},650);});}if(location.hash==='#dear-exif'){setTimeout(function(){var t=document.querySelector('#dear-exif');if(t)t.scrollIntoView({behavior:'auto',block:'start'});var input=document.querySelector('#property-url');if(input)input.focus({preventScroll:true});},80);}}
  function initDear(){
    var shell=document.querySelector('.dear-letter-shell');
    if(!shell)return;
    var form=shell.querySelector('form'),continueBtn=shell.querySelector('.dear-continue');
    var status=shell.querySelector('.dear-status'),textarea=shell.querySelector('.dear-textarea');
    var expand=shell.querySelector('.dear-expand'),received=shell.querySelector('.dear-received');
    var fields={property:shell.querySelector('[name="property_link"]'),message:shell.querySelector('[name="message"]'),name:shell.querySelector('[name="name"]'),email:shell.querySelector('[name="email"]')};
    var letterStarted=false;function trackLetter(name){if(window.exifMeasurement)window.exifMeasurement.track(name,{placement:'letter'});}var sending=false,failed=false,btn=form&&form.querySelector('.dear-send');
    function saveDraft(){
      if(!letterStarted){letterStarted=true;trackLetter('letter_form_start');}
      var d={};
      Object.keys(fields).forEach(function(k){if(fields[k])d[k]=fields[k].value;});
      try{sessionStorage.setItem('exif-dear-draft',JSON.stringify(d));}catch(e){}
    }
    function loadDraft(){
      try{
        var raw=sessionStorage.getItem('exif-dear-draft');
        if(!raw)return;
        var d=JSON.parse(raw);
        Object.keys(fields).forEach(function(k){if(fields[k]&&typeof d[k]==='string')fields[k].value=d[k];});
        if(d.message||d.name||d.email)shell.classList.add('is-expanded');
      }catch(e){}
    }
    function grow(){
      if(!textarea)return;
      textarea.style.height='auto';
      textarea.style.height=Math.max(84,textarea.scrollHeight)+'px';
    }
    function updateStateCopy(){
      var es=getLang()==='es';
      if(btn)btn.textContent=sending?(es?'ENVIANDO…':'SENDING…'):(es?'ENVIAR CARTA':'SEND LETTER');
      if(status)status.textContent=failed?(es?'No pudimos enviar la carta. Escríbenos a hello@exif.studio.':'We could not send the letter. Email hello@exif.studio instead.'):'';
    }
    function openLetter(){
      if(fields.property&&!fields.property.reportValidity())return false;
      shell.classList.add('is-expanded');
      if(expand)expand.removeAttribute('inert');
      if(continueBtn)continueBtn.setAttribute('aria-expanded','true');
      setTimeout(function(){grow();if(textarea)textarea.focus();},reduced?0:350);
      return true;
    }
    Object.keys(fields).forEach(function(k){if(fields[k])fields[k].addEventListener('input',saveDraft);});
    if(textarea)textarea.addEventListener('input',grow);
    loadDraft();
    grow();
    var expanded=shell.classList.contains('is-expanded');
    if(expand)expand.toggleAttribute('inert',!expanded);
    if(continueBtn){
      continueBtn.setAttribute('aria-expanded',expanded?'true':'false');
      continueBtn.addEventListener('click',openLetter);
    }
    window.addEventListener('exif:languagechange',updateStateCopy);
    if(!form)return;
    // Validate only the visible step; Enter in the URL field opens the letter.
    form.noValidate=true;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(sending||shell.classList.contains('is-sent'))return;
      if(!shell.classList.contains('is-expanded')){openLetter();return;}
      if(!form.reportValidity())return;
      sending=true;
      failed=false;
      if(btn)btn.disabled=true;
      updateStateCopy();
      fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
        .then(function(r){
          if(!r.ok)throw new Error('send');
          shell.classList.add('is-sent');trackLetter('letter_form_success');
          try{sessionStorage.removeItem('exif-dear-draft');}catch(e){}
          if(received){received.setAttribute('tabindex','-1');received.focus({preventScroll:true});}
        })
        .catch(function(){failed=true;})
        .finally(function(){sending=false;if(btn)btn.disabled=false;updateStateCopy();});
    });
  }
  document.addEventListener('DOMContentLoaded',function(){var nav=buildNav();document.querySelectorAll('.lang-toggle').forEach(function(btn){btn.addEventListener('click',function(e){e.preventDefault();var next=getLang()==='es'?'en':'es';saveLang(next);replaceCopy(next);});});replaceCopy(getLang());initNav(nav);initTransitions();initDear();var year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();});window.exifApplyLanguage=replaceCopy;
})();