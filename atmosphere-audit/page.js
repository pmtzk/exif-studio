(function(){
'use strict';
const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lang=()=>root.dataset.lang==='es'?'es':'en';
const progress=$('.progress i');
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress&&(progress.style.transform=`scaleX(${max?scrollY/max:0})`)}
addEventListener('scroll',updateProgress,{passive:true});updateProgress();

const navTrack=$('[data-nav-track]');const navLinks=$$('.section-nav a');const sections=navLinks.map(a=>$(a.getAttribute('href'))).filter(Boolean);
let dragging=false,startX=0,startScroll=0;
navTrack?.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startScroll=navTrack.scrollLeft;navTrack.setPointerCapture(e.pointerId)});
navTrack?.addEventListener('pointermove',e=>{if(!dragging)return;navTrack.scrollLeft=startScroll-(e.clientX-startX)});
navTrack?.addEventListener('pointerup',()=>dragging=false);navTrack?.addEventListener('pointercancel',()=>dragging=false);
function updateNav(){const offset=(innerWidth<=900?118:132);let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=offset+30)current=section}navLinks.forEach(a=>{const active=a.getAttribute('href')===`#${current?.id}`;a.classList.toggle('is-current',active);active?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current')});const active=navLinks.find(a=>a.classList.contains('is-current'));active?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'})}
addEventListener('scroll',updateNav,{passive:true});addEventListener('resize',updateNav);updateNav();

const showsData={
shows:{en:{title:'The property shows',items:['A room','A pool','A restaurant','A view']},es:{title:'La propiedad muestra',items:['Una habitación','Una alberca','Un restaurante','Una vista']}},
see:{en:{title:'The guest needs to see',items:['The stillness','The privacy','The ambience','The experience']},es:{title:'El huésped necesita ver',items:['La calma','La privacidad','El ambiente','La experiencia']}}
};
let showsState='shows',showsStarted=false,showsAutoStopped=false,showsItemTimers=[],showsCycleTimer=null;
function clearShowsItemTimers(){showsItemTimers.forEach(clearTimeout);showsItemTimers=[]}
function stopShowsAuto(){showsAutoStopped=true;clearTimeout(showsCycleTimer);showsCycleTimer=null}
function renderShows(state,animate=true){
  clearShowsItemTimers();showsState=state;const d=showsData[state][lang()];$('#shows-see-title').textContent=d.title;
  const stage=$('[data-shows-stage]');if(stage)stage.dataset.state=state;
  const box=$('#shows-see-items');box.innerHTML='';
  d.items.forEach((item,i)=>{const span=document.createElement('span');span.textContent=item;box.appendChild(span);const show=()=>span.classList.add('is-visible');if(animate&&!reduced)showsItemTimers.push(setTimeout(show,220+i*260));else show()});
  $$('[data-shows-state]').forEach(b=>{const active=b.dataset.showsState===state;b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-pulsing',active&&animate&&!reduced)});
  showsItemTimers.push(setTimeout(()=>$$('[data-shows-state]').forEach(b=>b.classList.remove('is-pulsing')),900));
}
function scheduleShowsCycle(){
  if(showsAutoStopped||reduced)return;
  clearTimeout(showsCycleTimer);
  showsCycleTimer=setTimeout(()=>{renderShows(showsState==='shows'?'see':'shows',true);scheduleShowsCycle()},2600);
}
$$('[data-shows-state]').forEach(b=>b.addEventListener('click',()=>{stopShowsAuto();renderShows(b.dataset.showsState,true)}));
const showsObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!showsStarted){showsStarted=true;renderShows('shows',true);scheduleShowsCycle();showsObserver.disconnect()}}),{threshold:.4});showsObserver.observe($('[data-shows-see]'));

const compareData={person:{en:{a:['88','A more distinctive stay.'],b:['56','A less distinctive stay.']},es:{a:['88','Una estancia más distintiva.'],b:['56','Una estancia menos distintiva.']}},online:{en:{a:['58','A weak first impression.'],b:['91','A stronger first impression.']},es:{a:['58','Una primera impresión débil.'],b:['91','Una primera impresión más fuerte.']}}};
let compareState='person',compareStarted=false,compareAutoStopped=false,compareCycleTimer=null;
function stopCompareAuto(){compareAutoStopped=true;clearTimeout(compareCycleTimer);compareCycleTimer=null}
function applyCompareState(state){
  compareState=state;const d=compareData[state][lang()];
  ['a','b'].forEach(k=>{$(`[data-score="${k}"]`).textContent=d[k][0];$(`[data-summary="${k}"]`).textContent=d[k][1]});
  const lead=state==='person'?'a':'b';
  $$('[data-card]').forEach(card=>{const isLead=card.dataset.card===lead;card.classList.toggle('is-lead',isLead);card.classList.toggle('is-secondary',!isLead);card.classList.remove('is-waiting');card.classList.add('is-revealed')});
  $$('[data-compare]').forEach(b=>{const active=b.dataset.compare===state;b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-pulsing',active&&!reduced)});
  setTimeout(()=>$$('[data-compare]').forEach(b=>b.classList.remove('is-pulsing')),900);
}
function renderCompare(state){applyCompareState(state)}
function scheduleCompareCycle(){
  if(compareAutoStopped||reduced)return;
  clearTimeout(compareCycleTimer);
  compareCycleTimer=setTimeout(()=>{renderCompare(compareState==='person'?'online':'person');scheduleCompareCycle()},3600);
}
function revealComparisonQuestion(){ $('[data-comparison-question]')?.classList.add('is-visible'); }
$$('[data-compare]').forEach(b=>b.addEventListener('click',()=>{stopCompareAuto();renderCompare(b.dataset.compare);revealComparisonQuestion()}));
const compareObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting||compareStarted)return;compareStarted=true;renderCompare('person');scheduleCompareCycle();compareObserver.disconnect();
}),{threshold:.25});
const comparisonSection=$('[data-comparison]');if(comparisonSection)compareObserver.observe(comparisonSection);
const comparisonQuestion=$('[data-comparison-question]');
const questionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){revealComparisonQuestion();questionObserver.disconnect()}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
if(comparisonQuestion)questionObserver.observe(comparisonQuestion);

