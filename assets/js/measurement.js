/* Local, allowlisted instrumentation. No endpoint, visitor ID or personal data. */
(function(){
  'use strict';
  var events=['primary_cta_click','inquiry_page_view','letter_form_start','letter_form_success','inquiry_form_start','inquiry_form_success','scheduling_link_click','expertise_navigation','approach_navigation'];
  var pages=['home','expertise','approach','studio','inquire'];
  var placements=['hero','drawer','content','footer','letter','inquiry'];
  var sources=['outreach','organic','referral','social','direct','editorial'];
  var consent=false;
  function sourceCategory(){
    var query=new URLSearchParams(location.search||'');
    var explicit=query.get('exif_source');if(sources.indexOf(explicit)!==-1)return explicit;
    var source=(query.get('utm_source')||'').toLowerCase(),medium=(query.get('utm_medium')||'').toLowerCase();
    if(['outreach','email'].indexOf(source)!==-1||medium==='email')return 'outreach';
    if(['google','bing','duckduckgo'].indexOf(source)!==-1||medium==='organic')return 'organic';
    if(['instagram','linkedin','facebook','social'].indexOf(source)!==-1||medium==='social')return 'social';
    if(['field-notes','editorial','newsletter'].indexOf(source)!==-1)return 'editorial';
    if(source==='referral'||medium==='referral')return 'referral';
    try{if(document.referrer){var host=new URL(document.referrer).hostname;if(host!==location.hostname){if(/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(host))return 'organic';if(/(^|\.)(instagram\.com|linkedin\.com|facebook\.com)$/.test(host))return 'social';return 'referral';}}}catch(e){}
    return 'direct';
  }
  var source=sourceCategory();
  function track(name,details){
    if(events.indexOf(name)===-1)return false;
    details=details||{};
    var page=pages.indexOf(document.body.dataset.page)!==-1?document.body.dataset.page:'home';
    var payload=Object.freeze({event:name,page:page,placement:placements.indexOf(details.placement)!==-1?details.placement:'content',source:source});
    window.dispatchEvent(new CustomEvent('exif:measure',{detail:payload}));
    var adapter=window.EXIF_CONFIG&&window.EXIF_CONFIG.measure;
    if(consent&&typeof adapter==='function'){try{adapter(payload);}catch(e){/* Measurement never blocks interaction. */}}
    return true;
  }
  window.exifMeasurement=Object.freeze({track:track,setConsent:function(value){consent=value===true;},source:function(){return source;}});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var placement=a.dataset.placement||'content';
    if(a.hasAttribute('data-primary-cta'))track('primary_cta_click',{placement:placement});
    if(a.hasAttribute('data-scheduling'))track('scheduling_link_click',{placement:'inquiry'});
    var route=a.dataset.route;
    if(route==='expertise')track('expertise_navigation',{placement:placement});
    if(route==='approach')track('approach_navigation',{placement:placement});
    // Carry only the normalized source category through real internal routes.
    var href=a.getAttribute('href');
    if(!href||href.charAt(0)==='#'||a.hasAttribute('download'))return;
    try{var url=new URL(href,location.href);if(url.origin===location.origin&&pages.some(function(p){return url.pathname==='/'||url.pathname==='/'+p||url.pathname==='/'+p+'.html'||url.pathname==='/index.html';})){url.searchParams.set('exif_source',source);a.setAttribute('href',url.pathname+url.search+url.hash);}}catch(error){}
  },true);
  document.addEventListener('DOMContentLoaded',function(){if(document.body.dataset.page==='inquire')track('inquiry_page_view',{placement:'inquiry'});});
})();
