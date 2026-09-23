(function(){
function initEditorialPainpoint(){
  var section=document.querySelector('.editorial-choice');
  var langButton=document.querySelector('.lang-toggle');
  if(!section||section.dataset.editorialReady==='true')return;
  section.dataset.editorialReady='true';
  var hookSmall=section.querySelector('.choice-hook p'),hookTitle=section.querySelector('.choice-hook h2'),contextLines=section.querySelectorAll('.choice-context p'),lead=section.querySelector('.choice-scale .lead'),option=section.querySelector('.choice-option'),many=section.querySelector('.choice-many'),decision=section.querySelector('.choice-decision'),decisionMain=decision&&decision.querySelector('strong'),decisionOther=decision&&decision.querySelector('em'),workImage=section.querySelector('.choice-work-entry img'),header=document.querySelector('.site-header');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current={},target={},raf=0,last=performance.now();
  var keys=['hookSmallX','hookTitleX','contextAX','contextBX','leadY','optionX','manyX','decisionOpacity','decisionBlur','decisionY','otherOpacity','otherBlur','otherY','imageScale','imageY'];
  function clamp01(v){return Math.max(0,Math.min(1,v));}
  function smoothstep(v){v=clamp01(v);return v*v*(3-2*v);}
  function progress(el,start,end){if(!el)return 0;var r=el.getBoundingClientRect();return smoothstep((innerHeight*start-r.top)/(innerHeight*(start-end)));}
  function setTargets(){
    if(reduced)return;
    var hp=progress(hookTitle,.98,.48);target.hookSmallX=(1-hp)*28;target.hookTitleX=(1-hp)*-46;
    var c1=progress(contextLines[0],.98,.45),c2=progress(contextLines[1],.98,.45);target.contextAX=(.5-c1)*38;target.contextBX=(c2-.5)*48;
    var lp=progress(lead,.96,.55);target.leadY=(1-lp)*15;
    var sp=progress(option||many,.99,.30),distance=innerWidth<860?18:Math.min(105,innerWidth*.065);target.optionX=(1-sp)*distance*.52;target.manyX=(1-sp)*-distance;
    if(decision){var dr=decision.getBoundingClientRect(),dp=smoothstep((innerHeight*.94-dr.top)/(innerHeight*.64));target.decisionOpacity=.18+.82*dp;target.decisionBlur=(1-dp)*(innerWidth<860?5.5:8);target.decisionY=(1-dp)*(innerWidth<860?18:30);var ep=smoothstep((dp-.34)/.66);target.otherOpacity=ep;target.otherBlur=(1-ep)*(innerWidth<860?4:6);target.otherY=(1-ep)*(innerWidth<860?12:20);}
    if(workImage){var ir=workImage.getBoundingClientRect(),ip=clamp01((innerHeight-ir.top)/(innerHeight+ir.height));target.imageScale=1.075-ip*.055;target.imageY=(.5-ip)*28;}
    ensureRAF();
  }
  function apply(){
    if(hookSmall)hookSmall.style.setProperty('--hook-small-x',current.hookSmallX.toFixed(3)+'px');if(hookTitle)hookTitle.style.setProperty('--hook-title-x',current.hookTitleX.toFixed(3)+'px');
    if(contextLines[0])contextLines[0].style.setProperty('--context-a-x',current.contextAX.toFixed(3)+'px');if(contextLines[1])contextLines[1].style.setProperty('--context-b-x',current.contextBX.toFixed(3)+'px');if(lead)lead.style.setProperty('--lead-y',current.leadY.toFixed(3)+'px');if(option)option.style.setProperty('--option-x',current.optionX.toFixed(3)+'px');if(many)many.style.setProperty('--many-x',current.manyX.toFixed(3)+'px');
    if(decisionMain){decisionMain.style.setProperty('--decision-opacity',current.decisionOpacity.toFixed(4));decisionMain.style.setProperty('--decision-blur',current.decisionBlur.toFixed(3)+'px');decisionMain.style.setProperty('--decision-y',current.decisionY.toFixed(3)+'px');}if(decisionOther){decisionOther.style.setProperty('--other-opacity',current.otherOpacity.toFixed(4));decisionOther.style.setProperty('--other-blur',current.otherBlur.toFixed(3)+'px');decisionOther.style.setProperty('--other-y',current.otherY.toFixed(3)+'px');}if(workImage){workImage.style.setProperty('--choice-image-scale',current.imageScale.toFixed(5));workImage.style.setProperty('--choice-image-y',current.imageY.toFixed(3)+'px');}
  }
  function frame(now){
    raf=0;var dt=Math.min(40,now-last);last=now;
    var alpha=1-Math.exp(-dt/105),moving=false;
    keys.forEach(function(k){var d=target[k]-current[k];if(Math.abs(d)>.002){current[k]+=d*alpha;moving=true;}else current[k]=target[k];});apply();if(moving)raf=requestAnimationFrame(frame);
  }
  function ensureRAF(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  function updateLangSurface(){if(header&&langButton){var b=langButton.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;langButton.style.pointerEvents='none';var el=document.elementFromPoint(cx,cy);langButton.style.pointerEvents='auto';var dark=el&&el.closest&&el.closest('.bg-deep,.site-footer,.dear-strip,.exif-cinematic-hero,.dear-home,.studio-letter');header.classList.toggle('nav-lang-on-dark',!!dark);header.classList.toggle('nav-lang-on-light',!dark);}}
  function onViewportChange(){setTargets();updateLangSurface();}
  keys.forEach(function(k){current[k]=target[k]=0;});current.decisionOpacity=target.decisionOpacity=1;current.otherOpacity=target.otherOpacity=1;current.imageScale=target.imageScale=1.075;
  setTargets();keys.forEach(function(k){current[k]=target[k];});apply();
  window.addEventListener('scroll',onViewportChange,{passive:true});window.addEventListener('resize',onViewportChange,{passive:true});
  var copy={en:{hook:'Someone is choosing where to stay.',question:'Why your property?',seconds:'They have seconds to find a reason.',compare:'Before they choose, they compare.',while:'And while they decide,',option:'Yours is one option',many:'among many.',property:'Your property',other:'or another one?'},es:{hook:'Alguien está eligiendo dónde quedarse.',question:'¿Por qué tu propiedad?',seconds:'Tiene segundos para encontrar una razón.',compare:'Antes de elegir, compara.',while:'Y mientras decide,',option:'La tuya es una opción',many:'entre muchas.',property:'Tu propiedad',other:'¿u otra?'}};
  function setLanguage(lang){if(!copy[lang])lang='en';section.querySelectorAll('[data-copy]').forEach(function(el){var key=el.getAttribute('data-copy');if(copy[lang][key])el.textContent=copy[lang][key]});onViewportChange();}
  window.addEventListener('exif:languagechange',function(e){setLanguage(e.detail&&e.detail.lang==='es'?'es':'en');});
  var initial='en';try{initial=localStorage.getItem('exif-language')||'en';}catch(e){}setLanguage(initial);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEditorialPainpoint,{once:true});else initEditorialPainpoint();
})();
