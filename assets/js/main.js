// EXIF Studio — shared site behavior
(function(){
  var seen=false;
  try{seen=sessionStorage.getItem('exif-intro-seen')==='1';sessionStorage.setItem('exif-intro-seen','1');}catch(e){}
  if(seen)document.body.classList.add('exif-returning');
}());

document.addEventListener('DOMContentLoaded',function(){
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.main-nav');
  var lockedScrollY=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function canonicalizeDrawer(){
    if(!nav)return;
    nav.innerHTML='<div class="nav-menu-top"><a class="nav-home" href="index.html" aria-label="EXIF Studio home">Signal</a></div><div class="nav-menu-list"><a href="index.html#approach"><span>Approach</span></a><a href="index.html#selected-work"><span>Selected work</span></a><a href="index.html#audit"><span>The Audit</span></a><a href="visual-direction-production.html"><span>Production</span></a></div><div class="nav-drawer-footer"><a href="dear-exif.html" class="nav-cta nav-dear-exif"><span class="nav-kicker">Have a property in mind?</span><span class="nav-cta-body"><span><strong class="nav-action-title">Dear EXIF,</strong><small class="nav-action-copy">I have a place to show you.</small></span><span class="nav-arrow" aria-hidden="true">→</span></span></a><a href="first-look.html" class="nav-cta nav-first-look"><span class="nav-kicker">Not sure where to start?</span><span class="nav-cta-body"><span><strong class="nav-action-title">First Look</strong><small class="nav-action-copy">30 minutes. No cost.</small></span><span class="nav-arrow" aria-hidden="true">→</span></span></a><div class="nav-drawer-meta"><a href="https://instagram.com/byexifstudio" target="_blank" rel="noopener">Instagram</a><a href="https://linkedin.com/company/exif-studio" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:hello@exif.studio">hello@exif.studio</a></div></div>';
  }
  canonicalizeDrawer();

  function buildRollingLabels(){if(!nav)return;nav.querySelectorAll('.nav-menu-list a').forEach(function(link){var label=(link.dataset.rollLabel||link.textContent).trim();link.dataset.rollLabel=label;link.innerHTML='<span class="nav-roll-mask"><span class="nav-roll-track"><span class="nav-roll-copy">'+label+'</span><span class="nav-roll-copy" aria-hidden="true">'+label+'</span></span></span>';});}
  buildRollingLabels();

  function lockPage(){lockedScrollY=window.scrollY||0;document.body.style.position='fixed';document.body.style.top='-'+lockedScrollY+'px';document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';document.body.style.overflow='hidden';}
  function unlockPage(){document.body.style.position='';document.body.style.top='';document.body.style.left='';document.body.style.right='';document.body.style.width='';document.body.style.overflow='';window.scrollTo(0,lockedScrollY);}
  function openNav(){if(!nav)return;nav.classList.add('open');toggle.setAttribute('aria-expanded','true');document.body.classList.add('nav-open');lockPage();}
  function closeNav(){if(!nav||!nav.classList.contains('open'))return;nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open');nav.querySelectorAll('.is-pressed,.is-clicked').forEach(function(el){el.classList.remove('is-pressed','is-clicked');});unlockPage();}
  function onHome(){var p=window.location.pathname;return p==='/'||p.endsWith('/index.html');}
  function goTo(destination){closeNav();if(!destination)return;if(destination.indexOf('index.html#')===0&&onHome()){var t=document.querySelector(destination.slice(destination.indexOf('#')));if(t)t.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});return;}if(destination.charAt(0)==='#'){var l=document.querySelector(destination);if(l)l.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});return;}window.location.href=destination;}

  if(toggle&&nav){
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',function(){nav.classList.contains('open')?closeNav():openNav();});
    nav.querySelectorAll('.nav-menu-list a,.nav-cta').forEach(function(link){
      function press(){link.classList.add('is-pressed');}
      function release(){window.setTimeout(function(){link.classList.remove('is-pressed');},90);}
      link.addEventListener('touchstart',press,{passive:true});link.addEventListener('touchend',release,{passive:true});link.addEventListener('touchcancel',release,{passive:true});
      link.addEventListener('click',function(e){var dest=link.getAttribute('href');if(reduced){e.preventDefault();goTo(dest);return;}e.preventDefault();if(link.classList.contains('is-clicked'))return;link.classList.remove('is-pressed');link.classList.add('is-clicked');window.setTimeout(function(){goTo(dest);},link.classList.contains('nav-cta')?360:330);});
    });
    var home=nav.querySelector('.nav-home');if(home)home.addEventListener('click',function(e){e.preventDefault();closeNav();if(onHome())window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});else window.location.href='index.html';});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav();});
  }

  var form=document.getElementById('dear-exif-form'),status=document.getElementById('form-status');
  if(form)form.addEventListener('submit',function(e){e.preventDefault();var data=new FormData(form),btn=form.querySelector('button[type="submit"]');if(status){status.textContent='';status.removeAttribute('data-state');}if(btn){btn.disabled=true;btn.textContent='Sending…';}fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('Something went wrong.');form.reset();if(status){status.dataset.state='success';status.textContent='Thank you. EXIF will review your property and respond personally.';}}).catch(function(err){if(status){status.dataset.state='error';status.textContent='The form could not be sent ('+err.message+'). Please email hello@exif.studio directly.';}}).finally(function(){if(btn){btn.disabled=false;btn.textContent='Send to EXIF';}});});
  var year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
});
