// Desktop split-colour hero: stable first layout + smoothly interpolated scroll motion.
document.addEventListener('DOMContentLoaded', function () {
  var hero=document.querySelector('#what-exif-does');
  if(!hero)return;
  if(window.innerWidth<860){var legacy=document.createElement('script');legacy.src='assets/js/180902-mobile-legacy.js';legacy.defer=true;document.body.appendChild(legacy);return;}

  var initialized=false,maskRaf=0,motionRaf=0,settleTimer=0;
  function setup(){
    if(initialized)return true;
    var copy=hero.querySelector('.exif-hero-copy');
    var original=copy&&copy.querySelector('h1:not(.exif-hero-title-cream)');
    if(!copy||!original)return false;
    original.classList.add('exif-hero-title-green');
    var cream=original.cloneNode(true);cream.classList.remove('exif-hero-title-green');cream.classList.add('exif-hero-title-cream');cream.setAttribute('aria-hidden','true');cream.style.visibility='hidden';copy.insertBefore(cream,original.nextSibling);

    function canonicalPhoto(){return hero.querySelector('.exif-hero-bg');}
    function paintMaskNow(){
      var photo=canonicalPhoto();if(!photo)return;
      var t=original.getBoundingClientRect(),p=photo.getBoundingClientRect();
      var x1=Math.max(t.left,p.left),y1=Math.max(t.top,p.top),x2=Math.min(t.right,p.right),y2=Math.min(t.bottom,p.bottom);
      if(x2<=x1||y2<=y1||t.width<=0||t.height<=0){cream.style.clipPath='inset(100% 100% 100% 100%)';cream.style.webkitClipPath=cream.style.clipPath;return;}
      var left=((x1-t.left)/t.width)*100,right=((x2-t.left)/t.width)*100,top=((y1-t.top)/t.height)*100,bottom=((y2-t.top)/t.height)*100;
      var polygon='polygon('+left+'% '+top+'%, '+right+'% '+top+'%, '+right+'% '+bottom+'%, '+left+'% '+bottom+'%)';
      cream.style.clipPath=polygon;cream.style.webkitClipPath=polygon;
    }
    function paintMask(){cancelAnimationFrame(maskRaf);maskRaf=requestAnimationFrame(paintMaskNow);}

    var current=0,target=0,lastTime=performance.now();
    function readTarget(){var range=Math.max(1,hero.getBoundingClientRect().height*.72);target=Math.max(0,Math.min(1,window.scrollY/range));}
    function writeMotion(value){var eased=1-Math.pow(1-value,3);copy.style.setProperty('--hero-scroll-scale',(1-eased*.18).toFixed(5));copy.style.setProperty('--hero-scroll-y',(-(eased*42)).toFixed(2)+'px');paintMaskNow();}
    function renderMotion(now){motionRaf=0;var dt=Math.min(40,Math.max(0,now-lastTime));lastTime=now;var alpha=1-Math.exp(-dt/105);current+=(target-current)*alpha;if(Math.abs(target-current)<.00035)current=target;writeMotion(current);if(current!==target)motionRaf=requestAnimationFrame(renderMotion);}
    function requestMotion(){readTarget();if(!motionRaf){lastTime=performance.now();motionRaf=requestAnimationFrame(renderMotion);}}
    function snapMotion(){readTarget();current=target;writeMotion(current);}

    function decodePhoto(){var photo=canonicalPhoto();if(!photo)return Promise.resolve();if(photo.decode)return photo.decode().catch(function(){});if(photo.complete)return Promise.resolve();return new Promise(function(resolve){photo.addEventListener('load',resolve,{once:true});photo.addEventListener('error',resolve,{once:true});});}
    function fontsReady(){return document.fonts&&document.fonts.ready?document.fonts.ready.catch(function(){}):Promise.resolve();}
    function nextFrames(count){return new Promise(function(resolve){function step(){if(--count<=0)resolve();else requestAnimationFrame(step);}requestAnimationFrame(step);});}

    /* A resize/minimize used to fix the page because it supplied this missing
       stabilization pass. We now do that pass ourselves after fonts + the
       canonical hero image are ready and after the viewport has painted. */
    function stabilize(reveal){
      clearTimeout(settleTimer);
      Promise.all([fontsReady(),decodePhoto()]).then(function(){return nextFrames(3);}).then(function(){
        snapMotion();paintMaskNow();
        if(reveal){cream.style.visibility='';hero.classList.add('exif-geometry-ready');}
        /* Chrome/iPad can publish a final visual viewport a moment later. One
           quiet follow-up measures that final geometry without changing state. */
        settleTimer=setTimeout(function(){snapMotion();paintMaskNow();},180);
      });
    }

    hero.addEventListener('exif:hero-image-ready',function(){stabilize(true);});
    window.addEventListener('scroll',requestMotion,{passive:true});
    window.addEventListener('resize',function(){stabilize(false);},{passive:true});
    window.addEventListener('orientationchange',function(){stabilize(false);},{passive:true});
    if(window.visualViewport){window.visualViewport.addEventListener('resize',function(){stabilize(false);},{passive:true});}
    if('ResizeObserver'in window){var ro=new ResizeObserver(function(){paintMask();});ro.observe(hero);ro.observe(original);}
    if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',function(){stabilize(false);});

    stabilize(true);
    initialized=true;return true;
  }
  if(!setup()){var attempts=0,timer=setInterval(function(){attempts+=1;if(setup()||attempts>=80)clearInterval(timer);},25);}
});
