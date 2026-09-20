// Desktop split-colour hero: deterministic overlap + smoothly interpolated scroll motion.
document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;
  if (window.innerWidth < 860) { var legacy=document.createElement('script');legacy.src='assets/js/180902-mobile-legacy.js';legacy.defer=true;document.body.appendChild(legacy);return; }

  var initialized=false,raf=0,motionRaf=0;
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

    var current=0,target=0,lastTime=performance.now();
    function readTarget(){var range=Math.max(1,hero.offsetHeight*.72);target=Math.max(0,Math.min(1,window.scrollY/range))}
    function renderMotion(now){
      motionRaf=0;
      var dt=Math.min(40,Math.max(0,now-lastTime));lastTime=now;
      /* time-based exponential interpolation: same feel at 60/120Hz */
      var alpha=1-Math.exp(-dt/105);
      current+=(target-current)*alpha;
      if(Math.abs(target-current)<0.00035)current=target;
      var eased=1-Math.pow(1-current,3);
      var scale=1-(eased*.18),y=-(eased*42);
      copy.style.setProperty('--hero-scroll-scale',scale.toFixed(5));
      copy.style.setProperty('--hero-scroll-y',y.toFixed(2)+'px');
      paintMaskNow();
      if(current!==target)motionRaf=requestAnimationFrame(renderMotion);
    }
    function requestMotion(){readTarget();if(!motionRaf){lastTime=performance.now();motionRaf=requestAnimationFrame(renderMotion)}}
    function snapMotion(){readTarget();current=target;var eased=1-Math.pow(1-current,3);copy.style.setProperty('--hero-scroll-scale',(1-eased*.18).toFixed(5));copy.style.setProperty('--hero-scroll-y',(-(eased*42)).toFixed(2)+'px');paintMaskNow()}

    var fontsReady=document.fonts&&document.fonts.ready?document.fonts.ready.catch(function(){}):Promise.resolve();
    fontsReady.then(function(){snapMotion();readyPaint()});
    hero.addEventListener('exif:hero-image-ready',function(){snapMotion();readyPaint()});
    window.addEventListener('scroll',requestMotion,{passive:true});
    window.addEventListener('resize',function(){readTarget();readyPaint()},{passive:true});
    window.addEventListener('orientationchange',function(){readTarget();readyPaint()},{passive:true});
    if('ResizeObserver'in window){var ro=new ResizeObserver(readyPaint);ro.observe(hero);ro.observe(original)}
    if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',readyPaint);
    snapMotion();readyPaint();initialized=true;return true;
  }
  if(!setup()){var attempts=0,timer=setInterval(function(){attempts+=1;if(setup()||attempts>=40)clearInterval(timer)},25)}
});
