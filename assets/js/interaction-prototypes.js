/* Scoped review prototypes. No gallery writes, wheel interception or continuous RAF. */
(function(){
 'use strict';
 function init(){
  var artifact=document.querySelector('.exif-artifact');
  if(artifact){
   var tabs=Array.from(document.querySelectorAll('.v3-folio-index [data-folio]'));
   var choices=Array.from(artifact.querySelectorAll('[data-artifact-choice]'));
   var states=Array.from(artifact.querySelectorAll('[data-artifact-state]'));
   if(tabs.length===3&&tabs[0].hasAttribute('aria-selected')){
    var active=-1;
    function sync(){var n=tabs.findIndex(function(t){return t.getAttribute('aria-selected')==='true';});if(n<0||n===active)return;active=n;states.forEach(function(p,i){p.hidden=i!==n;});choices.forEach(function(b,i){b.setAttribute('aria-pressed',String(i===n));});artifact.dataset.stage=String(n);}
    choices.forEach(function(b,i){b.addEventListener('click',function(){tabs[i].click();sync();});b.addEventListener('keydown',function(e){var n=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%3;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();choices[n].click();choices[n].focus({preventScroll:true});});});
    new MutationObserver(sync).observe(document.querySelector('.v3-folio-index'),{subtree:true,attributes:true,attributeFilter:['aria-selected']});
    artifact.classList.add('is-enhanced');artifact.querySelector('.exif-artifact-choices').hidden=false;sync();
   }
  }
  var passage=document.querySelector('.exif-passage');if(!passage)return;
  var mq=matchMedia('(prefers-reduced-motion: reduce)'),visible=true,frame=0;
  function paint(){frame=0;var r=passage.getBoundingClientRect();var p=mq.matches?1:Math.max(0,Math.min(1,(innerHeight*.9-r.top)/(innerHeight*.6)));passage.style.setProperty('--passage',p.toFixed(4));}
  function wake(){if(visible&&!frame&&!document.hidden)frame=requestAnimationFrame(paint);}
  if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;if(visible)wake();},{rootMargin:'50px'}).observe(passage);
  addEventListener('scroll',wake,{passive:true});addEventListener('resize',wake,{passive:true});document.addEventListener('visibilitychange',wake);mq.addEventListener('change',paint);paint();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
