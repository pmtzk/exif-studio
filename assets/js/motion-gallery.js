(function(){
function init(){
  var section=document.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track');
  if(!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x=0,velocity=-.055,targetVelocity=-.055,direction=-1,lastY=scrollY,lastT=performance.now(),raf=0,dragging=false,lastPointerX=0,lastPointerT=0,dragVelocity=0,unit=0;
  function measure(){unit=track.scrollWidth/2;}
  function normalize(){if(!unit)return;while(x<=-unit)x+=unit;while(x>0)x-=unit;}
  function visible(){var r=section.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}
  function render(){normalize();track.style.transform='translate3d('+x.toFixed(3)+'px,0,0)';}
  function frame(now){
    raf=0;var dt=Math.min(32,Math.max(1,now-lastT));lastT=now;
    if(!dragging){
      var ambient=.055*direction;
      targetVelocity+=(ambient-targetVelocity)*(1-Math.exp(-dt/650));
      velocity+=(targetVelocity-velocity)*(1-Math.exp(-dt/240));
      x+=velocity*dt;
    }
    render();
    if(!reduced&&visible())raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame);}}
  function onScroll(){
    var y=scrollY,dy=y-lastY;lastY=y;
    if(!visible()||dragging||Math.abs(dy)<.25)return;
    direction=dy>0?-1:1;
    var strength=Math.min(.32,Math.abs(dy)*.0045);
    targetVelocity=direction*(.055+strength);
    wake();
  }
  function down(e){dragging=true;lastPointerX=e.clientX;lastPointerT=performance.now();dragVelocity=0;viewport.setPointerCapture&&viewport.setPointerCapture(e.pointerId);section.classList.add('is-dragging');}
  function move(e){if(!dragging)return;var now=performance.now(),dx=e.clientX-lastPointerX,dt=Math.max(8,now-lastPointerT);x+=dx;dragVelocity=dx/dt;lastPointerX=e.clientX;lastPointerT=now;render();}
  function up(e){if(!dragging)return;dragging=false;section.classList.remove('is-dragging');if(Math.abs(dragVelocity)>.01)direction=dragVelocity>0?1:-1;velocity=Math.max(-.55,Math.min(.55,dragVelocity));targetVelocity=velocity;wake();}
  measure();render();
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',function(){measure();normalize();render();wake();},{passive:true});
  viewport.addEventListener('pointerdown',down);viewport.addEventListener('pointermove',move);viewport.addEventListener('pointerup',up);viewport.addEventListener('pointercancel',up);
  if('ResizeObserver'in window)new ResizeObserver(function(){measure();normalize();render();}).observe(track);
  if('IntersectionObserver'in window)new IntersectionObserver(function(entries){if(entries[0].isIntersecting)wake();},{threshold:.01}).observe(section);
  wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();