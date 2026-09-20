(function(){
function initEditorialPainpoint(){
  var section=document.querySelector('.editorial-choice');
  var langButton=document.querySelector('.lang-toggle');
  if(!section||section.dataset.editorialReady==='true')return;
  section.dataset.editorialReady='true';

  var many=section.querySelector('.choice-many');
  var decision=section.querySelector('.choice-decision');
  var workImage=section.querySelector('.choice-work-entry img');
  var header=document.querySelector('.site-header');
  var lightTargets=Array.prototype.slice.call(section.querySelectorAll('.choice-hook p,.choice-hook h2,.choice-context p,.choice-scale .lead,.choice-scale h3,.choice-decision strong,.choice-decision em'));
  lightTargets.forEach(function(el){el.classList.add('scroll-ink');});
  var ticking=false;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function updateMotion(){
    ticking=false;
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var r=section.getBoundingClientRect();
    var span=Math.max(1,r.height+window.innerHeight);
    var p=clamp((window.innerHeight-r.top)/span,0,1);
    if(many&&!reduced){var travel=window.innerWidth<860?10:Math.min(70,window.innerWidth*.04);many.style.setProperty('--choice-shift',((p-.5)*travel).toFixed(2)+'px');}
    if(!reduced){
      var focus=window.innerHeight*.58;
      var range=window.innerHeight*.72;
      lightTargets.forEach(function(el){
        var er=el.getBoundingClientRect();
        var center=er.top+er.height*.5;
        var local=clamp((focus-center)/range+.5,0,1);
        el.style.setProperty('--ink-progress',(local*140-20).toFixed(2)+'%');
        el.style.setProperty('--ink-presence',(0.46+0.54*(1-Math.min(1,Math.abs(center-focus)/(window.innerHeight*.82)))).toFixed(3));
      });
    }
    if(workImage&&!reduced){var ir=workImage.getBoundingClientRect();var ip=clamp((window.innerHeight-ir.top)/(window.innerHeight+ir.height),0,1);workImage.style.setProperty('--choice-image-scale',(1.075-ip*.055).toFixed(4));workImage.style.setProperty('--choice-image-y',((.5-ip)*28).toFixed(2)+'px');}
    if(header&&langButton){var b=langButton.getBoundingClientRect();var cx=b.left+b.width/2;var cy=b.top+b.height/2;langButton.style.pointerEvents='none';var el=document.elementFromPoint(cx,cy);langButton.style.pointerEvents='auto';var dark=el&&el.closest&&el.closest('.bg-deep,.site-footer,.dear-strip,.exif-cinematic-hero');header.classList.toggle('nav-lang-on-dark',!!dark);header.classList.toggle('nav-lang-on-light',!dark);}
  }
  function requestMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
  window.addEventListener('scroll',requestMotion,{passive:true});
  window.addEventListener('resize',requestMotion,{passive:true});
  updateMotion();

  if(decision)decision.classList.add('is-live');

  var copy={
    en:{hook:'Someone is choosing where to stay.',question:'Why your property?',seconds:'They have seconds to find a reason.',compare:'Before they choose, they compare.',while:'And while they decide,',option:'Yours is one option',many:'among many.',property:'Your property',other:'or another one?'},
    es:{hook:'Alguien está eligiendo dónde quedarse.',question:'¿Por qué tu propiedad?',seconds:'Tiene segundos para encontrar una razón.',compare:'Antes de elegir, compara.',while:'Y mientras decide,',option:'La tuya es una opción',many:'entre muchas.',property:'Tu propiedad',other:'¿u otra?'}
  };
  function setLanguage(lang){
    if(!copy[lang])lang='en';
    section.querySelectorAll('[data-copy]').forEach(function(el){var key=el.getAttribute('data-copy');if(copy[lang][key])el.textContent=copy[lang][key]});
    document.documentElement.lang=lang;
    try{localStorage.setItem('exif-language',lang);}catch(e){}
    if(langButton){langButton.textContent=lang==='en'?'ES':'ENG';langButton.setAttribute('aria-label',lang==='en'?'Cambiar a español':'Switch to English');langButton.dataset.lang=lang;langButton.setAttribute('aria-pressed',lang==='es'?'true':'false');}
    requestMotion();
  }
  if(langButton){langButton.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var current=langButton.dataset.lang||document.documentElement.lang||'en';setLanguage(current==='es'?'en':'es');});}
  var initial='en';try{initial=localStorage.getItem('exif-language')||'en';}catch(e){}
  setLanguage(initial);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEditorialPainpoint,{once:true});
else initEditorialPainpoint();
})();
