// Homepage reveal observer + cinematic hero/loader runtime.
document.addEventListener('DOMContentLoaded', function () {
  var elements=document.querySelectorAll('.reveal, .reveal-media');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!('IntersectionObserver' in window))elements.forEach(function(el){el.classList.add('is-visible');});
  else{var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');observer.unobserve(entry.target);});},{threshold:.12,rootMargin:'0px 0px -5% 0px'});elements.forEach(function(el){observer.observe(el);});}

  var hero=document.querySelector('#what-exif-does');if(!hero)return;
  var finalImage='assets/img/exif-fullbleed.jpg';
  var frames=['assets/img/loader-frame-01.webp','assets/img/exif-gallery-03-terrace-hammock.webp','assets/img/loader-frame-02.webp','assets/img/exif-gallery-06-restaurant-reflection.webp','assets/img/exif-gallery-09-sunset-ocean.webp','assets/img/exif-gallery-11-guests-walking.webp',finalImage];
  function currentLang(){try{return localStorage.getItem('exif-language')==='es'?'es':'en'}catch(e){return'en'}}
  function heroTitle(lang){return lang==='es'?'<span class="line"><span class="word">UN LUGAR,</span></span><span class="line"><span class="word">INCONFUNDIBLE.</span></span>':'<span class="line"><span class="word">A PLACE,</span></span><span class="line"><span class="word">MADE</span></span><span class="line"><span class="word">UNMISTAKABLE.</span></span>'}

  hero.classList.add('exif-cinematic-hero');
  hero.querySelector('.wrap').insertAdjacentHTML('beforeend','<img class="exif-hero-bg" src="'+finalImage+'" alt="Hospitality property at sunset" fetchpriority="high" decoding="async"><div class="exif-hero-shade" aria-hidden="true"></div><div class="exif-hero-copy"><h1>'+heroTitle(currentLang())+'</h1><div class="exif-hero-meta"><span>SIGNAL</span><span>BASED IN MEXICO / WORKING WHERE THE PLACE TAKES US.</span></div></div>');

  var heroBg=hero.querySelector('.exif-hero-bg');
  function setHeroHeaderState(){if(window.scrollY<Math.max(80,hero.offsetHeight-90))document.body.classList.add('exif-hero-live');else document.body.classList.remove('exif-hero-live');}
  function applyHeroLanguage(lang){
    var markup=heroTitle(lang),green=hero.querySelector('.exif-hero-title-green'),cream=hero.querySelector('.exif-hero-title-cream'),plain=hero.querySelector('.exif-hero-copy h1:not(.exif-hero-title-green):not(.exif-hero-title-cream)');
    if(green)green.innerHTML=markup;if(cream)cream.innerHTML=markup;if(plain)plain.innerHTML=markup;
    var meta=hero.querySelectorAll('.exif-hero-meta span');if(meta[0])meta[0].textContent=lang==='es'?'SEÑAL':'SIGNAL';if(meta[1])meta[1].textContent=lang==='es'?'CON BASE EN MÉXICO / TRABAJANDO DONDE EL LUGAR NOS LLEVE.':'BASED IN MEXICO / WORKING WHERE THE PLACE TAKES US.';
  }
  window.addEventListener('exif:languagechange',function(e){applyHeroLanguage(e.detail&&e.detail.lang==='es'?'es':'en');});

  if(reduced||document.body.classList.contains('exif-returning')){document.body.classList.add('exif-hero-live');var copy=hero.querySelector('.exif-hero-copy');if(copy)copy.classList.add('is-visible');window.addEventListener('scroll',setHeroHeaderState,{passive:true});return;}

  document.body.classList.add('exif-intro-running');
  var loader=document.createElement('div');loader.className='exif-loader';loader.setAttribute('aria-hidden','true');loader.innerHTML='<div class="exif-loader-stage"></div>';document.body.appendChild(loader);
  var stage=loader.querySelector('.exif-loader-stage');
  var imgs=frames.map(function(src,index){var img=document.createElement('img');img.src=src;img.alt='';img.decoding='sync';if(index===frames.length-1)img.fetchPriority='high';stage.appendChild(img);return img;});

  function finishDesktopHandoff(layer){
    heroBg.style.visibility='';loader.style.setProperty('transition','none','important');loader.style.setProperty('background','transparent','important');stage.style.visibility='hidden';
    requestAnimationFrame(function(){layer.style.transition='opacity 120ms linear';layer.style.opacity='0';setTimeout(function(){layer.remove();loader.remove();document.body.classList.remove('exif-intro-running');document.body.classList.add('exif-hero-live');hero.dispatchEvent(new CustomEvent('exif:hero-image-ready'));requestAnimationFrame(function(){requestAnimationFrame(function(){hero.querySelector('.exif-hero-copy').classList.add('is-visible');});});window.addEventListener('scroll',setHeroHeaderState,{passive:true});},125);});
  }

  function coverGeometry(boxW,boxH,imgW,imgH,posX,posY){var scale=Math.max(boxW/imgW,boxH/imgH),w=imgW*scale,h=imgH*scale;return{w:w,h:h,x:(boxW-w)*posX,y:(boxH-h)*posY};}

  function expandDesktopOnce(){
    var from=stage.getBoundingClientRect(),to=heroBg.getBoundingClientRect(),finalFrame=imgs[imgs.length-1];
    var iw=finalFrame.naturalWidth||heroBg.naturalWidth||1,ih=finalFrame.naturalHeight||heroBg.naturalHeight||1;
    var source=coverGeometry(from.width,from.height,iw,ih,.5,.5),dest=coverGeometry(to.width,to.height,iw,ih,.5,.5);
    var layer=document.createElement('div');layer.setAttribute('aria-hidden','true');layer.style.cssText='position:fixed;z-index:9999;overflow:hidden;pointer-events:none;left:'+from.left+'px;top:'+from.top+'px;width:'+from.width+'px;height:'+from.height+'px;will-change:left,top,width,height;contain:layout paint;';
    var img=document.createElement('img');img.src=finalFrame.currentSrc||finalFrame.src;img.alt='';img.style.cssText='position:absolute;max-width:none;opacity:1;will-change:left,top,width,height;';img.style.left=source.x+'px';img.style.top=source.y+'px';img.style.width=source.w+'px';img.style.height=source.h+'px';layer.appendChild(img);document.body.appendChild(layer);stage.style.visibility='hidden';
    var timing={duration:1320,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'};
    var frameAnim=layer.animate([{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'},{left:to.left+'px',top:to.top+'px',width:to.width+'px',height:to.height+'px'}],timing);
    var imageAnim=img.animate([{left:source.x+'px',top:source.y+'px',width:source.w+'px',height:source.h+'px'},{left:dest.x+'px',top:dest.y+'px',width:dest.w+'px',height:dest.h+'px'}],timing);
    Promise.all([frameAnim.finished,imageAnim.finished]).then(function(){finishDesktopHandoff(layer);}).catch(function(){finishDesktopHandoff(layer);});
  }

  setTimeout(function(){stage.classList.add('is-window');},420);
  setTimeout(function(){
    var i=0;
    function flash(){
      imgs.forEach(function(img){img.classList.remove('is-active');});imgs[i].classList.add('is-active');i+=1;
      if(i<imgs.length){setTimeout(flash,125);return;}
      var finalFrame=imgs[imgs.length-1];finalFrame.classList.add('is-final-frame');
      if(window.innerWidth>=860){requestAnimationFrame(function(){requestAnimationFrame(expandDesktopOnce);});return;}
      requestAnimationFrame(function(){stage.classList.add('is-hero');});
      var onExpanded=function(event){if(event.target!==stage||event.propertyName!=='width')return;stage.removeEventListener('transitionend',onExpanded);document.body.classList.add('exif-hero-live');loader.classList.add('is-gone');document.body.classList.remove('exif-intro-running');setTimeout(function(){hero.querySelector('.exif-hero-copy').classList.add('is-visible');},300);setTimeout(function(){loader.remove();},900);window.addEventListener('scroll',setHeroHeaderState,{passive:true});};
      stage.addEventListener('transitionend',onExpanded);
    }
    flash();
  },1050);
});
