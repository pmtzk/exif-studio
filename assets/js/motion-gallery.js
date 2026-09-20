(function(){
function init(){
  var chapter=document.querySelector('.gallery-chapter'),section=chapter&&chapter.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track'),signal=chapter&&chapter.querySelector('.gallery-signal');if(!chapter||!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,lastT=performance.now(),lastY=scrollY,loopWidth=0;
  var signalCurrent=0,signalTarget=0,revealCurrent=0,revealTarget=0,greenCurrent=0,greenTarget=0;
  var mode='ambient',ambientDirection=1,ambientVelocity=.052,position=0,velocity=.052,targetPosition=null;
  var pointerId=null,axis=null,startX=0,startY=0,lastX=0,lastPointerT=0,pointerVelocity=0,dragTarget=0;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function smooth(v){v=clamp(v,0,1);return v*v*(3-2*v)}function visible(){var r=chapter.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}
  function measureLoop(){var next=track.scrollWidth/3;if(!next)return;var first=!loopWidth;loopWidth=next;if(first){position=loopWidth;viewport.scrollLeft=position}}
  function wrap(){if(!loopWidth)return;var shift=0;if(position<loopWidth*.5)shift=loopWidth;else if(position>loopWidth*1.5)shift=-loopWidth;if(!shift)return;position+=shift;if(targetPosition!==null)targetPosition+=shift;if(axis==='x')dragTarget+=shift}
  function readProgress(){var r=chapter.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.94-r.top)/(vh*.72),0,1);revealTarget=smooth(clamp(p/.52,0,1));greenTarget=smooth(clamp((p-.22)/.58,0,1));signalTarget=smooth(clamp((p-.18)/.62,0,1))}
  function paint(){chapter.style.setProperty('--gallery-reveal',revealCurrent.toFixed(4));chapter.style.setProperty('--green-rise',greenCurrent.toFixed(4));if(signal){signal.style.setProperty('--signal-p',signalCurrent.toFixed(4));chapter.classList.toggle('signal-on-green',greenCurrent>.64)}}
  function frame(now){raf=0;var dt=Math.min(24,Math.max(1,now-lastT));lastT=now,ease=1-Math.exp(-dt/145);revealCurrent+=(revealTarget-revealCurrent)*ease;greenCurrent+=(greenTarget-greenCurrent)*ease;signalCurrent+=(signalTarget-signalCurrent)*ease;
    if(!reduced&&visible()){
      if(mode==='drag'){var follow=1-Math.exp(-dt/68),before=position;position+=(dragTarget-position)*follow;velocity=(position-before)/dt}
      else if(mode==='inertia'){position+=velocity*dt;velocity*=Math.exp(-dt/820);if(Math.abs(velocity)<.05){mode='ambient';velocity=ambientVelocity*ambientDirection}}
      else if(mode==='button'){var delta=targetPosition-position;position+=delta*(1-Math.exp(-dt/190));velocity=delta*.008;if(Math.abs(delta)<.55){position=targetPosition;targetPosition=null;mode='ambient';velocity=ambientVelocity*ambientDirection}}
      else{var desired=ambientVelocity*ambientDirection;velocity+=(desired-velocity)*(1-Math.exp(-dt/620));position+=velocity*dt}
      wrap();viewport.scrollLeft=position
    }
    paint();if(visible()&&!reduced)raf=requestAnimationFrame(frame)
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame)}}
  function onPageScroll(){var y=scrollY,dy=y-lastY;lastY=y;readProgress();if(Math.abs(dy)>1.8&&mode==='ambient'&&pointerId===null)ambientDirection=dy>0?1:-1;wake()}
  function step(dir){ambientDirection=dir;mode='button';velocity=0;targetPosition=position+dir*Math.min(innerWidth*.36,420);wake()}
  chapter.addEventListener('click',function(e){var btn=e.target.closest('[data-gallery-step]');if(!btn)return;e.preventDefault();e.stopPropagation();step(btn.getAttribute('data-gallery-step')==='prev'?-1:1)});
  viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointerId=e.pointerId;axis=null;startX=lastX=e.clientX;startY=e.clientY;lastPointerT=performance.now();pointerVelocity=0;dragTarget=position;try{viewport.setPointerCapture(pointerId)}catch(_){}},{passive:true});
  viewport.addEventListener('pointermove',function(e){if(e.pointerId!==pointerId)return;var totalX=e.clientX-startX,totalY=e.clientY-startY;if(!axis&&(Math.abs(totalX)>5||Math.abs(totalY)>5)){if(Math.abs(totalX)>Math.abs(totalY)*.82){axis='x';mode='drag';velocity=0;dragTarget=position;viewport.classList.add('is-horizontal-drag')}else if(Math.abs(totalY)>Math.abs(totalX)*1.7){axis='y'}}
    if(axis!=='x')return;if(e.cancelable)e.preventDefault();var now=performance.now(),dt=Math.max(8,now-lastPointerT),dx=e.clientX-lastX;dragTarget-=dx;var sample=-dx/dt;pointerVelocity=pointerVelocity*.82+sample*.18;lastX=e.clientX;lastPointerT=now;wake()
  },{passive:false});
  function release(e){if(pointerId===null||(e&&e.pointerId!=null&&e.pointerId!==pointerId))return;try{if(viewport.hasPointerCapture(pointerId))viewport.releasePointerCapture(pointerId)}catch(_){}viewport.classList.remove('is-horizontal-drag');pointerId=null;if(axis==='x'){var residual=dragTarget-position,v=clamp(pointerVelocity*.62+residual*.0025,-.9,.9);position+=residual*.18;if(Math.abs(v)>.024){velocity=v;ambientDirection=v>=0?1:-1;mode='inertia'}else{mode='ambient';velocity=ambientVelocity*ambientDirection}}axis=null;wake()}
  viewport.addEventListener('pointerup',release,{passive:true});viewport.addEventListener('pointercancel',release,{passive:true});
  viewport.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)*.72||mode==='drag')return;ambientDirection=e.deltaX>=0?1:-1;velocity=clamp(velocity+e.deltaX*.00042,-.24,.24);mode='inertia';wake()},{passive:true});
  measureLoop();readProgress();revealCurrent=revealTarget;greenCurrent=greenTarget;signalCurrent=signalTarget;paint();window.addEventListener('scroll',onPageScroll,{passive:true});window.addEventListener('resize',function(){measureLoop();readProgress();wake()},{passive:true});if('ResizeObserver'in window)new ResizeObserver(measureLoop).observe(track);if('IntersectionObserver'in window)new IntersectionObserver(function(entries){if(entries[0].isIntersecting){measureLoop();readProgress();wake()}},{threshold:.01}).observe(chapter);wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();