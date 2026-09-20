// 180902 — restrained motion + working-interface interactions.
document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll('.reveal, .reveal-media');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) elements.forEach(function(el){el.classList.add('is-visible');});
  else {var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');observer.unobserve(entry.target);});},{threshold:.12,rootMargin:'0px 0px -5% 0px'});elements.forEach(function(el){observer.observe(el);});}
  var signals=document.querySelectorAll('.signal[data-panel]'),panels=document.querySelectorAll('.canvas-panel[data-content]');signals.forEach(function(signal){signal.addEventListener('click',function(){var target=signal.getAttribute('data-panel');signals.forEach(function(item){item.classList.remove('active');});panels.forEach(function(panel){panel.classList.toggle('active',panel.getAttribute('data-content')===target);});signal.classList.add('active');});});
  var steps=document.querySelectorAll('.sequence-step');steps.forEach(function(step){step.addEventListener('click',function(){steps.forEach(function(item){item.classList.remove('active');});step.classList.add('active');});});
  var hero=document.querySelector('#what-exif-does');if(!hero)return;

  var mobileStyle=document.createElement('style');mobileStyle.textContent=`
    @media(max-width:859px){
      body.exif-intro-running{overflow:hidden}.site-header{transition:opacity .8s ease,background .35s ease,border-color .35s ease}body.exif-intro-running .site-header{opacity:0;pointer-events:none}body.exif-hero-live .site-header{position:absolute!important;top:0!important;left:0!important;right:0!important;width:100%!important;z-index:30!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;height:auto!important;padding-top:env(safe-area-inset-top)}body.exif-hero-live:not(.nav-open) .site-header .brand-logo{filter:brightness(0) invert(1);opacity:.96}body.exif-hero-live:not(.nav-open) .site-header .nav-toggle span{background:#f0e8dd!important}body.exif-hero-live:not(.nav-open) .site-header .main-nav:not(.open){display:none!important}body.exif-hero-live .site-header .wrap{padding-left:28px!important;padding-right:28px!important;min-height:88px!important}body.exif-hero-live .site-header .brand-logo{width:72px!important;height:auto!important}
      .exif-loader{position:fixed;inset:0;z-index:9998;background:#f0e8dd;display:grid;place-items:center;overflow:hidden;opacity:1;transition:opacity .8s cubic-bezier(.22,.61,.36,1)}.exif-loader.is-gone{opacity:0;pointer-events:none}.exif-loader-stage{position:relative;width:12px;height:12px;background:#1c362a;overflow:hidden;will-change:width,height;transition:width 1.32s cubic-bezier(.76,0,.24,1),height 1.32s cubic-bezier(.76,0,.24,1)!important}.exif-loader-stage.is-window{width:min(44vw,220px)!important;height:min(31vw,155px)!important}.exif-loader-stage.is-hero{width:100vw!important;height:100svh!important}.exif-loader-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:none!important;transition:opacity .08s linear!important}.exif-loader-stage img.is-active{opacity:1;transform:none!important}.exif-loader-stage img.is-final-frame{transform:none!important;transition:none!important}
      #what-exif-does.exif-cinematic-hero{position:relative!important;padding:0!important;margin:0!important;height:100svh!important;min-height:100svh!important;overflow:hidden!important;background:#1c362a}#what-exif-does.exif-cinematic-hero>.wrap{position:relative;width:100%!important;max-width:none!important;height:100%!important;padding:0!important;margin:0!important}#what-exif-does.exif-cinematic-hero .hero-intro,#what-exif-does.exif-cinematic-hero .hero-interface{display:none!important}.exif-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:54% center;display:block}.exif-hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,14,10,.10) 0%,rgba(5,14,10,.015) 42%,rgba(5,14,10,.27) 100%)}.exif-hero-copy{position:absolute;left:28px!important;right:24px!important;bottom:max(5.3vh,40px)!important;z-index:2;color:#f0e8dd}.exif-hero-copy h1{margin:0;color:#f0e8dd;font-family:var(--font-serif);width:100%!important;max-width:none!important;font-size:clamp(3.15rem,13vw,5.8rem)!important;font-weight:400;line-height:.80!important;letter-spacing:-.055em!important;text-transform:uppercase}.exif-hero-copy .line{display:block;overflow:hidden;padding-bottom:.07em}.exif-hero-copy .line:nth-child(2){padding-left:7.5vw!important}.exif-hero-copy .line:last-child{font-style:italic;letter-spacing:-.065em;padding-right:0!important}.exif-hero-copy .line:last-child .word{font-size:clamp(2.62rem,10.65vw,4.8rem)!important;letter-spacing:-.065em!important;white-space:nowrap!important}.exif-hero-copy .word{display:block;opacity:0;transform:translateY(38px);filter:blur(3px);transition:opacity 1.35s ease,transform 1.35s cubic-bezier(.16,1,.3,1),filter 1.35s ease}.exif-hero-copy.is-visible .word{opacity:1;transform:none;filter:blur(0)}.exif-hero-copy.is-visible .line:nth-child(2) .word{transition-delay:.13s}.exif-hero-copy.is-visible .line:nth-child(3) .word{transition-delay:.26s}.exif-hero-meta{display:flex;justify-content:space-between;align-items:end;margin-top:1.35rem;font:500 7px/1.25 'Jost',sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:0;transform:translateY(8px);transition:opacity 1s ease .85s,transform 1s ease .85s}.exif-hero-copy.is-visible .exif-hero-meta{opacity:.82;transform:none}.exif-hero-title-cream{display:none!important}
    }@media(max-width:859px) and (prefers-reduced-motion:reduce){.exif-loader{display:none}.exif-hero-copy .word{opacity:1;transform:none;filter:none}.exif-hero-meta{opacity:.82;transform:none}}
  `;document.head.appendChild(mobileStyle);

  var finalImage='https://raw.githubusercontent.com/pmtzk/exif-studio/dfad59a8809948b4537c4e8be36be13348dd0235/assets/img/exif-fullbleed.jpg';
  var frames=['assets/img/work-chair-detail.jpg','assets/img/work-window-reflection.jpg','assets/img/work-human-moment.jpg','assets/img/work-open-air-space.jpg','assets/img/work-restaurant-atmosphere.jpg','assets/img/hero-couch-doorway.jpg','assets/img/work-exterior-view.jpg',finalImage];
  hero.classList.add('exif-cinematic-hero');hero.querySelector('.wrap').insertAdjacentHTML('beforeend','<img class="exif-hero-bg" src="'+finalImage+'" alt="Hospitality property at sunset"><div class="exif-hero-shade" aria-hidden="true"></div><div class="exif-hero-copy"><h1><span class="line"><span class="word">A PLACE,</span></span><span class="line"><span class="word">MADE</span></span><span class="line"><span class="word">UNMISTAKABLE.</span></span></h1><div class="exif-hero-meta"><span>SIGNAL</span><span>MEXICO + CARIBBEAN</span></div></div>');
  var heroBg=hero.querySelector('.exif-hero-bg');function setHeroHeaderState(){if(window.scrollY<Math.max(80,hero.offsetHeight-90))document.body.classList.add('exif-hero-live');else document.body.classList.remove('exif-hero-live');}
  if(reduced){document.body.classList.add('exif-hero-live');hero.querySelector('.exif-hero-copy').classList.add('is-visible');window.addEventListener('scroll',setHeroHeaderState,{passive:true});return;}

  document.body.classList.add('exif-intro-running');var loader=document.createElement('div');loader.className='exif-loader';loader.setAttribute('aria-hidden','true');loader.innerHTML='<div class="exif-loader-stage"></div>';document.body.appendChild(loader);
  var stage=loader.querySelector('.exif-loader-stage');var imgs=frames.map(function(src){var img=document.createElement('img');img.src=src;img.alt='';stage.appendChild(img);return img;});frames.forEach(function(src){var preload=new Image();preload.src=src;});

  function finishDesktopHandoff(layer){
    heroBg.style.visibility='';
    layer.style.transition='opacity 140ms linear';layer.style.opacity='0';
    setTimeout(function(){layer.remove();loader.remove();document.body.classList.remove('exif-intro-running');document.body.classList.add('exif-hero-live');hero.dispatchEvent(new CustomEvent('exif:hero-image-ready'));requestAnimationFrame(function(){requestAnimationFrame(function(){hero.querySelector('.exif-hero-copy').classList.add('is-visible');});});window.addEventListener('scroll',setHeroHeaderState,{passive:true});},145);
  }
  function coverGeometry(boxW,boxH,imgW,imgH,posX,posY){
    var scale=Math.max(boxW/imgW,boxH/imgH),w=imgW*scale,h=imgH*scale;
    return {w:w,h:h,x:(boxW-w)*posX,y:(boxH-h)*posY};
  }
  function expandDesktopOnce(){
    var from=stage.getBoundingClientRect(),to=heroBg.getBoundingClientRect(),finalFrame=imgs[imgs.length-1];
    var iw=finalFrame.naturalWidth||heroBg.naturalWidth||1,ih=finalFrame.naturalHeight||heroBg.naturalHeight||1;
    /* Loader crop is centered. Desktop hero CSS uses center/center. Calculate both
       cover rectangles once so object-fit never gets a chance to recrop mid-flight. */
    var source=coverGeometry(from.width,from.height,iw,ih,.5,.5),dest=coverGeometry(to.width,to.height,iw,ih,.5,.5);
    var layer=document.createElement('div');layer.setAttribute('aria-hidden','true');
    layer.style.cssText='position:fixed;z-index:9999;overflow:hidden;pointer-events:none;left:'+from.left+'px;top:'+from.top+'px;width:'+from.width+'px;height:'+from.height+'px;will-change:left,top,width,height;contain:layout paint;';
    var img=document.createElement('img');img.src=finalFrame.currentSrc||finalFrame.src;img.alt='';
    img.style.cssText='position:absolute;max-width:none;opacity:1;will-change:left,top,width,height;';
    img.style.left=source.x+'px';img.style.top=source.y+'px';img.style.width=source.w+'px';img.style.height=source.h+'px';layer.appendChild(img);document.body.appendChild(layer);
    stage.style.visibility='hidden';
    var timing={duration:1320,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'};
    var frameAnim=layer.animate([{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'},{left:to.left+'px',top:to.top+'px',width:to.width+'px',height:to.height+'px'}],timing);
    var imageAnim=img.animate([{left:source.x+'px',top:source.y+'px',width:source.w+'px',height:source.h+'px'},{left:dest.x+'px',top:dest.y+'px',width:dest.w+'px',height:dest.h+'px'}],timing);
    Promise.all([frameAnim.finished,imageAnim.finished]).then(function(){finishDesktopHandoff(layer);}).catch(function(){finishDesktopHandoff(layer);});
  }

  setTimeout(function(){stage.classList.add('is-window');},420);
  setTimeout(function(){var i=0;function flash(){imgs.forEach(function(img){img.classList.remove('is-active');});imgs[i].classList.add('is-active');i+=1;if(i<imgs.length){setTimeout(flash,125);return;}
    var finalFrame=imgs[imgs.length-1];finalFrame.classList.add('is-final-frame');
    if(window.innerWidth>=860){requestAnimationFrame(function(){requestAnimationFrame(expandDesktopOnce);});return;}
    requestAnimationFrame(function(){stage.classList.add('is-hero');});
    var onExpanded=function(event){if(event.target!==stage||event.propertyName!=='width')return;stage.removeEventListener('transitionend',onExpanded);document.body.classList.add('exif-hero-live');loader.classList.add('is-gone');document.body.classList.remove('exif-intro-running');setTimeout(function(){hero.querySelector('.exif-hero-copy').classList.add('is-visible');},300);setTimeout(function(){loader.remove();},900);window.addEventListener('scroll',setHeroHeaderState,{passive:true});};stage.addEventListener('transitionend',onExpanded);
  }flash();},1050);
});
