/* EXIF V3: direct editorial choices, native disclosure, passive reading signals.
   No gallery/hero controller writes, external requests or storage. */
(function(){
 'use strict';
 function lang(){return document.documentElement.lang==='es'?'es':'en';}
 function local(el,en,es){if(!el)return;el.dataset.en=en;el.dataset.es=es;el.textContent=lang()==='es'?es:en;}
 function all(selector,root){return Array.prototype.slice.call((root||document).querySelectorAll(selector));}
 var preference=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
 var reduced=preference?preference.matches:true;
 if(preference){var change=function(e){reduced=e.matches;};if(preference.addEventListener)preference.addEventListener('change',change);else if(preference.addListener)preference.addListener(change);}
 function initFolios(){
  var index=document.querySelector('.v3-folio-index'),panels=all('[data-service]');if(!index||panels.length!==3)return;
  var tabs=all('[data-folio]',index),active=0;
  index.setAttribute('role','tablist');index.setAttribute('aria-orientation','vertical');
  function select(n,focus){
   active=n;tabs.forEach(function(t,i){t.hidden=false;t.setAttribute('role','tab');t.setAttribute('aria-selected',i===n?'true':'false');t.tabIndex=i===n?0:-1;});
   panels.forEach(function(p,i){p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','folio-tab-'+i);p.hidden=i!==n;p.classList.remove('is-changing');if(i===n&&!reduced){void p.offsetWidth;p.classList.add('is-changing');}});
   if(focus)tabs[n].focus({preventScroll:true});
  }
  tabs.forEach(function(t,i){t.addEventListener('click',function(e){e.preventDefault();select(i,false);});t.addEventListener('keydown',function(e){var next=active;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(active+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(active+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next,true);});});
  all('.v3-specimen-controls').forEach(function(el){el.hidden=false;});select(0,false);
  var range=document.querySelector('#reading-line'),note=document.querySelector('#reading-note');
  var reading=[['What is actually present?','¿Qué está realmente presente?'],['What does the representation promise?','¿Qué promete la representación?'],['What might a guest understand?','¿Qué podría entender un huésped?']];
  function read(){if(!range)return;var n=Number(range.value),i=Math.min(2,Math.floor(n/34));range.closest('.v3-examination').style.setProperty('--reading',String(n/100));local(note,reading[i][0],reading[i][1]);range.setAttribute('aria-valuetext',reading[i][lang()==='es'?1:0]);}
  if(range)range.addEventListener('input',read);read();
  function choices(selector,attribute){var choices=all(selector);choices.forEach(function(b,i){b.addEventListener('click',function(){var specimen=b.closest('.v3-specimen');specimen.setAttribute(attribute,String(i));choices.forEach(function(x,j){x.setAttribute('aria-pressed',i===j?'true':'false');});if(attribute==='data-format')format();});});}
  choices('[data-emphasis-choice]','data-emphasis');choices('[data-format-choice]','data-format');
  var formats=[['An image brief: show how a space is used, not only how it looks.','Un brief de imagen: mostrar cómo se usa un espacio, no solo cómo se ve.'],['A narrative: describe a verifiable moment rather than an adjective.','Una narrativa: describir un momento verificable en vez de un adjetivo.'],['A page: make the distinguishing detail visible before asking for action.','Una página: hacer visible el detalle distintivo antes de pedir una acción.']];
  function format(){var specimen=document.querySelector('.v3-production');if(!specimen)return;var i=Number(specimen.dataset.format)||0;local(document.querySelector('#format-note'),formats[i][0],formats[i][1]);}
  format();window.addEventListener('exif:languagechange',function(){read();format();});
 }
 function initStudy(){
  var study=document.querySelector('.v3-study');if(!study)return;var buttons=all('[data-study-choice]',study),panels=all('[data-study-panel]',study);
  function select(n){study.dataset.study=String(n);buttons.forEach(function(b,i){b.hidden=false;b.setAttribute('aria-pressed',i===n?'true':'false');});panels.forEach(function(p,i){p.hidden=i!==n;});}
  buttons.forEach(function(b,i){b.addEventListener('click',function(){select(i);});});select(0);
 }
 function initNavNote(){
  var side=document.querySelector('.exif-drawer .v1-nav-side');if(!side)return;
  var note=document.createElement('p');note.className='v3-nav-note';note.setAttribute('aria-hidden','true');side.insertBefore(note,side.firstChild);local(note,'A place, made unmistakable.','Un lugar, inconfundible.');
 }
 function initCorrespondence(){
  var form=document.querySelector('#discovery-inquiry');if(!form)return;
  var readiness=document.createElement('p');readiness.className='v3-form-readiness';readiness.setAttribute('role','status');readiness.setAttribute('aria-live','polite');form.insertBefore(readiness,form.querySelector('button[type="submit"]'));
  function update(){var ready=all('[required]',form).every(function(f){return f.value.trim()&&f.checkValidity();});local(readiness,ready?'Ready when you are.':'An introduction, in progress.',ready?'Cuando quieras, está lista.':'Una presentación, en curso.');}
  form.addEventListener('input',update);form.addEventListener('change',update);window.addEventListener('exif:languagechange',update);update();
 }
 function initReading(){
  var chapters=all('[data-process]'),links=all('[data-process-link]'),index=document.querySelector('.v3-process-index'),bridge=document.querySelector('.v3-chapter-bridge');
  if(!chapters.length&&!bridge)return;
  var raf=0,observing=true,visibilityObserver;
  function paint(){
   raf=0;if(document.hidden)return;
   if(chapters.length){var y=innerHeight*.36,current=0;chapters.forEach(function(c,i){if(c.getBoundingClientRect().top<=y)current=i;});links.forEach(function(a,i){if(i===current)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});if(index)index.style.setProperty('--process-progress',String((current+1)/chapters.length));}
   if(bridge){var rect=bridge.getBoundingClientRect();if(reduced)bridge.style.setProperty('--frame-progress','1');else if(rect.bottom>=-50&&rect.top<=innerHeight+50)bridge.style.setProperty('--frame-progress',String(Math.max(.15,Math.min(1,(innerHeight-rect.top)/(innerHeight*.65)))));}
  }
  function wake(){if(!raf&&observing&&!document.hidden){if(typeof requestAnimationFrame==='function')raf=requestAnimationFrame(paint);else paint();}}
  // Observe the scope; one scheduled frame per scroll, no continuous animation loop.
  var scope=index?index.closest('.v2-scope'):bridge.closest('.v2-introduction');
  if('IntersectionObserver' in window&&scope){visibilityObserver=new IntersectionObserver(function(entries){observing=entries[0].isIntersecting;if(observing)wake();},{rootMargin:'0px'});visibilityObserver.observe(scope);}
  window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',wake,{passive:true});document.addEventListener('visibilitychange',wake);window.addEventListener('exif:languagechange',wake);
  function motion(e){reduced=e.matches;paint();}
  if(preference){if(preference.addEventListener)preference.addEventListener('change',motion);else if(preference.addListener)preference.addListener(motion);}
  paint();
 }
 function init(){initFolios();initStudy();initNavNote();initCorrespondence();initReading();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
