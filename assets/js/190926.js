// Desktop split-colour hero: deterministic geometry updates, throttled to animation frames.
document.addEventListener('DOMContentLoaded', function () {
  var hero=document.querySelector('#what-exif-does');
  if(!hero||window.innerWidth<860)return;

  var motionRaf=0,observer=null,geometryRaf=0;
  function initSplitColour(){
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
    function readTarget(){target=Math.max(0,Math.min(1,window.scrollY/Math.max(1,hero.offsetHeight*.72)));}
    function writeMotion(v){var e=1-Math.pow(1-v,3);copy.style.setProperty('--hero-scroll-scale',(1-e*.18).toFixed(5));copy.style.setProperty('--hero-scroll-y',(-(e*42)).toFixed(2)+'px');requestMask();}
    function render(now){motionRaf=0;var dt=Math.min(40,now-lastTime);lastTime=now;current+=(target-current)*(1-Math.exp(-dt/105));if(Math.abs(target-current)<.00035)current=target;writeMotion(current);if(current!==target)motionRaf=requestAnimationFrame(render);}
    function requestMotion(){readTarget();if(!motionRaf){lastTime=performance.now();motionRaf=requestAnimationFrame(render);}}
    writeMotion(0);requestAnimationFrame(function(){requestAnimationFrame(paintMask);});
    window.addEventListener('scroll',requestMotion,{passive:true});window.addEventListener('resize',requestMask,{passive:true});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(requestMask).catch(function(){});
    if(photo.decode)photo.decode().then(requestMask).catch(requestMask);else photo.addEventListener('load',requestMask,{once:true});
    return true;
  }

  if(!initSplitColour()){observer=new MutationObserver(function(){if(initSplitColour()){observer.disconnect();observer=null;}});observer.observe(hero,{childList:true,subtree:true});}
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
  var galleryItems=[['landscape','exif-gallery-01-lounge.webp','Hospitality lounge'],['portrait','exif-gallery-02-orchid-dining.webp','Orchid dining detail'],['landscape','exif-gallery-03-terrace-hammock.webp','Terrace and hammock'],['portrait','exif-gallery-04-restaurant-interior.webp','Restaurant interior'],['portrait','exif-gallery-05-basketball-court.webp','Basketball court'],['portrait','exif-gallery-06-restaurant-reflection.webp','Restaurant reflection'],['portrait','exif-gallery-07-table-tennis.webp','Table tennis'],['landscape','exif-gallery-08-pool-loungers.webp','Pool loungers'],['portrait','exif-gallery-09-sunset-ocean.webp','Sunset over the ocean'],['portrait','exif-gallery-10-beach-golden-hour.webp','Beach at golden hour'],['portrait','exif-gallery-11-guests-walking.webp','Guests walking through tropical gardens'],['portrait','exif-gallery-12-pool-ocean-view.webp','Pool and ocean view'],['portrait','exif-gallery-13-tropical-leaves.webp','Tropical leaves']];
  var galleryAssetVersion='42766d4';
  function makeItems(hidden){return galleryItems.map(function(item,index){var sizeClass='gallery-slot-'+((index%13)+1);return '<figure class="motion-gallery-item '+item[0]+' '+sizeClass+'"'+(hidden?' aria-hidden="true"':'')+'><img src="/assets/img/'+item[1]+'?v='+galleryAssetVersion+'" alt="'+(hidden?'':item[2])+'" loading="lazy" decoding="async"></figure>';}).join('')}
  var galleryMarkup=makeItems(false)+makeItems(true)+makeItems(true);
  oldWork.outerHTML='<section class="gallery-chapter" id="selected-work" aria-label="Photography"><div class="gallery-green-rise" aria-hidden="true"></div><div class="gallery-signal-stage" aria-hidden="true"><div class="gallery-signal"><span class="signal-dot signal-dot-ring-sm"></span><span class="signal-dot signal-dot-ring-md"></span><span class="signal-dot signal-dot-solid-md"></span><span class="signal-dot signal-dot-solid-lg"></span><span class="signal-dot signal-dot-solid-md"></span><span class="signal-dot signal-dot-ring-md"></span><span class="signal-dot signal-dot-ring-sm"></span></div></div><div class="motion-gallery-controls" aria-label="Gallery navigation"><button type="button" data-gallery-step="prev" aria-label="Previous images">←</button><button type="button" data-gallery-step="next" aria-label="Next images">→</button></div><div class="motion-gallery"><div class="motion-gallery-viewport"><div class="motion-gallery-track">'+galleryMarkup+'</div></div></div></section>';
});
