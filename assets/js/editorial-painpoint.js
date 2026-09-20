(function(){
function initEditorialPainpoint(){
  var section=document.querySelector('.editorial-choice');
  var langButton=document.querySelector('.lang-toggle');
  if(!section||section.dataset.editorialReady==='true')return;
  section.dataset.editorialReady='true';
  var hookSmall=section.querySelector('.choice-hook p');
  var hookTitle=section.querySelector('.choice-hook h2');
  var contextLines=section.querySelectorAll('.choice-context p');
  var lead=section.querySelector('.choice-scale .lead');
  var option=section.querySelector('.choice-option');
  var many=section.querySelector('.choice-many');
  var decision=section.querySelector('.choice-decision');
  var decisionMain=decision&&decision.querySelector('strong');
  var decisionOther=decision&&decision.querySelector('em');
  var workImage=section.querySelector('.choice-work-entry img');
  var header=document.querySelector('.site-header');
  var ticking=false;
  function clamp01(v){return Math.max(0,Math.min(1,v));}
  function smoothstep(v){v=clamp01(v);return v*v*(3-2*v);}
  function localProgress(el,start,end){if(!el)return 0;var r=el.getBoundingClientRect();return smoothstep((window.innerHeight*start-r.top)/(window.innerHeight*(start-end)));}
  function updateMotion(){
    ticking=false;
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced){
      /* Hook: two directions converge into the final editorial composition. */
      var hp=localProgress(hookTitle,.98,.48);
      if(hookSmall)hookSmall.style.setProperty('--hook-small-x',((1-hp)*28).toFixed(2)+'px');
      if(hookTitle)hookTitle.style.setProperty('--hook-title-x',((1-hp)*-46).toFixed(2)+'px');

      /* Argument: opposing, almost imperceptible drift. */
      if(contextLines[0]){var c1=localProgress(contextLines[0],.98,.45);contextLines[0].style.setProperty('--context-a-x',((.5-c1)*38).toFixed(2)+'px');}
      if(contextLines[1]){var c2=localProgress(contextLines[1],.98,.45);contextLines[1].style.setProperty('--context-b-x',((c2-.5)*48).toFixed(2)+'px');}

      /* Bridge: nearly still, only a small vertical settling. */
      if(lead){var lp=localProgress(lead,.96,.55);lead.style.setProperty('--lead-y',((1-lp)*15).toFixed(2)+'px');}

      /* Scale statement: opposing horizontal motion tied to its own viewport position. */
      var sp=localProgress(option||many,.99,.30);
      var distance=window.innerWidth<860?18:Math.min(105,window.innerWidth*.065);
      if(option)option.style.setProperty('--option-x',((1-sp)*distance*.52).toFixed(2)+'px');
      if(many)many.style.setProperty('--many-x',((1-sp)*-distance).toFixed(2)+'px');

      /* Payoff: the only blur in the sequence. */
      if(decision&&decisionMain&&decisionOther){
        var dr=decision.getBoundingClientRect();var start=window.innerHeight*.94;var end=window.innerHeight*.30;var dp=smoothstep((start-dr.top)/(start-end));
        decisionMain.style.setProperty('--decision-opacity',(.18+.82*dp).toFixed(3));
        decisionMain.style.setProperty('--decision-blur',((1-dp)*(window.innerWidth<860?5.5:8)).toFixed(2)+'px');
        decisionMain.style.setProperty('--decision-y',((1-dp)*(window.innerWidth<860?18:30)).toFixed(2)+'px');
        var ep=smoothstep((dp-.34)/.66);
        decisionOther.style.setProperty('--other-opacity',ep.toFixed(3));
        decisionOther.style.setProperty('--other-blur',((1-ep)*(window.innerWidth<860?4:6)).toFixed(2)+'px');
        decisionOther.style.setProperty('--other-y',((1-ep)*(window.innerWidth<860?12:20)).toFixed(2)+'px');
      }
      if(workImage){var ir=workImage.getBoundingClientRect();var ip=clamp01((window.innerHeight-ir.top)/(window.innerHeight+ir.height));workImage.style.setProperty('--choice-image-scale',(1.075-ip*.055).toFixed(4));workImage.style.setProperty('--choice-image-y',((.5-ip)*28).toFixed(2)+'px');}
    }
    if(header&&langButton){var b=langButton.getBoundingClientRect();var cx=b.left+b.width/2;var cy=b.top+b.height/2;langButton.style.pointerEvents='none';var el=document.elementFromPoint(cx,cy);langButton.style.pointerEvents='auto';var dark=el&&el.closest&&el.closest('.bg-deep,.site-footer,.dear-strip,.exif-cinematic-hero');header.classList.toggle('nav-lang-on-dark',!!dark);header.classList.toggle('nav-lang-on-light',!dark);}
  }
  function requestMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
  window.addEventListener('scroll',requestMotion,{passive:true});window.addEventListener('resize',requestMotion,{passive:true});updateMotion();
  var copy={en:{hook:'Someone is choosing where to stay.',question:'Why your property?',seconds:'They have seconds to find a reason.',compare:'Before they choose, they compare.',while:'And while they decide,',option:'Yours is one option',many:'among many.',property:'Your property',other:'or another one?'},es:{hook:'Alguien está eligiendo dónde quedarse.',question:'¿Por qué tu propiedad?',seconds:'Tiene segundos para encontrar una razón.',compare:'Antes de elegir, compara.',while:'Y mientras decide,',option:'La tuya es una opción',many:'entre muchas.',property:'Tu propiedad',other:'¿u otra?'}};
  function setLanguage(lang){if(!copy[lang])lang='en';section.querySelectorAll('[data-copy]').forEach(function(el){var key=el.getAttribute('data-copy');if(copy[lang][key])el.textContent=copy[lang][key]});document.documentElement.lang=lang;try{localStorage.setItem('exif-language',lang);}catch(e){}if(langButton){langButton.textContent=lang==='en'?'ES':'ENG';langButton.setAttribute('aria-label',lang==='en'?'Cambiar a español':'Switch to English');langButton.dataset.lang=lang;langButton.setAttribute('aria-pressed',lang==='es'?'true':'false');}requestMotion();}
  if(langButton){langButton.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var current=langButton.dataset.lang||document.documentElement.lang||'en';setLanguage(current==='es'?'en':'es');});}
  var initial='en';try{initial=localStorage.getItem('exif-language')||'en';}catch(e){}setLanguage(initial);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEditorialPainpoint,{once:true});else initEditorialPainpoint();
})();
