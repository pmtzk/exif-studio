document.addEventListener('DOMContentLoaded',function(){
  var section=document.querySelector('.editorial-choice');
  var langButton=document.querySelector('.lang-toggle');
  if(!section)return;

  var many=section.querySelector('.choice-many');
  var ticking=false;
  function updateMotion(){
    ticking=false;
    if(!many||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var r=section.getBoundingClientRect();
    var span=Math.max(1,r.height+window.innerHeight);
    var p=Math.max(0,Math.min(1,(window.innerHeight-r.top)/span));
    var travel=window.innerWidth<860?24:Math.min(150,window.innerWidth*.085);
    many.style.setProperty('--choice-shift',((p-.5)*travel).toFixed(2)+'px');
  }
  function requestMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
  window.addEventListener('scroll',requestMotion,{passive:true});
  window.addEventListener('resize',requestMotion,{passive:true});
  updateMotion();

  var copy={
    en:{hook:'Someone is choosing where to stay.',question:'Why your property?',seconds:'They have seconds to find a reason.',compare:'Before they choose, they compare.',while:'And while they decide,',option:'Yours is one option',many:'among many.',property:'Your property.',other:'or another one.'},
    es:{hook:'Alguien elige dónde quedarse.',question:'¿Por qué tu propiedad?',seconds:'Tiene segundos para encontrar una razón.',compare:'Antes de elegir, compara.',while:'Y mientras decide,',option:'Tu propiedad es una opción',many:'entre muchas.',property:'Tu propiedad.',other:'u otra.'}
  };
  function setLanguage(lang){
    if(!copy[lang])lang='en';
    section.querySelectorAll('[data-copy]').forEach(function(el){var key=el.getAttribute('data-copy');if(copy[lang][key])el.textContent=copy[lang][key]});
    document.documentElement.lang=lang;
    if(langButton){langButton.textContent=lang==='en'?'ES':'ENG';langButton.setAttribute('aria-label',lang==='en'?'Ver esta sección en español':'View this section in English');langButton.dataset.lang=lang;}
  }
  if(langButton){langButton.addEventListener('click',function(){setLanguage(langButton.dataset.lang==='es'?'en':'es')});}
  setLanguage('en');
});
