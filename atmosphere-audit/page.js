/* Atmosphere Audit — page interactions, V1.2 */
(function () {
  'use strict';
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const lang = () => document.documentElement.dataset.lang === 'es' ? 'es' : 'en';
  const pick = (obj) => obj[lang()] || obj.en;

  const progressFill = $('.progress i');
  let progTicking = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progressFill) progressFill.style.transform = `scaleX(${max ? scrollY / max : 0})`;
    progTicking = false;
  }
  addEventListener('scroll', () => { if (!progTicking) { requestAnimationFrame(updateProgress); progTicking = true; } }, {passive:true});
  updateProgress();

  // Section navigation
  const sectionLinks = $$('.section-nav a');
  const observedSections = sectionLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${visible.target.id}`));
  }, {rootMargin:'-28% 0px -62% 0px', threshold:[0,.1,.3,.6]});
  observedSections.forEach(s => sectionObserver.observe(s));

  const lensData = {
    visible:{en:{title:'What is visible',list:'Room · Pool · Restaurant · View'},es:{title:'Lo que se ve',list:'Habitación · Alberca · Restaurante · Vista'}},
    understood:{en:{title:'What is understood',list:'Stillness · Privacy · Ritual · Place'},es:{title:'Lo que se entiende',list:'Quietud · Privacidad · Ritual · Lugar'}}
  };
  let lensState='visible';
  function renderLens(){ const d=lensData[lensState][lang()]; $('#lens-title').textContent=d.title; $('#lens-list').textContent=d.list; $('.lens').dataset.state=lensState; $$('[data-lens]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lens===lensState))); }
  $$('[data-lens]').forEach(btn=>btn.addEventListener('click',()=>{lensState=btn.dataset.lens;renderLens();}));

  const compareData={
    property:{
      en:{reading:'Reading: the quality of the property itself',label:'Offer strength',a:['Stronger setting','More considered stay','Clearer sense of place'],b:['More ordinary offer','Less distinctive setting','Fewer memorable details']},
      es:{reading:'Lectura: la calidad de la propiedad en sí',label:'Solidez de la oferta',a:['Mejor entorno','Estancia más cuidada','Mayor sentido de lugar'],b:['Oferta más ordinaria','Entorno menos distintivo','Menos detalles memorables']},
      scores:{a:'88',b:'72'},lead:'a'
    },
    presentation:{
      en:{reading:'Reading: the strength of the first impression online',label:'Presentation strength',a:['Best images appear late','Repeated room coverage','Atmosphere left implicit'],b:['Clear opening sequence','Disciplined hierarchy','Distinct first impression']},
      es:{reading:'Lectura: la fuerza de la primera impresión en línea',label:'Solidez de la presentación',a:['Las mejores imágenes aparecen tarde','Cobertura repetitiva de habitaciones','La atmósfera queda implícita'],b:['Secuencia inicial clara','Jerarquía disciplinada','Primera impresión distintiva']},
      scores:{a:'58',b:'91'},lead:'b'
    }
  };
  let compareState='property';
  function renderCompare(){
    const base=compareData[compareState], d=base[lang()];
    $('#compare-reading').textContent=d.reading;
    ['a','b'].forEach(k=>{
      $(`[data-score="${k}"]`).textContent=base.scores[k];
      $(`[data-score-label="${k}"]`).textContent=d.label;
      $(`[data-list="${k}"]`).innerHTML=d[k].map(x=>`<li>${x}</li>`).join('');
      $(`[data-card="${k}"]`).classList.toggle('lead',base.lead===k);
      $(`[data-card="${k}"] small`).textContent=(lang()==='es'?'Propiedad ':'Property ')+k.toUpperCase();
    });
    $$('[data-compare]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.compare===compareState)));
  }
  $$('[data-compare]').forEach(btn=>btn.addEventListener('click',()=>{compareState=btn.dataset.compare;renderCompare();}));

  const insights={
    en:['Recognition is the difference between showing a beautiful property and showing this property.','Translation asks whether the experience promised in words becomes visible in evidence.','Hierarchy determines what the viewer understands before attention begins to fade.','Consistency allows every active channel to reinforce the same impression.','Coverage reveals whether the reasons behind the booking decision are actually present.','Currency protects the property from being represented by a version that no longer exists.','Direction gives future collaborators a world they can continue without diluting it.'],
    es:['El reconocimiento es la diferencia entre mostrar una propiedad bonita y mostrar esta propiedad.','La traducción pregunta si la experiencia prometida en palabras se vuelve visible en la evidencia.','La jerarquía determina qué entiende el espectador antes de que su atención comience a disminuir.','La consistencia permite que cada canal activo refuerce la misma impresión.','La cobertura revela si las razones detrás de la reserva realmente están presentes.','La vigencia evita que la propiedad sea representada por una versión que ya no existe.','La dirección da a futuros colaboradores un universo que pueden continuar sin diluirlo.']
  };
  let criterionIndex=0;
  function renderCriterion(){ $('#mcount').textContent=`${String(criterionIndex+1).padStart(2,'0')} / 07`; $('#mfill').style.width=`${((criterionIndex+1)/7)*100}%`; $('#insight').textContent=insights[lang()][criterionIndex]; $$('.criterion').forEach((b,i)=>b.setAttribute('aria-selected',String(i===criterionIndex))); }
  $$('.criterion').forEach((btn,i)=>btn.addEventListener('click',()=>{criterionIndex=i;renderCriterion();}));

  const absenceSection=$('.aa-absence');
  function updateAbsence(){ if(!absenceSection)return; const r=absenceSection.getBoundingClientRect(),total=absenceSection.offsetHeight-innerHeight,p=Math.min(Math.max(-r.top,0),total)/(total||1); $$('[data-absence]').forEach((el,i)=>el.classList.toggle('fade',p>.18+i*.15&&i%2===0)); }
  addEventListener('scroll',updateAbsence,{passive:true}); updateAbsence();

  const rolesData={
    owner:{en:{pill:'Reading as: Property Owner',title:'You already know the place deserves a stronger position.',copy:'The Audit shows what should change, what can already be used and where new investment will matter most, without turning the process into another full-time project.',benefits:['Clear priorities','Investment decisions','Stronger positioning','Minimal operational burden']},es:{pill:'Leyendo como: Propietario de la propiedad',title:'Ya sabes que el lugar merece una posición más sólida.',copy:'La Auditoría muestra qué debe cambiar, qué puede aprovecharse y dónde una nueva inversión tendrá mayor impacto, sin convertir el proceso en otro trabajo de tiempo completo.',benefits:['Prioridades claras','Decisiones de inversión','Posicionamiento más sólido','Carga operativa mínima']}},
    marketing:{en:{pill:'Reading as: Marketing Lead',title:'The work is already moving. The scope still needs to become clear.',copy:'EXIF provides a focused outside reading and returns the problem as a usable scope your team can align around.',benefits:['External perspective','Stakeholder alignment','Production clarity','Time returned']},es:{pill:'Leyendo como: Líder de marketing',title:'El trabajo ya está en marcha. El alcance todavía necesita claridad.',copy:'EXIF aporta una lectura externa y enfocada, y devuelve el problema como un alcance utilizable alrededor del cual tu equipo puede alinearse.',benefits:['Perspectiva externa','Alineación interna','Claridad de producción','Tiempo recuperado']}},
    manager:{en:{pill:'Reading as: Property or Portfolio Manager',title:'You need to separate what is urgent from what is merely visible.',copy:'The Audit identifies where standards have drifted, what can be corrected and where investment is required.',benefits:['Portfolio consistency','Asset reuse','Operational priorities','Smarter investment']},es:{pill:'Leyendo como: Responsable de propiedad o portafolio',title:'Necesitas separar lo urgente de lo que simplemente es visible.',copy:'La Auditoría identifica dónde se han desviado los estándares, qué puede corregirse y dónde se requiere inversión.',benefits:['Consistencia del portafolio','Reutilización de activos','Prioridades operativas','Inversión más inteligente']}},
    concept:{en:{pill:'Reading as: Hospitality Concept',title:'The parts are strong. They still need to belong to one place.',copy:'EXIF reads the food, space, service and rituals together before photography, identity or launch materials are commissioned.',benefits:['Concept coherence','Pre-production clarity','Launch direction','A recognizable world']},es:{pill:'Leyendo como: Concepto de hospitalidad',title:'Las partes son fuertes. Todavía necesitan pertenecer al mismo lugar.',copy:'EXIF lee en conjunto la comida, el espacio, el servicio y los rituales antes de encargar fotografía, identidad o materiales de lanzamiento.',benefits:['Coherencia del concepto','Claridad antes de producir','Dirección de lanzamiento','Un universo reconocible']}}
  };
  let roleState='owner';
  function renderRole(){ const d=rolesData[roleState][lang()]; $('#role-reading').textContent=d.pill; $('#role-title').textContent=d.title; $('#role-copy').textContent=d.copy; $('#role-benefits').innerHTML=d.benefits.map(x=>`<span>${x}</span>`).join(''); $$('[data-role]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.role===roleState))); }
  $$('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{roleState=btn.dataset.role;renderRole();}));

  $$('[data-layer]').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.layer;$$('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));$$('.stack-card').forEach((c,j)=>c.classList.toggle('active',i===j));}));

  const stepObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show');}),{threshold:.35});
  $$('.process-step').forEach(s=>stepObserver.observe(s));

  const reportData={
    en:[['Overall Read','How the property is currently understood across its presentation, and where that understanding begins to lose clarity.'],['Score','A structured view of where the presentation is clear, consistent and recognizable.'],['Evidence','The specific assets, sequences, gaps and contradictions behind each finding.'],['Channels','How the website, listings, social presence and other materials compare.'],['Priorities','What can be corrected now, what needs definition and what requires investment.'],['Next Scope','A clear recommendation for what should happen next.']],
    es:[['Lectura general','Cómo se entiende actualmente la propiedad a través de su presentación y dónde esa lectura comienza a perder claridad.'],['Puntuación','Una lectura estructurada de dónde la presentación es clara, consistente y reconocible.'],['Evidencia','Los activos, secuencias, vacíos y contradicciones específicos detrás de cada hallazgo.'],['Canales','Cómo se comparan el sitio web, los listados, la presencia social y otros materiales.'],['Prioridades','Qué puede corregirse ahora, qué necesita definición y qué requiere inversión.'],['Siguiente alcance','Una recomendación clara sobre lo que debe ocurrir después.']]
  };
  const reportBars=[[72,88,58,82],[42,76,63,91,55,69,80],[82,24,66,38,92],[88,61,46,72],[100,74,48],[34,55,78,100]];
  let reportIndex=0;
  function renderReport(){const d=reportData[lang()][reportIndex];$('#report-title').textContent=d[0];$('#report-copy').textContent=d[1];$('#report-counter').textContent=(lang()==='es'?'Explora el informe ':'Explore the report ')+`${String(reportIndex+1).padStart(2,'0')} / 06`;$('#report-bars').innerHTML=reportBars[reportIndex].map((h,j)=>`<i style="height:${h}%;animation-delay:${j*.06}s"></i>`).join('');$$('[data-report]').forEach((b,i)=>b.setAttribute('aria-selected',String(i===reportIndex)));}
  $$('[data-report]').forEach((btn,i)=>btn.addEventListener('click',()=>{reportIndex=i;renderReport();}));

  const modesData={
    sharp:{en:{title:'Sharp',copy:'A concentrated review built around one defined question. Best suited to a smaller property or a specific decision.',ring:'One defined question',meta:[['Focus','One problem'],['Channels','Limited'],['Outcome','Clear next step']]},es:{title:'Sharp',copy:'Una revisión concentrada en una pregunta definida. Ideal para una propiedad más pequeña o una decisión específica.',ring:'Una pregunta definida',meta:[['Enfoque','Un problema'],['Canales','Limitados'],['Resultado','Siguiente paso claro']]},size:''},
    exhaustive:{en:{title:'Exhaustive',copy:'A full reading of the active presentation as one system.',ring:'The active system',meta:[['Focus','Full presentation'],['Channels','Several'],['Outcome','Connected priorities']]},es:{title:'Exhaustive',copy:'Una lectura completa de la presentación activa como un solo sistema.',ring:'El sistema activo',meta:[['Enfoque','Presentación completa'],['Canales','Varios'],['Resultado','Prioridades conectadas']]},size:'med'},
    catalyst:{en:{title:'Catalyst',copy:'A review for properties preparing to open or undergo a substantial change.',ring:'A property in transformation',meta:[['Focus','Open decisions'],['Channels','Still forming'],['Outcome','Direction before production']]},es:{title:'Catalyst',copy:'Una revisión para propiedades que se preparan para abrir o atravesar un cambio importante.',ring:'Una propiedad en transformación',meta:[['Enfoque','Decisiones abiertas'],['Canales','En formación'],['Resultado','Dirección antes de producir']]},size:'big'}
  };
  let modeState='sharp';
  function renderMode(){const base=modesData[modeState],d=base[lang()];$('#mode-title').textContent=d.title;$('#mode-copy').textContent=d.copy;$('#ring').textContent=d.ring;$('#ring').className='ring'+(base.size?' '+base.size:'');$('#mode-meta').innerHTML=d.meta.map(x=>`<div><b>${x[0]}</b><br>${x[1]}</div>`).join('');$$('[data-mode]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.mode===modeState)));}
  $$('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{modeState=btn.dataset.mode;renderMode();}));

  $$('.faq-q').forEach(btn=>btn.addEventListener('click',()=>{const open=btn.getAttribute('aria-expanded')==='true';$$('.faq-q').forEach(b=>b.setAttribute('aria-expanded','false'));if(!open)btn.setAttribute('aria-expanded','true');}));

  const aaForm=$('[data-aa-form]');
  const msgs={en:{required:'Please complete the required fields.',sending:'Sending…',success:'Thank you. We will review the property before we reply.',error:'Something went wrong. Please try again or email hello@exif.studio.',send:'Share the context'},es:{required:'Completa los campos obligatorios.',sending:'Enviando…',success:'Gracias. Revisaremos la propiedad antes de responder.',error:'Algo salió mal. Intenta de nuevo o escribe a hello@exif.studio.',send:'Compartir el contexto'}};
  aaForm?.addEventListener('submit',async e=>{e.preventDefault();const status=$('[data-form-status]',aaForm),button=$('[type="submit"]',aaForm),required=$$('[required]',aaForm);let valid=true;required.forEach(f=>{const ok=f.checkValidity();f.setAttribute('aria-invalid',String(!ok));if(!ok)valid=false;});if(!valid){status.textContent=msgs[lang()].required;status.className='form-status is-error';required.find(f=>!f.checkValidity())?.focus();return;}button.disabled=true;button.textContent=msgs[lang()].sending;status.textContent='';status.className='form-status';try{const res=await fetch(aaForm.action,{method:'POST',body:new FormData(aaForm),headers:{Accept:'application/json'}});const result=await res.json().catch(()=>({}));if(!res.ok)throw new Error(result?.errors?.map(x=>x.message).join(' ')||result?.error||'Request failed');aaForm.reset();status.textContent=msgs[lang()].success;status.className='form-status is-success';}catch(err){status.textContent=err.message||msgs[lang()].error;status.className='form-status is-error';}finally{button.disabled=false;button.textContent=msgs[lang()].send;}});

  function renderDynamic(){renderLens();renderCompare();renderCriterion();renderRole();renderReport();renderMode();}
  const langObserver=new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='data-lang'))requestAnimationFrame(renderDynamic);});
  langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  renderDynamic();
})();
