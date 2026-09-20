(function(){
function init(){
  var chapter=document.querySelector('.gallery-chapter'),section=chapter&&chapter.querySelector('.motion-gallery'),viewport=section&&section.querySelector('.motion-gallery-viewport'),track=section&&section.querySelector('.motion-gallery-track'),signal=chapter&&chapter.querySelector('.gallery-signal');if(!chapter||!section||!viewport||!track)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,lastT=performance.now(),lastY=scrollY,loopWidth=0;
  var signalCurrent=0,signalTarget=0,revealCurrent=0,revealTarget=0,greenCurrent=0,greenTarget=0;
  var mode='ambient',desiredDirection=1,ambientSpeed=.052,position=0,targetX=0,velocity=.052,targetPosition=null;
  var pointerId=null,axis=null,startX=0,startY=0,lastX=0;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function smooth(v){v=clamp(v,0,1);return v*v*(3-2*v)}function visible(){var r=chapter.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}
  function measureLoop(){var next=track.scrollWidth/3;if(next>0)loopWidth=next}
  function renderTrack(){if(!loopWidth)return;var wrapped=((position%loopWidth)+loopWidth)%loopWidth;track.style.transform='translate3d('+(-wrapped-loopWidth)+'px,0,0)'}
  function readProgress(){var r=chapter.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.94-r.top)/(vh*.72),0,1);revealTarget=smooth(clamp(p/.52,0,1));greenTarget=smooth(clamp((p-.22)/.58,0,1));signalTarget=smooth(clamp((p-.18)/.62,0,1))}
  function paint(){chapter.style.setProperty('--gallery-reveal',revealCurrent.toFixed(4));chapter.style.setProperty('--green-rise',greenCurrent.toFixed(4));if(signal){signal.style.setProperty('--signal-p',signalCurrent.toFixed(4));chapter.classList.toggle('signal-on-green',greenCurrent>.64)}}
  function frame(now){raf=0;var dt=Math.min(20,Math.max(1,now-lastT));lastT=now,ease=1-Math.exp(-dt/145);revealCurrent+=(revealTarget-revealCurrent)*ease;greenCurrent+=(greenTarget-greenCurrent)*ease;signalCurrent+=(signalTarget-signalCurrent)*ease;
    if(!reduced&&visible()){
      if(mode==='drag'||mode==='settle'){
        var follow=1-Math.exp(-dt/24);
        position+=(targetX-position)*follow;
        if(mode==='settle'&&Math.abs(targetX-position)<.16){position=targetX;mode='ambient';velocity=ambientSpeed*desiredDirection}
      }
      else if(mode==='button'){var delta=targetPosition-position;position+=delta*(1-Math.exp(-dt/210));velocity=delta*.007;if(Math.abs(delta)<.45){position=targetPosition;targetPosition=null;targetX=position;mode='ambient';velocity=ambientSpeed*desiredDirection}}
      else if(mode==='ambient'){var desired=ambientSpeed*desiredDirection;velocity+=(desired-velocity)*(1-Math.exp(-dt/560));position+=velocity*dt;targetX=position}
      renderTrack()
    }
    paint();if(visible()&&!reduced)raf=requestAnimationFrame(frame)
  }
  function wake(){if(!raf&&!reduced){lastT=performance.now();raf=requestAnimationFrame(frame)}}
  function onPageScroll(){var y=scrollY,dy=y-lastY;lastY=y;readProgress();if(Math.abs(dy)>1.25&&pointerId===null)desiredDirection=dy>0?1:-1;wake()}
  function step(dir){desiredDirection=dir;mode='button';targetPosition=position+dir*Math.min(innerWidth*.36,420);wake()}
  chapter.addEventListener('click',function(e){var btn=e.target.closest('[data-gallery-step]');if(!btn)return;e.preventDefault();e.stopPropagation();step(btn.getAttribute('data-gallery-step')==='prev'?-1:1)});
  viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointerId=e.pointerId;axis=null;startX=lastX=e.clientX;startY=e.clientY;targetX=position;try{viewport.setPointerCapture(pointerId)}catch(_){}},{passive:true});
  viewport.addEventListener('pointermove',function(e){if(e.pointerId!==pointerId)return;var totalX=e.clientX-startX,totalY=e.clientY-startY,ax=Math.abs(totalX),ay=Math.abs(totalY);if(!axis&&(ax>2||ay>2)){if(ax>=2&&ax>=ay*.28){axis='x';mode='drag';targetX=position;velocity=0;viewport.classList.add('is-horizontal-drag')}else if(ay>10&&ay>ax*3.5){axis='y'}}if(axis!=='x')return;if(e.cancelable)e.preventDefault();var dx=e.clientX-lastX;targetX-=dx;if(Math.abs(dx)>.01)desiredDirection=dx<0?1:-1;lastX=e.clientX;wake()},{passive:false});
  function release(e){if(pointerId===null||(e&&e.pointerId!=null&&e.pointerId!==pointerId))return;try{if(viewport.hasPointerCapture(pointerId))viewport.releasePointerCapture(pointerId)}catch(_){}viewport.classList.remove('is-horizontal-drag');pointerId=null;if(axis==='x'){mode=Math.abs(targetX-position)>.16?'settle':'ambient';if(mode==='ambient'){position=targetX;velocity=ambientSpeed*desiredDirection}}axis=null;wake()}
  viewport.addEventListener('pointerup',release,{passive:true});viewport.addEventListener('pointercancel',release,{passive:true});
  viewport.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)*.34||mode==='drag')return;desiredDirection=e.deltaX>=0?1:-1;targetX=position+e.deltaX*.72;mode='settle';wake()},{passive:true});
  measureLoop();targetX=position;renderTrack();readProgress();revealCurrent=revealTarget;greenCurrent=greenTarget;signalCurrent=signalTarget;paint();window.addEventListener('scroll',onPageScroll,{passive:true});window.addEventListener('resize',function(){measureLoop();readProgress();renderTrack();wake()},{passive:true});if('ResizeObserver'in window)new ResizeObserver(function(){measureLoop();renderTrack()}).observe(track);if('IntersectionObserver'in window)new IntersectionObserver(function(entries){if(entries[0].isIntersecting){measureLoop();readProgress();renderTrack();wake()}},{threshold:.01}).observe(chapter);wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();