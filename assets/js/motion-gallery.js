(function(){
function init(){
  var section=document.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track');
  if(!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x=0,velocity=-.032,targetVelocity=-.032,direction=-1,lastY=scrollY,lastT=performance.now(),raf=0,dragging=false,lastPointerX=0,lastPointerT=0,dragVelocity=0,unit=0;
  var AMBIENT=.032,MAX_SPEED=.115;
  function measure(){unit=track.scrollWidth/2;}
  function normalize(){if(!unit)return;while(x<=-unit)x+=unit;while(x>0)x-=unit;}
  function visible(){var r=section.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}
  function render(){normalize();track.style.transform='translate3d('+x.toFixed(3)+'px,0,0)';}
  function frame(now){
    raf=0;var dt=Math.min(28,Math.max(1,now-lastT));lastT=now;
    if(!dragging){
      var ambient=AMBIENT*direction;
      targetVelocity+=(ambient-targetVelocity)*(1-Math.exp(-dt/1100));
      velocity+=(targetVelocity-velocity)*(1-Math.exp(-dt/320));
      velocity=Math.max(-MAX_SPEED,Math.min(MAX_SPEED,velocity));
      x+=velocity*dt;
    }
    render();if(!reduced&&visible())raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame);}}
  function onScroll(){
    var y=scrollY,dy=y-lastY;lastY=y;if(!visible()||dragging||Math.abs(dy)<.3)return;
    direction=dy>0?-1:1;
    /* Compress large wheel/trackpad deltas: direction matters more than gesture force. */
    var normalized=Math.tanh(Math.abs(dy)*.018);
    var requested=AMBIENT+normalized*(MAX_SPEED-AMBIENT);
    targetVelocity=direction*requested;wake();
  }
  function down(e){dragging=true;lastPointerX=e.clientX;lastPointerT=performance.now();dragVelocity=0;viewport.setPointerCapture&&viewport.setPointerCapture(e.pointerId);section.classList.add('is-dragging');}
  function move(e){if(!dragging)return;var now=performance.now(),dx=e.clientX-lastPointerX,dt=Math.max(8,now-lastPointerT);x+=dx;dragVelocity=dx/dt;lastPointerX=e.clientX;lastPointerT=now;render();}
  function up(){if(!dragging)return;dragging=false;section.classList.remove('is-dragging');if(Math.abs(dragVelocity)>.01)direction=dragVelocity>0?1:-1;velocity=Math.max(-MAX_SPEED,Math.min(MAX_SPEED,dragVelocity*.35));targetVelocity=velocity||AMBIENT*direction;wake();}
  measure();render();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',function(){measure();normalize();render();wake();},{passive:true});viewport.addEventListener('pointerdown',down);viewport.addEventListener('pointermove',move);viewport.addEventListener('pointerup',up);viewport.addEventListener('pointercancel',up);if('ResizeObserver'in window)new ResizeObserver(function(){measure();normalize();render();}).observe(track);if('IntersectionObserver'in window)new IntersectionObserver(function(entries){if(entries[0].isIntersecting)wake();},{threshold:.01}).observe(section);wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();