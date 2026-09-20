(function(){
function init(){
  var section=document.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track');
  if(!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x=0,velocity=reduced?0:-.16,targetVelocity=velocity,lastY=scrollY,lastT=performance.now(),raf=0,dragging=false,lastPointerX=0,lastPointerT=0,dragVelocity=0;
  function wrap(){var half=track.scrollWidth/2;if(half>0){while(x<=-half)x+=half;while(x>0)x-=half;}}
  function visible(){var r=section.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}
  function frame(now){
    raf=0;var dt=Math.min(34,Math.max(1,now-lastT));lastT=now;
    if(!dragging){var ambient=targetVelocity<0?-.16:.16;targetVelocity+=(ambient-targetVelocity)*(1-Math.exp(-dt/900));velocity+=(targetVelocity-velocity)*(1-Math.exp(-dt/150));x+=velocity*dt;}
    wrap();track.style.transform='translate3d('+x.toFixed(2)+'px,0,0)';
    if(visible()&&!reduced)raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame);}}
  function onScroll(){var y=scrollY,dy=y-lastY;lastY=y;if(visible()&&!dragging){var impulse=Math.max(-1.15,Math.min(1.15,-dy*.026));targetVelocity=targetVelocity*.52+impulse*.48;wake();}}
  function down(e){dragging=true;lastPointerX=e.clientX;lastPointerT=performance.now();dragVelocity=0;viewport.setPointerCapture&&viewport.setPointerCapture(e.pointerId);section.classList.add('is-dragging');wake();}
  function move(e){if(!dragging)return;var now=performance.now(),dx=e.clientX-lastPointerX,dt=Math.max(8,now-lastPointerT);x+=dx;dragVelocity=dx/dt;lastPointerX=e.clientX;lastPointerT=now;wrap();track.style.transform='translate3d('+x.toFixed(2)+'px,0,0)';}
  function up(e){if(!dragging)return;dragging=false;section.classList.remove('is-dragging');targetVelocity=Math.max(-1.25,Math.min(1.25,dragVelocity));velocity=targetVelocity;wake();}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',wake,{passive:true});viewport.addEventListener('pointerdown',down);viewport.addEventListener('pointermove',move);viewport.addEventListener('pointerup',up);viewport.addEventListener('pointercancel',up);viewport.addEventListener('pointerleave',function(e){if(dragging&&e.pointerType==='mouse')up(e);});
  if('IntersectionObserver'in window){new IntersectionObserver(function(entries){if(entries[0].isIntersecting)wake();},{threshold:.01}).observe(section);}wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();