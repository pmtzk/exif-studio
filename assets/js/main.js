// EXIF Studio — site behavior
(function(){['assets/css/180902.css','assets/css/180902-tight.css','assets/css/180902-refine.css','assets/css/nav-composition.css','assets/css/180902-mobile-fix.css','assets/css/180902-nav-cta.css'].forEach(function(href){if(document.querySelector('link[href="'+href+'"]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l);});}());

document.addEventListener('DOMContentLoaded', function () {
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.main-nav');
  var lockedScrollY=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function canonicalizeDrawer(){
    if(!nav)return;
    nav.innerHTML='<div class="nav-menu-top"><span>EXIF / INDEX</span><span>Mexico + Caribbean</span></div><div class="nav-menu-list"><a href="index.html#approach"><span>Approach</span></a><a href="index.html#selected-work"><span>Selected Work</span></a><a href="index.html#audit"><span>The Audit</span></a><a href="visual-direction-production.html"><span>Production</span></a></div><div class="nav-drawer-footer"><a href="dear-exif.html" class="nav-cta nav-dear-exif"><span class="nav-kicker">Have a property in mind?</span><span class="nav-cta-body"><span><strong class="nav-action-title">Dear EXIF,</strong><small class="nav-action-copy">I have a place to show you.</small></span><span class="nav-arrow" aria-hidden="true">→</span></span></a><a href="first-look.html" class="nav-cta nav-first-look"><span class="nav-kicker">Not sure where to start?</span><span class="nav-cta-body"><span><strong class="nav-action-title">First Look</strong><small class="nav-action-copy">30 minutes. No cost.</small></span><span class="nav-arrow" aria-hidden="true">→</span></span></a><div class="nav-drawer-meta"><a href="https://instagram.com/byexifstudio" target="_blank" rel="noopener">Instagram</a><a href="https://linkedin.com/company/exif-studio" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:hello@exif.studio">hello@exif.studio</a></div></div>';
  }
  canonicalizeDrawer();

  function lockPage(){lockedScrollY=window.scrollY||window.pageYOffset||0;document.body.style.position='fixed';document.body.style.top='-'+lockedScrollY+'px';document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';document.body.style.overflow='hidden';}
  function unlockPage(){document.body.style.position='';document.body.style.top='';document.body.style.left='';document.body.style.right='';document.body.style.width='';document.body.style.overflow='';window.scrollTo(0,lockedScrollY);}

  function buildRollingLabels(){
    if(!nav)return;
    nav.querySelectorAll('.nav-menu-list a').forEach(function(link){
      if(link.dataset.rollReady==='split')return;
      var label=(link.dataset.rollLabel||link.textContent).trim();
      link.dataset.rollLabel=label;link.innerHTML='';
      var mask=document.createElement('span');mask.className='nav-roll-mask';
      var primary=document.createElement('span');primary.className='nav-roll-layer nav-roll-label';
      var copy=document.createElement('span');copy.className='nav-roll-layer nav-roll-copy-layer';copy.setAttribute('aria-hidden','true');
      label.split(' ').forEach(function(wordText,index,words){var word=document.createElement('span');word.className='nav-roll-word';word.style.setProperty('--word-index',index);word.textContent=wordText;primary.appendChild(word);copy.appendChild(word.cloneNode(true));if(index<words.length-1){primary.appendChild(document.createTextNode(' '));copy.appendChild(document.createTextNode(' '));}});
      mask.append(primary,copy);link.appendChild(mask);link.dataset.rollReady='split';
    });
  }
  function assignRevealOrder(){if(!nav)return;var order=0;nav.querySelectorAll('.nav-menu-list a').forEach(function(el){el.style.setProperty('--i',order++);});[nav.querySelector('.nav-dear-exif'),nav.querySelector('.nav-first-look')].forEach(function(el){if(el)el.style.setProperty('--i',order++);});}
  buildRollingLabels();assignRevealOrder();

  if(toggle&&nav){
    toggle.setAttribute('aria-expanded','false');
    function closeNav(){if(!nav.classList.contains('open'))return;nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open');nav.querySelectorAll('.is-pressed,.is-clicked').forEach(function(link){link.classList.remove('is-pressed','is-clicked');});unlockPage();}
    function openNav(){nav.classList.add('open');toggle.setAttribute('aria-expanded','true');document.body.classList.add('nav-open');lockPage();buildRollingLabels();assignRevealOrder();}
    toggle.addEventListener('click',function(){if(nav.classList.contains('open'))closeNav();else openNav();});
    nav.querySelectorAll('.nav-menu-list a').forEach(function(link){
      link.addEventListener('touchstart',function(){link.classList.add('is-pressed');},{passive:true});
      link.addEventListener('touchend',function(){link.classList.remove('is-pressed');},{passive:true});
      link.addEventListener('touchcancel',function(){link.classList.remove('is-pressed');},{passive:true});
      link.addEventListener('click',function(event){var destination=link.getAttribute('href');if(!reduced){event.preventDefault();if(link.classList.contains('is-clicked'))return;link.classList.add('is-clicked');window.setTimeout(function(){closeNav();if(destination&&destination.indexOf('index.html#')===0&&window.location.pathname.endsWith('/index.html')){var localId=destination.slice(destination.indexOf('#'));var target=document.querySelector(localId);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}else if(destination&&destination.charAt(0)==='#'){var target=document.querySelector(destination);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}else if(destination)window.location.href=destination;},360);return;}closeNav();});
    });
    nav.querySelectorAll('.nav-dear-exif,.nav-first-look').forEach(function(btn){var releaseTimer;function press(){window.clearTimeout(releaseTimer);btn.classList.add('is-pressed');}function release(){window.clearTimeout(releaseTimer);releaseTimer=window.setTimeout(function(){btn.classList.remove('is-pressed');},90);}btn.addEventListener('touchstart',press,{passive:true});btn.addEventListener('touchend',release,{passive:true});btn.addEventListener('touchcancel',release,{passive:true});btn.addEventListener('pointerdown',function(event){if(event.pointerType!=='mouse')press();});btn.addEventListener('pointerup',function(event){if(event.pointerType!=='mouse')release();});btn.addEventListener('click',function(event){if(reduced){closeNav();return;}var destination=btn.getAttribute('href');event.preventDefault();if(btn.classList.contains('is-clicked'))return;btn.classList.remove('is-pressed');btn.classList.add('is-clicked');window.setTimeout(function(){closeNav();if(destination)window.location.href=destination;},520);});});
    document.addEventListener('keydown',function(event){if(event.key==='Escape')closeNav();});
  }

  var form=document.getElementById('dear-exif-form');var status=document.getElementById('form-status');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();var data=new FormData(form);var submitBtn=form.querySelector('button[type="submit"]');status.textContent='';status.removeAttribute('data-state');if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Sending…';}fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}}).then(function(response){if(response.ok){form.reset();status.dataset.state='success';status.textContent='Thank you. EXIF will review your property and respond personally.';}else{return response.json().then(function(json){throw new Error((json&&json.errors)?json.errors.map(function(er){return er.message;}).join(', '):'Something went wrong.');});}}).catch(function(err){status.dataset.state='error';status.textContent='The form could not be sent ('+err.message+'). Please email hello@exif.studio directly.';}).finally(function(){if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Send to EXIF';}});});}
  var yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
});
