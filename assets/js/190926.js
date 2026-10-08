// Desktop split-colour hero: deterministic geometry updates, throttled to animation frames.
document.addEventListener('DOMContentLoaded', function () {
  var hero=document.querySelector('#what-exif-does');
  if(!hero)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var motionRaf=0,observer=null,geometryRaf=0;
  function initSplitColour(){
    if(window.innerWidth<860)return false;
    var copy=hero.querySelector('.exif-hero-copy');
    var original=copy&&copy.querySelector('h1:not(.exif-hero-title-cream)');
    var photo=hero.querySelector('.exif-hero-bg');
    if(!copy||!original||!photo)return false;
    if(copy.dataset.splitColourReady==='true')return true;
    copy.dataset.splitColourReady='true';
    original.classList.add('exif-hero-title-green');
    var cream=original.cloneNode(true);
    cream.classList.remove('exif-hero-title-green');
    cream.classList.add('exif-hero-title-cream');
    cream.setAttribute('aria-hidden','true');
    copy.insertBefore(cream,original.nextSibling);

    function paintMask(){
      geometryRaf=0;
      var t=original.getBoundingClientRect(),p=photo.getBoundingClientRect();
      if(!t.width||!t.height||!p.width||!p.height){cream.style.clipPath='inset(100%)';return;}
      var x1=Math.max(t.left,p.left),y1=Math.max(t.top,p.top),x2=Math.min(t.right,p.right),y2=Math.min(t.bottom,p.bottom);
      if(x2<=x1||y2<=y1){cream.style.clipPath='inset(100%)';return;}
      var l=(x1-t.left)/t.width*100,r=(x2-t.left)/t.width*100,top=(y1-t.top)/t.height*100,b=(y2-t.top)/t.height*100;
      var clip='polygon('+l+'% '+top+'%, '+r+'% '+top+'%, '+r+'% '+b+'%, '+l+'% '+b+'%)';cream.style.clipPath=clip;cream.style.webkitClipPath=clip;
    }
    function requestMask(){if(!geometryRaf)geometryRaf=requestAnimationFrame(paintMask);}
    var current=0,target=0,lastTime=performance.now();
    function readTarget(){if(reduced||window.innerWidth<860){target=0;return;}target=Math.max(0,Math.min(1,window.scrollY/Math.max(1,hero.offsetHeight*.72)));}
    function writeMotion(v){var e=1-Math.pow(1-v,3);copy.style.setProperty('--hero-scroll-scale',(1-e*.18).toFixed(5));copy.style.setProperty('--hero-scroll-y',(-(e*42)).toFixed(2)+'px');requestMask();}
    function render(now){motionRaf=0;var dt=Math.min(40,now-lastTime);lastTime=now;current+=(target-current)*(1-Math.exp(-dt/105));if(Math.abs(target-current)<.00035)current=target;writeMotion(current);if(current!==target)motionRaf=requestAnimationFrame(render);}
    function requestMotion(){readTarget();if(!motionRaf){lastTime=performance.now();motionRaf=requestAnimationFrame(render);}}
    writeMotion(0);requestAnimationFrame(function(){requestAnimationFrame(paintMask);});
    window.addEventListener('scroll',requestMotion,{passive:true});window.addEventListener('resize',function(){requestMask();requestMotion();},{passive:true});
    window.addEventListener('exif:languagechange',requestMask);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(requestMask).catch(function(){});
    if(photo.decode)photo.decode().then(requestMask).catch(requestMask);else photo.addEventListener('load',requestMask,{once:true});
    return true;
  }

  window.addEventListener('resize',initSplitColour,{passive:true});
  if(!initSplitColour()&&window.innerWidth>=860){observer=new MutationObserver(function(){if(initSplitColour()){observer.disconnect();observer=null;}});observer.observe(hero,{childList:true,subtree:true});}
  queueMicrotask(function(){if(initSplitColour()&&observer){observer.disconnect();observer=null;}});
});

