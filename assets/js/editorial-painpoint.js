(function(){
function initEditorialPainpoint(){
  var section=document.querySelector('.editorial-choice');
  var langButton=document.querySelector('.lang-toggle');
  if(!section||section.dataset.editorialReady==='true')return;
  section.dataset.editorialReady='true';

  var many=section.querySelector('.choice-many');
  var scrubEls=Array.prototype.slice.call(section.querySelectorAll('.choice-hook p,.choice-hook h2,.choice-context p,.choice-scale .lead,.choice-scale h3'));
  var decision=section.querySelector('.choice-decision');
  var decisionMain=decision&&decision.querySelector('strong');
  var decisionOther=decision&&decision.querySelector('em');
  var workImage=section.querySelector('.choice-work-entry img');
  var header=document.querySelector('.site-header');
  var ticking=false;
  function clamp01(v){return Math.max(0,Math.min(1,v));}
  function smoothstep(v){v=clamp01(v);return v*v*(3-2*v);}
  function scrubElement(el,index,reduced){
    if(!el||reduced)return;
    var er=el.getBoundingClientRect();
    var start=window.innerHeight*(.96-Math.min(index,4)*.008);
    var end=window.innerHeight*.54;
    var ep=smoothstep((start-er.top)/(start-end));
    var maxBlur=window.innerWidth<860?3.2:4.8;
    var maxY=window.innerWidth<860?13:20;
    el.style.setProperty('--scrub-opacity',(.28+.72*ep).toFixed(3));
    el.style.setProperty('--scrub-blur',((1-ep)*maxBlur).toFixed(2)+'px');
    el.style.setProperty('--scrub-y',((1-ep)*maxY).toFixed(2)+'px');
  }
  function updateMotion(){
    ticking=false;
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var r=section.getBoundingClientRect();
    var span=Math.max(1,r.height+window.innerHeight);
    var p=clamp01((window.innerHeight-r.top)/span);
    scrubEls.forEach(function(el,index){scrubElement(el,index,reduced);});
    if(many&&!reduced){var travel=window.innerWidth<860?10:Math.min(70,window.innerWidth*.04);many.style.setProperty('--choice-shift',((p-.5)*travel).toFixed(2)+'px');}

    if(decision&&decisionMain&&decisionOther&&!reduced){
      var dr=decision.getBoundingClientRect();
      var start=window.innerHeight*.94;
      var end=window.innerHeight*.30;
      var dp=smoothstep((start-dr.top)/(start-end));
      var op=.18+.82*dp;
      var blur=(1-dp)*(window.innerWidth<860?5.5:8);
      var y=(1-dp)*(window.innerWidth<860?18:30);
      decisionMain.style.setProperty('--decision-opacity',op.toFixed(3));
      decisionMain.style.setProperty('--decision-blur',blur.toFixed(2)+'px');
      decisionMain.style.setProperty('--decision-y',y.toFixed(2)+'px');
      var ep=smoothstep((dp-.34)/.66);
      decisionOther.style.setProperty('--other-opacity',ep.toFixed(3));
      decisionOther.style.setProperty('--other-blur',((1-ep)*(window.innerWidth<860?4:6)).toFixed(2)+'px');
      decisionOther.style.setProperty('--other-y',((1-ep)*(window.innerWidth<860?12:20)).toFixed(2)+'px');
    }

    if(workImage&&!reduced){var ir=workImage.getBoundingClientRect();var ip=clamp01((window.innerHeight-ir.top)/(window.innerHeight+ir.height));workImage.style.setProperty('--choice-image-scale',(1.075-ip*.055).toFixed(4));workImage.style.setProperty('--choice-image-y',((.5-ip)*28).toFixed(2)+'px');}
    if(header&&langButton){var b=langButton.getBoundingClientRect();var cx=b.left+b.width/2;var cy=b.top+b.height/2;langButton.style.pointerEvents='none';var el=document.elementFromPoint(cx,cy);langButton.style.pointerEvents='auto';var dark=el&&el.closest&&el.closest('.bg-deep,.site-footer,.dear-strip,.exif-cinematic-hero');header.classList.toggle('nav-lang-on-dark',!!dark);header.classList.toggle('nav-lang-on-light',!dark);}
  }
  function requestMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
  window.addEventListener('scroll',requestMotion,{passive:true});
  window.addEventListener('resize',requestMotion,{passive:true});
  updateMotion();

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
