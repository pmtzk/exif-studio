// Desktop split-colour hero: deterministic overlap + scroll motion.
document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;
  if (window.innerWidth < 860) { var legacy=document.createElement('script');legacy.src='assets/js/180902-mobile-legacy.js';legacy.defer=true;document.body.appendChild(legacy);return; }

  var initialized=false,raf=0,scrollRaf=0;
  function setup(){
    if(initialized)return true;
    var copy=hero.querySelector('.exif-hero-copy');
    var original=copy&&copy.querySelector('h1:not(.exif-hero-title-cream)');
    if(!copy||!original)return false;
    original.classList.add('exif-hero-title-green');
    var cream=original.cloneNode(true);cream.classList.remove('exif-hero-title-green');cream.classList.add('exif-hero-title-cream');cream.setAttribute('aria-hidden','true');cream.style.visibility='hidden';copy.insertBefore(cream,original.nextSibling);

    function paintMaskNow(){
      var photo=hero.querySelector('.exif-hero-bg');if(!photo)return;
      var t=original.getBoundingClientRect(),p=photo.getBoundingClientRect();
      var x1=Math.max(t.left,p.left),y1=Math.max(t.top,p.top),x2=Math.min(t.right,p.right),y2=Math.min(t.bottom,p.bottom);
      if(x2<=x1||y2<=y1||t.width<=0||t.height<=0){cream.style.clipPath='inset(100% 100% 100% 100%)';cream.style.webkitClipPath=cream.style.clipPath;cream.style.visibility='';return;}
      var left=((x1-t.left)/t.width)*100,right=((x2-t.left)/t.width)*100,top=((y1-t.top)/t.height)*100,bottom=((y2-t.top)/t.height)*100;
      var polygon='polygon('+left+'% '+top+'%, '+right+'% '+top+'%, '+right+'% '+bottom+'%, '+left+'% '+bottom+'%)';cream.style.clipPath=polygon;cream.style.webkitClipPath=polygon;cream.style.visibility='';
    }
    function paintMask(){cancelAnimationFrame(raf);raf=requestAnimationFrame(paintMaskNow)}
    function readyPaint(){requestAnimationFrame(function(){requestAnimationFrame(paintMask)})}

    /* Stable first-load state. Resize only recomputes geometry; it never changes
       the intended visual state. Scroll is the sole motion input. */
    function applyScrollState(){
      scrollRaf=0;
      var range=Math.max(1,hero.offsetHeight*.72);
      var progress=Math.max(0,Math.min(1,window.scrollY/range));
      var eased=1-Math.pow(1-progress,3);
      var scale=1-(eased*.18);
      var y=-(eased*42);
      copy.style.setProperty('--hero-scroll-scale',scale.toFixed(4));
      copy.style.setProperty('--hero-scroll-y',y.toFixed(2)+'px');
      paintMaskNow();
    }
    function onScroll(){if(!scrollRaf)scrollRaf=requestAnimationFrame(applyScrollState)}

    var fontsReady=document.fonts&&document.fonts.ready?document.fonts.ready.catch(function(){}):Promise.resolve();
    fontsReady.then(function(){applyScrollState();readyPaint()});
    hero.addEventListener('exif:hero-image-ready',function(){applyScrollState();readyPaint()});
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',readyPaint,{passive:true});
    window.addEventListener('orientationchange',readyPaint,{passive:true});
    if('ResizeObserver'in window){var ro=new ResizeObserver(readyPaint);ro.observe(hero);ro.observe(original)}
    if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',readyPaint);
    applyScrollState();readyPaint();initialized=true;return true;
  }
  if(!setup()){var attempts=0,timer=setInterval(function(){attempts+=1;if(setup()||attempts>=40)clearInterval(timer)},25)}
});
