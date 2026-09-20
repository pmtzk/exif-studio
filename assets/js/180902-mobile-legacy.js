// Mobile hero restored from the approved 180902-refine behavior.
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth >= 860) return;
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finalImage = 'https://raw.githubusercontent.com/pmtzk/exif-studio/dfad59a8809948b4537c4e8be36be13348dd0235/assets/img/exif-fullbleed.jpg';
  var frames = ['assets/img/work-chair-detail.jpg','assets/img/work-window-reflection.jpg','assets/img/work-human-moment.jpg','assets/img/work-open-air-space.jpg','assets/img/work-restaurant-atmosphere.jpg','assets/img/hero-couch-doorway.jpg','assets/img/work-exterior-view.jpg',finalImage];

  var style = document.createElement('style');
  style.textContent = `
    @media(max-width:859px){
      body.exif-mobile-legacy.exif-intro-running{overflow:hidden}
      body.exif-mobile-legacy .site-header{transition:opacity .8s ease,background .35s ease,border-color .35s ease}
      body.exif-mobile-legacy.exif-intro-running .site-header{opacity:0;pointer-events:none}
      body.exif-mobile-legacy.exif-hero-live .site-header{position:absolute!important;top:0!important;left:0!important;right:0!important;width:100%!important;z-index:30!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;height:auto!important;padding-top:env(safe-area-inset-top)}
      /* The persistent header renders its logo through the masked ::before. Never reveal the old
         green bitmap over the hero: that was the green mark visible until the rail state took over. */
      body.exif-mobile-legacy.exif-hero-live:not(.nav-open) .site-header .brand-logo{visibility:hidden!important;opacity:0!important;filter:none!important}
      body.exif-mobile-legacy.exif-hero-live:not(.nav-open) .site-header .wrap>a:first-child::before{background:#f0e8dd!important}
      body.exif-mobile-legacy.exif-hero-live:not(.nav-open) .site-header .nav-toggle span{background:#f0e8dd!important}
      body.exif-mobile-legacy.exif-hero-live:not(.nav-open) .site-header .main-nav:not(.open){display:none!important}
      body.exif-mobile-legacy.exif-hero-live .site-header .wrap{padding-left:28px!important;padding-right:28px!important;min-height:88px!important}
      body.exif-mobile-legacy #what-exif-does.exif-cinematic-hero{position:relative!important;padding:0!important;margin:0!important;height:100svh!important;min-height:100svh!important;overflow:hidden!important;background:#1c362a!important}
      body.exif-mobile-legacy #what-exif-does.exif-cinematic-hero>.wrap{position:relative!important;width:100%!important;max-width:none!important;height:100%!important;padding:0!important;margin:0!important}
      body.exif-mobile-legacy #what-exif-does.exif-cinematic-hero .hero-intro,body.exif-mobile-legacy #what-exif-does.exif-cinematic-hero .hero-interface{display:none!important}
      body.exif-mobile-legacy .exif-hero-bg{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:54% center!important;display:block!important}
      body.exif-mobile-legacy .exif-hero-shade{position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(5,14,10,.10) 0%,rgba(5,14,10,.015) 42%,rgba(5,14,10,.27) 100%)!important}
      body.exif-mobile-legacy .exif-hero-copy{position:absolute!important;left:28px!important;right:24px!important;bottom:max(5.5vh,42px)!important;z-index:2!important;color:#f0e8dd!important}
      body.exif-mobile-legacy .exif-hero-copy h1{margin:0!important;color:#f0e8dd!important;font-family:var(--font-serif)!important;font-size:clamp(3rem,13.2vw,5.9rem)!important;font-weight:400!important;line-height:.81!important;letter-spacing:-.055em!important;text-transform:uppercase!important;max-width:8.6ch!important}
      body.exif-mobile-legacy .exif-hero-copy .line{display:block!important;overflow:hidden!important;padding-bottom:.07em!important}
      body.exif-mobile-legacy .exif-hero-copy .line:nth-child(2){padding-left:8vw!important}
      body.exif-mobile-legacy .exif-hero-copy .line:last-child{font-style:italic!important;letter-spacing:-.065em!important}
      body.exif-mobile-legacy .exif-hero-copy .line:last-child .word{font-size:1em!important;white-space:normal!important}
      body.exif-mobile-legacy .exif-hero-copy .word{display:block;opacity:0;transform:translateY(38px);filter:blur(3px);transition:opacity 1.35s ease,transform 1.35s cubic-bezier(.16,1,.3,1),filter 1.35s ease}
      body.exif-mobile-legacy .exif-hero-copy.is-visible .word{opacity:1;transform:none;filter:blur(0)}
      body.exif-mobile-legacy .exif-hero-copy.is-visible .line:nth-child(2) .word{transition-delay:.13s}
      body.exif-mobile-legacy .exif-hero-copy.is-visible .line:nth-child(3) .word{transition-delay:.26s}
      body.exif-mobile-legacy .exif-hero-meta{display:flex!important;justify-content:space-between!important;align-items:end!important;margin-top:1.35rem!important;font:500 7px/1.25 'Jost',sans-serif!important;letter-spacing:.12em!important;text-transform:uppercase!important;opacity:0;transform:translateY(8px);transition:opacity 1s ease .85s,transform 1s ease .85s;color:#f0e8dd!important}
      body.exif-mobile-legacy .exif-hero-copy.is-visible .exif-hero-meta{opacity:.82;transform:none}
      body.exif-mobile-legacy .exif-hero-title-cream{display:none!important}
      body.exif-mobile-legacy .exif-loader{position:fixed!important;inset:0!important;z-index:9998!important;background:#f0e8dd!important;display:grid!important;place-items:center!important;overflow:hidden!important;opacity:1;transition:opacity .8s cubic-bezier(.22,.61,.36,1)}
      body.exif-mobile-legacy .exif-loader.is-gone{opacity:0;pointer-events:none}
      body.exif-mobile-legacy .exif-loader-stage{position:relative!important;width:12px!important;height:12px!important;background:#1c362a!important;overflow:hidden!important;transition:width 1.15s cubic-bezier(.76,0,.24,1),height 1.15s cubic-bezier(.76,0,.24,1)!important}
      body.exif-mobile-legacy .exif-loader-stage.is-window{width:38vw!important;height:28vw!important}
      body.exif-mobile-legacy .exif-loader-stage.is-full{width:100vw!important;height:100svh!important}
      body.exif-mobile-legacy .exif-loader-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.035)}
      body.exif-mobile-legacy .exif-loader-stage img.is-active{opacity:1;transform:scale(1);transition:opacity .08s linear,transform .38s ease-out}
      body.exif-mobile-legacy .exif-loader-count{position:fixed;left:50%;bottom:7vh;transform:translateX(-50%);font:500 9px/1 'Jost',sans-serif;letter-spacing:.16em;color:#1c362a;opacity:0;transition:opacity .3s ease}
      body.exif-mobile-legacy .exif-loader.is-sequencing .exif-loader-count{opacity:.48}
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('exif-mobile-legacy');
  document.body.classList.add('exif-hero-live');

  hero.querySelectorAll('.exif-hero-bg,.exif-hero-shade,.exif-hero-copy').forEach(function(el){el.remove();});
  hero.classList.add('exif-cinematic-hero');
  hero.querySelector('.wrap').insertAdjacentHTML('beforeend','<img class="exif-hero-bg" src="'+finalImage+'" alt="Hospitality property at sunset"><div class="exif-hero-shade" aria-hidden="true"></div><div class="exif-hero-copy"><h1><span class="line"><span class="word">A PLACE,</span></span><span class="line"><span class="word">MADE</span></span><span class="line"><span class="word">UNMISTAKABLE.</span></span></h1><div class="exif-hero-meta"><span>SIGNAL</span><span>MEXICO + CARIBBEAN</span></div></div>');

  function setHeader(){if(window.scrollY < Math.max(80,hero.offsetHeight-90))document.body.classList.add('exif-hero-live');else document.body.classList.remove('exif-hero-live');}
  setHeader();
  if(reduced){hero.querySelector('.exif-hero-copy').classList.add('is-visible');window.addEventListener('scroll',setHeader,{passive:true});return;}

  document.querySelectorAll('.exif-loader').forEach(function(el){el.remove();});
  document.body.classList.add('exif-intro-running');
  var loader=document.createElement('div');loader.className='exif-loader';loader.setAttribute('aria-hidden','true');loader.innerHTML='<div class="exif-loader-stage"></div><span class="exif-loader-count">EXIF / LOADING</span>';document.body.appendChild(loader);
  var stage=loader.querySelector('.exif-loader-stage');
  var imgs=frames.map(function(src){var img=document.createElement('img');img.src=src;img.alt='';stage.appendChild(img);return img;});
  frames.forEach(function(src){var p=new Image();p.src=src;});
  setTimeout(function(){stage.classList.add('is-window');loader.classList.add('is-sequencing');},420);
  setTimeout(function(){var i=0;function flash(){imgs.forEach(function(img){img.classList.remove('is-active');});imgs[i].classList.add('is-active');i++;if(i<imgs.length){setTimeout(flash,125);}else{loader.classList.remove('is-sequencing');setTimeout(function(){stage.classList.add('is-full');setTimeout(function(){document.body.classList.add('exif-hero-live');loader.classList.add('is-gone');document.body.classList.remove('exif-intro-running');setTimeout(function(){hero.querySelector('.exif-hero-copy').classList.add('is-visible');},420);setTimeout(function(){loader.remove();},900);window.addEventListener('scroll',setHeader,{passive:true});},1220);},420);}}flash();},1050);
});