(function(){
function init(){
  var chapter=document.querySelector('.gallery-chapter'),section=chapter&&chapter.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track'),signal=chapter&&chapter.querySelector('.gallery-signal');if(!chapter||!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,lastT=performance.now(),loopWidth=0,isVisible=true,progressDirty=true;
  var signalCurrent=0,signalTarget=0,revealCurrent=0,revealTarget=0,greenCurrent=0,greenTarget=0;
  var mode='ambient',desiredDirection=1,ambientSpeed=.052,position=0,targetX=0,velocity=.052,targetPosition=null,bounceOffset=0,bounceTarget=0,releaseGlide=0;
  var pointerId=null,axis=null,startX=0,startY=0,lastX=0,lastPointerT=0,pointerVelocity=0,wheelTimer=0;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function smooth(v){v=clamp(v,0,1);return v*v*(3-2*v)}
  function measureLoop(){var next=track.scrollWidth/3;if(next>0)loopWidth=next}
  function renderTrack(){if(!loopWidth)return;var visual=position+bounceOffset,wrapped=((visual%loopWidth)+loopWidth)%loopWidth;track.style.transform='translate3d('+(-wrapped-loopWidth)+'px,0,0)'}
  function readProgress(){var r=chapter.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.94-r.top)/(vh*.72),0,1);revealTarget=smooth(clamp(p/.52,0,1));greenTarget=smooth(clamp((p-.22)/.58,0,1));signalTarget=smooth(clamp((p-.18)/.62,0,1));progressDirty=false}
  function paintProgress(){chapter.style.setProperty('--gallery-reveal',revealCurrent.toFixed(4));chapter.style.setProperty('--green-rise',greenCurrent.toFixed(4));if(signal){signal.style.setProperty('--signal-p',signalCurrent.toFixed(4));chapter.classList.toggle('signal-on-green',greenCurrent>.64)}}
  function frame(now){raf=0;var rawDt=Math.max(1,now-lastT),dt=Math.min(34,rawDt);lastT=now;if(progressDirty)readProgress();var progressEase=1-Math.exp(-dt/145);revealCurrent+=(revealTarget-revealCurrent)*progressEase;greenCurrent+=(greenTarget-greenCurrent)*progressEase;signalCurrent+=(signalTarget-signalCurrent)*progressEase;
    if(!reduced&&isVisible){
      bounceOffset+=(bounceTarget-bounceOffset)*(1-Math.exp(-dt/38));if(Math.abs(bounceOffset-bounceTarget)<.04){bounceOffset=bounceTarget;if(bounceTarget!==0)bounceTarget=0}
      if(mode==='drag'||mode==='wheel'){
        position+=(targetX-position)*(1-Math.exp(-dt/20));
      }else if(mode==='settle'){
        var remaining=targetX-position,desiredAmbient=ambientSpeed*desiredDirection,near=smooth(clamp(1-Math.abs(remaining)/7,0,1));
        position+=remaining*(1-Math.exp(-dt/22));
        releaseGlide*=Math.exp(-dt/105);position+=releaseGlide*dt;
        velocity+=(desiredAmbient-velocity)*(1-Math.exp(-dt/95));position+=velocity*dt*near;
        if(Math.abs(targetX-position)<.14&&Math.abs(releaseGlide)<.006){targetX=position;mode='ambient';bounceTarget=desiredDirection*.45;velocity=desiredAmbient;releaseGlide=0}
      }else if(mode==='button'){
        var deltaButton=targetPosition-position;position+=deltaButton*(1-Math.exp(-dt/210));if(Math.abs(deltaButton)<.35){position=targetPosition;targetPosition=null;targetX=position;mode='ambient';velocity=ambientSpeed*desiredDirection}
      }else if(mode==='ambient'){
        var desired=ambientSpeed*desiredDirection;velocity+=(desired-velocity)*(1-Math.exp(-dt/420));position+=velocity*dt;targetX=position
      }
      renderTrack()
    }
    paintProgress();var progressMoving=Math.abs(revealTarget-revealCurrent)>.001||Math.abs(greenTarget-greenCurrent)>.001||Math.abs(signalTarget-signalCurrent)>.001;if((isVisible&&!reduced)||progressMoving)raf=requestAnimationFrame(frame)
  }
  function wake(){if(!raf){lastT=performance.now();raf=requestAnimationFrame(frame)}}
  function settleSoon(){clearTimeout(wheelTimer);wheelTimer=setTimeout(function(){if(mode==='wheel'){mode='settle';velocity=0;releaseGlide=0;wake()}},72)}
  function onPageScroll(){progressDirty=true;wake()}
  function step(dir){desiredDirection=dir;mode='button';targetPosition=position+dir*Math.min(innerWidth*.36,420);wake()}
  chapter.addEventListener('click',function(e){var btn=e.target.closest('[data-gallery-step]');if(!btn)return;e.preventDefault();e.stopPropagation();step(btn.getAttribute('data-gallery-step')==='prev'?-1:1)});
  viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointerId=e.pointerId;axis=null;startX=lastX=e.clientX;startY=e.clientY;targetX=position;bounceTarget=0;releaseGlide=0;pointerVelocity=0;lastPointerT=performance.now();try{viewport.setPointerCapture(pointerId)}catch(_){}},{passive:true});
  viewport.addEventListener('pointermove',function(e){if(e.pointerId!==pointerId)return;var totalX=e.clientX-startX,totalY=e.clientY-startY,ax=Math.abs(totalX),ay=Math.abs(totalY);if(!axis&&(ax>2||ay>2)){if(ax>=2&&ax>=ay*.28){axis='x';mode='drag';targetX=position;velocity=0;bounceOffset=totalX>0?.55:-.55;bounceTarget=0;viewport.classList.add('is-horizontal-drag')}else if(ay>10&&ay>ax*3.5){axis='y'}}if(axis!=='x')return;if(e.cancelable)e.preventDefault();var now=performance.now(),dt=Math.max(8,now-lastPointerT),dx=e.clientX-lastX;targetX-=dx;var sample=(-dx)/dt;pointerVelocity=pointerVelocity*.72+sample*.28;if(Math.abs(dx)>.01)desiredDirection=dx<0?1:-1;lastX=e.clientX;lastPointerT=now;wake()},{passive:false});
  function release(e){if(pointerId===null||(e&&e.pointerId!=null&&e.pointerId!==pointerId))return;try{if(viewport.hasPointerCapture(pointerId))viewport.releasePointerCapture(pointerId)}catch(_){}viewport.classList.remove('is-horizontal-drag');pointerId=null;if(axis==='x'){releaseGlide=clamp(pointerVelocity*.10,-.055,.055);mode='settle';velocity=0}axis=null;wake()}
  viewport.addEventListener('pointerup',release,{passive:true});viewport.addEventListener('pointercancel',release,{passive:true});
  viewport.addEventListener('wheel',function(e){if(mode==='drag')return;var ax=Math.abs(e.deltaX),ay=Math.abs(e.deltaY);if(ax<.35||ax<=ay*.7)return;if(e.cancelable)e.preventDefault();var delta=e.deltaX;desiredDirection=delta>=0?1:-1;if(mode!=='wheel'){targetX=position;bounceOffset=desiredDirection*.4;bounceTarget=0}targetX+=clamp(delta*.42,-14,14);mode='wheel';settleSoon();wake()},{passive:false});
  measureLoop();targetX=position;renderTrack();readProgress();revealCurrent=revealTarget;greenCurrent=greenTarget;signalCurrent=signalTarget;paintProgress();window.addEventListener('scroll',onPageScroll,{passive:true});window.addEventListener('resize',function(){measureLoop();progressDirty=true;renderTrack();wake()},{passive:true});if('ResizeObserver'in window)new ResizeObserver(function(){var old=loopWidth;measureLoop();if(Math.abs(loopWidth-old)>.5){targetX=position;renderTrack()}}).observe(track);if('IntersectionObserver'in window)new IntersectionObserver(function(entries){isVisible=entries[0].isIntersecting;if(isVisible){measureLoop();progressDirty=true;renderTrack();wake()}},{threshold:.01}).observe(chapter);wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();