const cards=$$('[data-review-card]');let cardIndex=0,startSwipeX=null,reviewHintStopped=false,reviewHintTimer=null;
function pulseReviewHint(){
  if(reviewHintStopped||reduced||!cards.length)return;
  const active=cards[cardIndex];active?.classList.add('is-shaking');
  setTimeout(()=>active?.classList.remove('is-shaking'),950);
  reviewHintTimer=setTimeout(pulseReviewHint,1750);
}
function stopReviewHint(){reviewHintStopped=true;clearTimeout(reviewHintTimer);reviewHintTimer=null;cards.forEach(c=>c.classList.remove('is-shaking'))}
function showCard(next,dir=1){next=(next+cards.length)%cards.length;const old=cards[cardIndex];if(old!==cards[next]){old.classList.remove('is-active');old.classList.add(dir>0?'is-leaving-left':'is-leaving-right');setTimeout(()=>old.classList.remove('is-leaving-left','is-leaving-right'),520)}cardIndex=next;cards.forEach((c,i)=>c.classList.toggle('is-active',i===cardIndex));$('[data-review-current]').textContent=String(cardIndex+1)}
$('[data-review-prev]')?.addEventListener('click',()=>showCard(cardIndex-1,-1));$('[data-review-next]')?.addEventListener('click',()=>showCard(cardIndex+1,1));
const stack=$('[data-review-stack]');let dragDX=0;stack?.addEventListener('pointerdown',e=>{startSwipeX=e.clientX;dragDX=0;stack.classList.add('is-dragging');stack.setPointerCapture?.(e.pointerId)});stack?.addEventListener('pointermove',e=>{if(startSwipeX===null)return;dragDX=e.clientX-startSwipeX;const active=cards[cardIndex];if(active)active.style.transform=`translateX(${Math.max(-90,Math.min(90,dragDX))}px) rotate(${dragDX/45}deg)`});function endReviewDrag(){const active=cards[cardIndex];if(active)active.style.transform='';stack?.classList.remove('is-dragging');if(startSwipeX!==null&&Math.abs(dragDX)>45){stopReviewHint();showCard(cardIndex+(dragDX<0?1:-1),dragDX<0?1:-1)}startSwipeX=null;dragDX=0}stack?.addEventListener('pointerup',endReviewDrag);stack?.addEventListener('pointercancel',endReviewDrag);
const deckObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){pulseReviewHint();deckObserver.disconnect()}}),{threshold:.4});const reviewDeck=$('[data-review-deck]');if(reviewDeck)deckObserver.observe(reviewDeck);

const auditTitle=$('[data-audit-title]');const auditSteps=$$('[data-audit-steps] article');const nextActions=$$('.next-actions span');
const auditObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-visible');auditObserver.unobserve(e.target)}),{threshold:.3});auditObserver.observe(auditTitle);
const stepObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');stepObserver.unobserve(e.target)}}),{threshold:.45});auditSteps.forEach((s,i)=>{s.style.transitionDelay=`${i*.1}s`;stepObserver.observe(s)});nextActions.forEach((s,i)=>{s.style.transitionDelay=`${i*.09}s`;stepObserver.observe(s)});

$$('.faq-q').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';$$('.faq-q').forEach(b=>b.setAttribute('aria-expanded','false'));if(!open)button.setAttribute('aria-expanded','true')}));

const langButton=$('[data-lang-toggle]');langButton?.addEventListener('click',()=>{setTimeout(()=>{renderShows(showsState,false);renderCompare(compareState,false)},0)});

const form=$('[data-aa-form]');
function msg(key){const m={en:{required:'Please complete the required fields.',sending:'Sending…',success:'Thank you. We’ll review the property before we reply.',error:'Something went wrong. Please try again or email hello@exif.studio.',send:'Send property details'},es:{required:'Completa los campos obligatorios.',sending:'Enviando…',success:'Gracias. Revisaremos la propiedad antes de responder.',error:'Algo salió mal. Intenta nuevamente o escribe a hello@exif.studio.',send:'Enviar datos de la propiedad'}};return m[lang()][key]}
form?.addEventListener('submit',async e=>{e.preventDefault();const status=$('[data-form-status]',form),button=$('[type="submit"]',form),required=$$('[required]',form);let valid=true;required.forEach(f=>{const ok=f.checkValidity();f.setAttribute('aria-invalid',String(!ok));if(!ok)valid=false});if(!valid){status.textContent=msg('required');required.find(f=>!f.checkValidity())?.focus();return}button.disabled=true;button.textContent=msg('sending');status.textContent='';try{const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!res.ok)throw new Error(msg('error'));form.reset();status.textContent=msg('success')}catch(err){status.textContent=err.message||msg('error')}finally{button.disabled=false;button.textContent=msg('send')}});
})();
