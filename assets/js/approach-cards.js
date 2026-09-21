(function(){
  function init(){
    var gallery=document.querySelector('.gallery-chapter');
    if(!gallery||document.querySelector('.exif-approach'))return;
    var section=document.createElement('section');
    section.className='exif-approach';
    section.id='approach';
    section.innerHTML='<div class="wrap"><div class="approach-intro"><div><p class="approach-kicker">Approach</p></div><p class="approach-summary">We observe the whole property. Decide what should define it. Create from there.</p></div><div class="approach-deck" role="list"><button class="approach-card is-active" type="button" data-approach="observe" aria-expanded="true" role="listitem"><span class="approach-card-inner"><span class="approach-card-number">01</span><span class="approach-card-title">Observe</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>How is this place actually experienced?</strong><p>We look at the property as guests live it: the place, the people, the service, the rituals and the details they remember.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button><button class="approach-card" type="button" data-approach="decide" aria-expanded="false" role="listitem"><span class="approach-card-inner"><span class="approach-card-number">02</span><span class="approach-card-title">Decide</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>What should define it?</strong><p>We identify which parts of that experience deserve to lead the property’s visual representation before arrival.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button><button class="approach-card" type="button" data-approach="create" aria-expanded="false" role="listitem"><span class="approach-card-inner"><span class="approach-card-number">03</span><span class="approach-card-title">Create</span><span class="approach-card-copy"><span class="approach-card-rule"></span><strong>Make that decision visible.</strong><p>Visual direction, photography and film are built around what the property has decided to lead with.</p></span><span class="approach-card-arrow" aria-hidden="true">→</span></span></button></div></div>';
    gallery.insertAdjacentElement('afterend',section);
    var cards=Array.prototype.slice.call(section.querySelectorAll('.approach-card'));
    function activate(card){cards.forEach(function(item){var active=item===card;item.classList.toggle('is-active',active);item.setAttribute('aria-expanded',active?'true':'false')})}
    cards.forEach(function(card){card.addEventListener('click',function(){activate(card)});card.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover) and (pointer:fine)').matches)activate(card)});card.addEventListener('focus',function(){activate(card)})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)},{once:true});else setTimeout(init,0);
})();
