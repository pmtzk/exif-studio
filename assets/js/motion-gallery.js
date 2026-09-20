(function(){
function init(){
  var chapter=document.querySelector('.gallery-chapter'),section=chapter&&chapter.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track'),signal=chapter&&chapter.querySelector('.gallery-signal');if(!chapter||!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,lastT=performance.now(),lastY=scrollY,loopWidth=0,normalizing=false;
  var signalCurrent=0,signalTarget=0,revealCurrent=0,revealTarget=0,greenCurrent=0,greenTarget=0;
  var mode='ambient',ambientDirection=1,ambientVelocity=.046,position=0,velocity=.046,targetPosition=null;
  var pointerId=null,axis=null,startX=0,startY=0,lastX=0,lastPointerT=0,pointerVelocity=0,dragAnchor=0,dragTarget=0;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function smooth(v){v=clamp(v,0,1);return v*v*(3-2*v)}function visible(){var r=chapter.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}
  function measureLoop(){var next=track.scrollWidth/3;if(!next)return;var first=!loopWidth;loopWidth=next;if(first){normalizing=true;position=loopWidth;viewport.scrollLeft=position;requestAnimationFrame(function(){normalizing=false})}}
  function wrapPosition(){if(!loopWidth||normalizing)return;var shift=0;if(position<loopWidth*.42)shift=loopWidth;else if(position>loopWidth*1.58)shift=-loopWidth;if(!shift)return;normalizing=true;position+=shift;if(targetPosition!==null)targetPosition+=shift;if(mode==='drag'){dragAnchor+=shift;dragTarget+=shift}viewport.scrollLeft=position;requestAnimationFrame(function(){normalizing=false})}
  function readProgress(){var r=chapter.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.94-r.top)/(vh*.72),0,1);revealTarget=smooth(clamp(p/.52,0,1));greenTarget=smooth(clamp((p-.22)/.58,0,1));signalTarget=smooth(clamp((p-.18)/.62,0,1))}
  function paint(){chapter.style.setProperty('--gallery-reveal',revealCurrent.toFixed(4));chapter.style.setProperty('--green-rise',greenCurrent.toFixed(4));if(signal){signal.style.setProperty('--signal-p',signalCurrent.toFixed(4));chapter.classList.toggle('signal-on-green',greenCurrent>.64)}}
  function frame(now){raf=0;var dt=Math.min(32,Math.max(1,now-lastT));lastT=now,ease=1-Math.exp(-dt/135);revealCurrent+=(revealTarget-revealCurrent)*ease;greenCurrent+=(greenTarget-greenCurrent)*ease;signalCurrent+=(signalTarget-signalCurrent)*ease;
    if(!reduced&&visible()){
      if(mode==='drag'){
        var follow=1-Math.exp(-dt/82);var before=position;position+=(dragTarget-position)*follow;velocity=(position-before)/dt;
      }else if(mode==='inertia'){
        position+=velocity*dt;velocity*=Math.exp(-dt/720);if(Math.abs(velocity)<.052){mode='ambient';velocity=ambientVelocity*ambientDirection}
      }else if(mode==='button'){
        var spring=1-Math.exp(-dt/210);var delta=targetPosition-position;velocity=delta*.008;position+=delta*spring;if(Math.abs(delta)<.7){position=targetPosition;targetPosition=null;mode='ambient';velocity=ambientVelocity*ambientDirection}
      }else{
        var desired=ambientVelocity*ambientDirection;velocity+=(desired-velocity)*(1-Math.exp(-dt/520));position+=velocity*dt;
      }
      wrapPosition();viewport.scrollLeft=position;
    }
    paint();if(visible()&&!reduced)raf=requestAnimationFrame(frame)
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame)}}
  function onPageScroll(){var y=scrollY,dy=y-lastY;lastY=y;readProgress();if(Math.abs(dy)>1.4&&mode==='ambient')ambientDirection=dy>0?1:-1;wake()}
  function step(dir){ambientDirection=dir;mode='button';velocity=0;targetPosition=position+dir*Math.min(innerWidth*.36,420);wake()}
  chapter.addEventListener('click',function(e){var btn=e.target.closest('[data-gallery-step]');if(!btn)return;e.preventDefault();e.stopPropagation();step(btn.getAttribute('data-gallery-step')==='prev'?-1:1)});
  viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointerId=e.pointerId;axis=null;startX=lastX=e.clientX;startY=e.clientY;lastPointerT=performance.now();pointerVelocity=0;dragAnchor=position;dragTarget=position;try{viewport.setPointerCapture(pointerId)}catch(_){}},{passive:true});
  viewport.addEventListener('pointermove',function(e){if(e.pointerId!==pointerId)return;var totalX=e.clientX-startX,totalY=e.clientY-startY;if(!axis&&(Math.abs(totalX)>9||Math.abs(totalY)>9)){axis=Math.abs(totalX)>Math.abs(totalY)*1.28?'x':'y';if(axis==='x'){mode='drag';velocity=0;dragAnchor=position;dragTarget=position}}
    if(axis!=='x')return;
    var now=performance.now(),dt=Math.max(8,now-lastPointerT),dx=e.clientX-lastX;dragTarget-=dx;var sample=-dx/dt;pointerVelocity=pointerVelocity*.78+sample*.22;lastX=e.clientX;lastPointerT=now;wake()
  },{passive:true});
  function release(e){if(pointerId===null||(e&&e.pointerId!=null&&e.pointerId!==pointerId))return;try{if(viewport.hasPointerCapture(pointerId))viewport.releasePointerCapture(pointerId)}catch(_){}pointerId=null;if(axis==='x'){
      var residual=dragTarget-position;position+=residual*.28;var v=clamp(pointerVelocity*.58+residual*.003,-.82,.82);if(Math.abs(v)>.028){velocity=v;ambientDirection=v>=0?1:-1;mode='inertia'}else{mode='ambient';velocity=ambientVelocity*ambientDirection}
    }else if(mode==='drag'){mode='ambient';velocity=ambientVelocity*ambientDirection}
    axis=null;wake()
  }
  viewport.addEventListener('pointerup',release,{passive:true});viewport.addEventListener('pointercancel',release,{passive:true});
  viewport.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)*.72||mode==='drag')return;var dir=e.deltaX>=0?1:-1;ambientDirection=dir;velocity=clamp(velocity+e.deltaX*.00042,-.24,.24);mode='inertia';wake()},{passive:true});
  measureLoop();readProgress();revealCurrent=revealTarget;greenCurrent=greenTarget;signalCurrent=signalTarget;paint();window.addEventListener('scroll',onPageScroll,{passive:true});window.addEventListener('resize',function(){measureLoop();readProgress();wake()},{passive:true});if('ResizeObserver'in window)new ResizeObserver(measureLoop).observe(track);if('IntersectionObserver'in window)new IntersectionObserver(function(entries){if(entries[0].isIntersecting){measureLoop();readProgress();position=viewport.scrollLeft||position;wake()}},{threshold:.01}).observe(chapter);wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();