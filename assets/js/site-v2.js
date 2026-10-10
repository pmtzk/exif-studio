/* V2 page metadata and discovery inquiries; shared V1 interactions stay intact. */
(function(){
 'use strict';
 var meta={
  home:{en:['EXIF Studio — Hospitality Positioning & Creative Direction','EXIF works with independent hotels, villas and distinctive stays to identify what makes them worth choosing and direct how that value is communicated before arrival.'],es:['EXIF Studio — Posicionamiento y dirección creativa para hospitalidad','EXIF trabaja con hoteles independientes, villas y alojamientos singulares para identificar por qué vale la pena elegirlos y dirigir cómo comunicar ese valor antes de llegar.']},
  expertise:{en:['What We Do — EXIF Studio','Research, positioning and creative direction for independent hospitality. Make what matters clear before arrival.'],es:['Qué hacemos — EXIF Studio','Investigación, posicionamiento y dirección creativa para hospitalidad independiente. Hacer visible lo que importa antes de llegar.']},
  approach:{en:['Approach — EXIF Studio','Understand, examine, define, translate and evaluate. How EXIF investigates a property and directs creative decisions informed by evidence.'],es:['Cómo trabajamos — EXIF Studio','Entender, examinar, definir, traducir y evaluar. Cómo EXIF investiga una propiedad y dirige decisiones creativas fundamentadas en evidencia.']},
  studio:{en:['Studio — EXIF','An independent creative studio founded by Katia Pérez. Previous experience in hospitality sales, photography, operations and management in Mexico and the Caribbean.'],es:['Estudio — EXIF','Un estudio creativo independiente fundado por Katia Pérez. Experiencia previa en ventas, fotografía, operaciones y gestión hotelera en México y el Caribe.']},
  inquire:{en:['Discuss Your Property — EXIF Studio','Introduce your independent hotel, villa or distinctive stay. A complimentary 30-minute discovery conversation to discuss your context and an appropriate next step.'],es:['Hablemos de tu propiedad — EXIF Studio','Cuéntanos sobre tu hotel independiente, villa o alojamiento singular. Una conversación inicial gratuita de 30 minutos para conocer tu contexto y acordar el siguiente paso.']}
 };
 function lang(){return document.documentElement.lang==='es'?'es':'en';}
 function applyMeta(){
  var copy=meta[document.body.dataset.page];if(!copy)return;copy=copy[lang()];document.title=copy[0];
  [['meta[name="description"]',copy[1]],['meta[property="og:title"]',copy[0]],['meta[property="og:description"]',copy[1]],['meta[name="twitter:title"]',copy[0]],['meta[name="twitter:description"]',copy[1]],['meta[property="og:locale"]',lang()==='es'?'es_MX':'en_US']].forEach(function(item){var el=document.querySelector(item[0]);if(el)el.content=item[1];});
 }
 function measure(name){if(window.exifMeasurement)window.exifMeasurement.track(name,{placement:'inquiry'});}
 function bookingUrl(raw){
  if(typeof raw!=='string'||!raw.trim())return null;
  try{var url=new URL(raw);if(url.protocol!=='https:'||url.username||url.password||url.hostname==='example.com'||url.hostname.endsWith('.example.com'))return null;return url.href;}catch(e){return null;}
 }
 function initInquiry(){
  var form=document.querySelector('#discovery-inquiry');if(!form)return;
  var link=document.querySelector('[data-scheduling]'),provider=document.querySelector('#provider-inquiry');
  var url=bookingUrl(window.EXIF_CONFIG&&window.EXIF_CONFIG.schedulingUrl);
  if(url&&link&&provider){link.href=url;form.hidden=true;provider.hidden=false;return;}
  var status=form.querySelector('[role="status"]'),button=form.querySelector('button[type="submit"]'),receipt=document.querySelector('#inquiry-received');
  var pending=false,failed=false,sent=false,started=false;
  function copy(){
   if(button)button.textContent=pending?(lang()==='es'?'ENVIANDO…':'SENDING…'):(lang()==='es'?'ENVIAR SOLICITUD →':'SEND INQUIRY →');
   if(status)status.textContent=failed?(lang()==='es'?'No pudimos enviar la solicitud. Intenta de nuevo o escribe a hello@exif.studio.':'We could not send your inquiry. Try again or email hello@exif.studio.'):'';
  }
  form.addEventListener('input',function(){if(!started){started=true;measure('inquiry_form_start');}});
  form.addEventListener('submit',function(e){
   e.preventDefault();if(pending||sent||!form.reportValidity())return;
   pending=true;failed=false;button.disabled=true;copy();
   fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
    .then(function(response){if(!response.ok)throw Error('inquiry');sent=true;measure('inquiry_form_success');form.hidden=true;if(receipt){receipt.hidden=false;receipt.focus({preventScroll:true});}})
    .catch(function(){failed=true;})
    .finally(function(){pending=false;button.disabled=false;copy();});
  });
  window.addEventListener('exif:languagechange',copy);
 }
 function init(){applyMeta();initInquiry();}
 window.addEventListener('exif:languagechange',applyMeta);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
