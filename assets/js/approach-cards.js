(function(){
  function init(){
    var gallery=document.querySelector('.gallery-chapter');
    if(!gallery||document.querySelector('.exif-approach'))return;
    var section=document.createElement('section');
    section.className='exif-approach';
    section.id='approach';
    section.innerHTML='<div class="wrap"><div class="approach-layout"><div class="approach-deck" role="list"><button class="approach-card" type="button" data-approach="observe" aria-expanded="false" role="listitem"><span class="approach-card-inner"><span class="approach-card-title">Observe</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>How is this place actually experienced?</strong><p>We look at the property as guests live it: the place, the people, the service, the rituals and the details they remember.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button><button class="approach-card" type="button" data-approach="decide" aria-expanded="false" role="listitem"><span class="approach-card-inner"><span class="approach-card-title">Decide</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>What should define it?</strong><p>We identify which parts of that experience deserve to lead the property’s visual representation before arrival.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button><button class="approach-card" type="button" data-approach="create" aria-expanded="false" role="listitem"><span class="approach-card-inner"><span class="approach-card-title">Create</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>Make that decision visible.</strong><p>Visual direction, photography and film are built around what the property has decided to lead with.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button></div><p class="approach-summary"><span>We look at how a property is actually lived:</span> <span>the spaces, the people, the service and the details guests remember.</span> <span>From there, we decide what deserves to define it and build the visual direction around it.</span></p></div></div>';
    gallery.insertAdjacentElement('afterend',section);
    var cards=Array.prototype.slice.call(section.querySelectorAll('.approach-card')),summary=section.querySelector('.approach-summary'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var target=0,current=0,raf=0,interactive=false,lastY=window.scrollY;
    function clamp(v,a,b){return Math.max(a,Math.min(b,v))}function smooth(v){v=clamp(v,0,1);return v*v*(3-2*v)}
    function activate(card){if(!interactive)return;cards.forEach(function(item){var active=item===card;item.classList.toggle('is-active',active);item.setAttribute('aria-expanded',active?'true':'false')})}
    function read(){var r=section.getBoundingClientRect(),vh=innerHeight;target=clamp((vh*.88-r.top)/(vh*.48),0,1);if(reduced)target=1}
    function paint(p){var open=smooth(clamp((p-.12)/.58,0,1)),copy=smooth(clamp((p-.28)/.62,0,1));section.style.setProperty('--approach-open',open.toFixed(4));section.style.setProperty('--approach-copy',copy.toFixed(4));interactive=p>.94;section.classList.toggle('is-assembled',interactive);if(!interactive){cards.forEach(function(c){c.classList.remove('is-active');c.setAttribute('aria-expanded','false')})}else if(!cards.some(function(c){return c.classList.contains('is-active')})){cards[0].classList.add('is-active');cards[0].setAttribute('aria-expanded','true')}}
    function frame(){raf=0;var d=target-current;current+=d*.13;if(Math.abs(d)<.001)current=target;paint(current);if(Math.abs(target-current)>.001)raf=requestAnimationFrame(frame)}
    function wake(){read();if(!raf)raf=requestAnimationFrame(frame)}
    cards.forEach(function(card){card.addEventListener('click',function(){activate(card)});card.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover) and (pointer:fine)').matches)activate(card)});card.addEventListener('focus',function(){activate(card)})});
    window.addEventListener('scroll',function(){var y=window.scrollY;lastY=y;wake()},{passive:true});window.addEventListener('resize',wake,{passive:true});
    read();current=reduced?1:target;paint(current);wake();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)},{once:true});else setTimeout(init,0);
})();