document.addEventListener('DOMContentLoaded',function(){
  var headerWrap=document.querySelector('.site-header .wrap');
  if(headerWrap&&!headerWrap.querySelector('.lang-toggle')){
    var lang=document.createElement('button');lang.type='button';lang.className='lang-toggle';lang.textContent='ES';lang.setAttribute('aria-label','Ver esta sección en español');
    var logo=headerWrap.querySelector('a');if(logo&&logo.nextSibling)headerWrap.insertBefore(lang,logo.nextSibling);else headerWrap.appendChild(lang);
  }

  if(document.querySelector('.gallery-chapter'))return;
  var oldWork=document.querySelector('#selected-work');if(!oldWork)return;
  var galleryItems=[['landscape','exif-gallery-01-lounge.webp','Hospitality lounge',1536,1024],['portrait','exif-gallery-02-orchid-dining.webp','Orchid dining detail',1024,1536],['landscape','exif-gallery-03-terrace-hammock.webp','Terrace and hammock',1152,1536],['portrait','exif-gallery-04-restaurant-interior.webp','Restaurant interior',1152,1536],['portrait','exif-gallery-05-basketball-court.webp','Basketball court',1024,1536],['portrait','exif-gallery-06-restaurant-reflection.webp','Restaurant reflection',1536,1023],['portrait','exif-gallery-07-table-tennis.webp','Table tennis',1024,1536],['landscape','exif-gallery-08-pool-loungers.webp','Pool loungers',1229,1536],['portrait','exif-gallery-09-sunset-ocean.webp','Sunset over the ocean',876,1410],['portrait','exif-gallery-10-beach-golden-hour.webp','Beach at golden hour',1152,1536],['portrait','exif-gallery-11-guests-walking.webp','Guests walking through tropical gardens',1024,1536],['portrait','exif-gallery-12-pool-ocean-view.webp','Pool and ocean view',1152,1536],['portrait','exif-gallery-13-tropical-leaves.webp','Tropical leaves',1024,1536]];
  var galleryAltEs=['Sala de hospitalidad','Detalle de orquídeas en el comedor','Terraza y hamaca','Interior del restaurante','Cancha de baloncesto','Reflejo del restaurante','Mesa de ping-pong','Camastros junto a la alberca','Atardecer sobre el océano','Playa al atardecer','Huéspedes caminando entre jardines tropicales','Alberca y vista al océano','Hojas tropicales'];
  function makeItems(hidden){return galleryItems.map(function(item,index){var sizeClass='gallery-slot-'+((index%13)+1),landscape=item[0]==='landscape',w=item[3],h=item[4],loading='lazy',priority='';return '<figure class="motion-gallery-item '+item[0]+' '+sizeClass+'"'+(hidden?' aria-hidden="true"':'')+'><img src="/assets/img/'+item[1]+'" alt="'+(hidden?'':item[2])+'"'+(hidden?'':' data-alt-en="'+item[2]+'" data-alt-es="'+galleryAltEs[index]+'"')+' width="'+w+'" height="'+h+'" loading="'+loading+'" decoding="async"'+priority+'></figure>';}).join('')}
  var galleryMarkup=makeItems(false)+makeItems(true)+makeItems(true);
  oldWork.outerHTML='<section class="gallery-chapter" id="selected-work" aria-label="Photography"><div class="gallery-green-rise" aria-hidden="true"></div><div class="gallery-signal-stage" aria-hidden="true"><div class="gallery-signal"><span class="signal-dot signal-dot-ring-sm"></span><span class="signal-dot signal-dot-ring-md"></span><span class="signal-dot signal-dot-solid-md"></span><span class="signal-dot signal-dot-solid-lg"></span><span class="signal-dot signal-dot-solid-md"></span><span class="signal-dot signal-dot-ring-md"></span><span class="signal-dot signal-dot-ring-sm"></span></div></div><div class="motion-gallery-controls" aria-label="Gallery navigation" data-aria-en="Gallery controls" data-aria-es="Controles de la galería"><button type="button" data-gallery-step="prev" aria-label="Previous images" data-aria-en="Previous images" data-aria-es="Imágenes anteriores">←</button><button type="button" data-gallery-step="next" aria-label="Next images" data-aria-en="Next images" data-aria-es="Imágenes siguientes">→</button><button type="button" data-gallery-pause aria-pressed="false">PAUSE</button></div><div class="motion-gallery"><div class="motion-gallery-viewport"><div class="motion-gallery-track">'+galleryMarkup+'</div></div></div><p class="gallery-provenance" data-en="Selected hospitality photography from previous professional experience." data-es="Fotografía de hospitalidad seleccionada de experiencia profesional previa.">Selected hospitality photography from previous professional experience.</p></section>';if(window.exifApplyLanguage)window.exifApplyLanguage(document.documentElement.lang);
});

document.addEventListener('DOMContentLoaded',function(){
  var input=document.querySelector('#property-url');
  if(!input)return;
  // URL inputs do not support selectionStart/setSelectionRange.
  // Normalize only after editing, keeping an explicit HTTP(S) scheme intact.
  input.addEventListener('blur',function(){
    var value=input.value.trim();
    if(value&&!/^[a-z][a-z\d+.-]*:/i.test(value))value='https://'+value;
    if(value===input.value)return;
    input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  });
});
