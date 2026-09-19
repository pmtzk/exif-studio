// 180902 — restrained motion + a small working-interface moment.
document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll('.reveal, .reveal-media');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  var signals = document.querySelectorAll('.signal[data-panel]');
  var panels = document.querySelectorAll('.canvas-panel[data-content]');
  signals.forEach(function (signal) {
    signal.addEventListener('click', function () {
      var target = signal.getAttribute('data-panel');
      signals.forEach(function (item) { item.classList.remove('active'); });
      panels.forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-content') === target); });
      signal.classList.add('active');
    });
  });

  var steps = document.querySelectorAll('.sequence-step');
  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      steps.forEach(function (item) { item.classList.remove('active'); });
      step.classList.add('active');
    });
  });

  /* HERO ONLY — cream loader -> image cuts -> full bleed -> title reveal. */
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;

  var finalImage = 'https://raw.githubusercontent.com/pmtzk/exif-studio/dfad59a8809948b4537c4e8be36be13348dd0235/assets/img/exif-fullbleed.jpg';
  var frames = [
    'assets/img/work-chair-detail.jpg',
    'assets/img/work-window-reflection.jpg',
    'assets/img/work-human-moment.jpg',
    'assets/img/work-open-air-space.jpg',
    'assets/img/work-restaurant-atmosphere.jpg',
    'assets/img/hero-couch-doorway.jpg',
    'assets/img/work-exterior-view.jpg',
    finalImage
  ];

  var style = document.createElement('style');
  style.textContent = `
    body.exif-intro-running{overflow:hidden}
    .site-header{transition:opacity .65s ease,background .5s ease,border-color .5s ease}
    body.exif-intro-running .site-header{opacity:0;pointer-events:none}
    body.exif-hero-live .site-header{background:transparent;border-color:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}
    body.exif-hero-live .site-header .brand-logo{filter:brightness(0) invert(1)}
    body.exif-hero-live .site-header .nav-toggle span{background:#f0e8dd}
    body.exif-hero-live .main-nav>a{color:#f0e8dd}

    .exif-loader{position:fixed;inset:0;z-index:9998;background:#f0e8dd;display:grid;place-items:center;overflow:hidden;opacity:1;transition:opacity .55s cubic-bezier(.22,.61,.36,1)}
    .exif-loader.is-gone{opacity:0;pointer-events:none}
    .exif-loader-stage{position:relative;width:14px;height:14px;background:#1c362a;overflow:hidden;transition:width .58s cubic-bezier(.16,1,.3,1),height .58s cubic-bezier(.16,1,.3,1),transform .58s cubic-bezier(.16,1,.3,1)}
    .exif-loader-stage.is-window{width:min(42vw,220px);height:min(30vw,150px)}
    .exif-loader-stage.is-full{width:100vw;height:100svh}
    .exif-loader-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.04)}
    .exif-loader-stage img.is-active{opacity:1;transform:scale(1);transition:opacity .055s linear,transform .28s ease-out}
    .exif-loader-count{position:fixed;left:50%;bottom:7vh;transform:translateX(-50%);font:500 9px/1 'Jost',sans-serif;letter-spacing:.16em;color:#1c362a;opacity:0;transition:opacity .3s ease}
    .exif-loader.is-sequencing .exif-loader-count{opacity:.55}

    #what-exif-does.exif-cinematic-hero{position:relative;padding:0!important;height:100vh;height:100svh;min-height:100svh;overflow:hidden;background:#1c362a}
    #what-exif-does.exif-cinematic-hero>.wrap{width:100%;max-width:none;height:100%;padding:0!important;margin:0}
    #what-exif-does.exif-cinematic-hero .hero-intro,#what-exif-does.exif-cinematic-hero .hero-interface{display:none!important}
    .exif-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}
    .exif-hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,14,10,.04) 25%,rgba(5,14,10,.12) 58%,rgba(5,14,10,.34) 100%)}
    .exif-hero-copy{position:absolute;left:max(5vw,28px);right:max(5vw,28px);bottom:clamp(3.2rem,8vh,7rem);z-index:2;color:#f0e8dd}
    .exif-hero-copy h1{margin:0;font-family:var(--font-serif);font-size:clamp(4rem,10.8vw,10.8rem);font-weight:400;line-height:.78;letter-spacing:-.055em;text-transform:uppercase;max-width:10ch}
    .exif-hero-copy .line{display:block;overflow:hidden;padding-bottom:.07em}
    .exif-hero-copy .line:nth-child(2){padding-left:clamp(2rem,12vw,12rem)}
    .exif-hero-copy .line:last-child{font-style:italic;letter-spacing:-.065em}
    .exif-hero-copy .word{display:block;transform:translateY(115%);transition:transform 1.05s cubic-bezier(.16,1,.3,1)}
    .exif-hero-copy.is-visible .word{transform:translateY(0)}
    .exif-hero-copy.is-visible .line:nth-child(2) .word{transition-delay:.09s}
    .exif-hero-copy.is-visible .line:nth-child(3) .word{transition-delay:.18s}
    .exif-hero-meta{display:flex;justify-content:space-between;align-items:end;margin-top:1.35rem;font:500 9px/1.25 'Jost',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:0;transform:translateY(8px);transition:opacity .7s ease .65s,transform .7s ease .65s}
    .exif-hero-copy.is-visible .exif-hero-meta{opacity:.78;transform:none}
    @media(max-width:859px){
      .exif-loader-stage.is-window{width:38vw;height:28vw}
      .exif-hero-copy{bottom:7vh}
      .exif-hero-copy h1{font-size:clamp(3.25rem,14.2vw,6.3rem);line-height:.8;max-width:8.2ch}
      .exif-hero-copy .line:nth-child(2){padding-left:9vw}
      .exif-hero-meta{font-size:7px;letter-spacing:.12em}
    }
    @media(prefers-reduced-motion:reduce){.exif-loader{display:none}.exif-hero-copy .word{transform:none}.exif-hero-meta{opacity:.78;transform:none}}
  `;
  document.head.appendChild(style);

  hero.classList.add('exif-cinematic-hero');
  hero.querySelector('.wrap').insertAdjacentHTML('beforeend',
    '<img class="exif-hero-bg" src="'+finalImage+'" alt="Hospitality property at sunset">'+
    '<div class="exif-hero-shade" aria-hidden="true"></div>'+
    '<div class="exif-hero-copy"><h1><span class="line"><span class="word">A PLACE,</span></span><span class="line"><span class="word">MADE</span></span><span class="line"><span class="word">UNMISTAKABLE.</span></span></h1><div class="exif-hero-meta"><span>EXIF STUDIO</span><span>Mexico + Caribbean</span></div></div>'
  );

  if (reduced) {
    document.body.classList.add('exif-hero-live');
    hero.querySelector('.exif-hero-copy').classList.add('is-visible');
    return;
  }

  document.body.classList.add('exif-intro-running');
  var loader = document.createElement('div');
  loader.className = 'exif-loader';
  loader.setAttribute('aria-hidden','true');
  loader.innerHTML = '<div class="exif-loader-stage"></div><span class="exif-loader-count">EXIF / LOADING</span>';
  document.body.appendChild(loader);
  var stage = loader.querySelector('.exif-loader-stage');
  var imgs = frames.map(function(src){
    var img=document.createElement('img'); img.src=src; img.alt=''; stage.appendChild(img); return img;
  });
  frames.forEach(function(src){ var preload=new Image(); preload.src=src; });

  setTimeout(function(){
    stage.classList.add('is-window');
    loader.classList.add('is-sequencing');
  },420);

  setTimeout(function(){
    var i=0;
    function flash(){
      imgs.forEach(function(img){img.classList.remove('is-active');});
      imgs[i].classList.add('is-active');
      i++;
      if(i<imgs.length){setTimeout(flash,115);}else{
        loader.classList.remove('is-sequencing');
        setTimeout(function(){
          stage.classList.add('is-full');
          setTimeout(function(){
            document.body.classList.add('exif-hero-live');
            loader.classList.add('is-gone');
            document.body.classList.remove('exif-intro-running');
            hero.querySelector('.exif-hero-copy').classList.add('is-visible');
            setTimeout(function(){loader.remove();},650);
          },720);
        },260);
      }
    }
    flash();
  },1050);
});
