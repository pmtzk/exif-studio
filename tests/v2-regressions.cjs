/* Dependency-free contracts for public routes, qualification and private measurement. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let passed=0;function test(name,fn){fn();passed++;console.log('PASS '+name);}
const pages=['index','expertise','approach','studio','inquire'];
test('All five pages have bilingual shared navigation, canonical metadata and real destinations',()=>{
 for(const page of pages){const html=read(page+'.html');assert.match(html,/data-en=/);assert.match(html,/data-es=/);assert.match(html,/<link rel="canonical" href="https:\/\/exif\.studio\/(?:expertise|approach|studio|inquire)?"/);assert.match(html,/id="main-content"/);assert.match(html,/class="skip-link"/);for(const route of ['expertise','approach','studio','inquire'])assert.match(html,new RegExp('href="/'+route+'\\.html"'));assert.match(html,/assets\/js\/site-v2.js/);}
});
test('Cloudflare native clean routes avoid canonical loops and reserved destinations are unpublished',()=>{
 const redirects=read('_redirects');for(const page of pages.slice(1))assert(!new RegExp('^/'+page+' /'+page+'\\.html 200$','m').test(redirects),'Cloudflare canonical redirect loop: '+page);
 for(const route of ['work','field-notes','assessment']){assert(!fs.existsSync(path.join(root,route+'.html')));for(const page of pages)assert(!read(page+'.html').includes('href="/'+route+'"'));}
 const sitemap=read('sitemap.xml');assert.equal((sitemap.match(/<loc>/g)||[]).length,5);
});
test('Inquiry asks exactly the five required qualification fields with optional explanation',()=>{
 const html=read('inquire.html'),form=html.match(/<form id="discovery-inquiry"[\s\S]*?<\/form>/)[0];
 assert.equal((form.match(/\brequired\b/g)||[]).length,5);for(const field of ['name','email','property','relationship','context'])assert.match(form,new RegExp('name="'+field+'"'));
 assert.match(form,/name="message"/);assert.match(form,/does not reserve a meeting/);assert.match(form,/https:\/\/formspree.io\/f\/xgojyjpq/);assert(!/occupancy|revenue|USD|895|deposit/i.test(form));
});
test('Every explicit local HTML/CSS asset exists and no restricted employer claims are public',()=>{
 for(const page of [...pages,'dear-exif']){const html=read(page+'.html');assert(!/royalton|st\.\s*lucia/i.test(html));for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){let url=match[1].split(/[?#]/)[0];if(/^(https?:|mailto:|data:)/.test(url)||url==='/')continue;if(['/expertise','/approach','/studio','/inquire'].includes(url))continue;assert(fs.existsSync(path.join(root,url.replace(/^\//,''))),page+': '+url);}}
 for(const file of fs.readdirSync(path.join(root,'assets/css'))){const css=read('assets/css/'+file);for(const m of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)){if(m[1].startsWith('data:')||m[1].startsWith('#'))continue;assert(fs.existsSync(path.resolve(root,'assets/css',m[1])),file+': '+m[1]);}}
});
function environment(query='',referrer=''){
 const listeners={},payloads=[],calls=[];const document={body:{dataset:{page:'inquire'}},referrer,addEventListener(n,f){listeners[n]=f;}};
 const location={search:query,hostname:'exif.studio',href:'https://exif.studio/inquire'+query,origin:'https://exif.studio'};
 const window={EXIF_CONFIG:{measure:p=>calls.push(p)},dispatchEvent:e=>payloads.push(e.detail)};
 vm.runInNewContext(read('assets/js/measurement.js'),{window,document,location,URL,URLSearchParams,CustomEvent:class{constructor(type,args){this.type=type;this.detail=args.detail;}},Object});
 return{window,document,listeners,payloads,calls};
}
test('Measurement payloads reject personal details and fabricated booking completions',()=>{
 const env=environment('?utm_source=private-person@example.com&email=guest@example.com&property=secret');
 assert.equal(env.window.exifMeasurement.track('scheduling_complete',{email:'secret'}),false);
 env.window.exifMeasurement.track('letter_form_success',{placement:'letter',email:'secret',property:'private',message:'confidential'});
 assert.deepEqual(Object.keys(env.payloads[0]),['event','page','placement','source']);assert.equal(env.payloads[0].source,'direct');assert(!JSON.stringify(env.payloads).includes('secret'));assert.equal(env.calls.length,0);
});
test('Analytics adapter is consent-gated, revocable and cannot block the site',()=>{
 const env=environment();env.window.exifMeasurement.track('inquiry_page_view');assert.equal(env.calls.length,0);
 env.window.exifMeasurement.setConsent(true);env.window.exifMeasurement.track('inquiry_form_success');assert.equal(env.calls.length,1);
 env.window.exifMeasurement.setConsent(false);env.window.exifMeasurement.track('primary_cta_click');assert.equal(env.calls.length,1);
 env.window.exifMeasurement.setConsent(true);env.window.EXIF_CONFIG.measure=()=>{throw Error('provider failure');};assert.doesNotThrow(()=>env.window.exifMeasurement.track('inquiry_form_success'));
});
test('Only categorical attribution propagates through internal links',()=>{
 const env=environment('?utm_source=linkedin&utm_campaign=private-property');assert.equal(env.window.exifMeasurement.source(),'social');
 const attrs={href:'/approach'};const link={dataset:{route:'approach',placement:'drawer'},getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v,hasAttribute:k=>k in attrs};env.listeners.click({target:{closest:()=>link}});
 assert.equal(attrs.href,'/approach?exif_source=social');assert(!attrs.href.includes('private'));
 for(const [query,expected] of [['?utm_medium=email','outreach'],['?utm_source=google','organic'],['?utm_source=field-notes','editorial'],['?exif_source=referral','referral']])assert.equal(environment(query).window.exifMeasurement.source(),expected);
});
test('Measurement has no network or persistent identifier implementation',()=>{const source=read('assets/js/measurement.js');assert(!/fetch\(|sendBeacon\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie/.test(source));assert.match(read('assets/js/site-config.js'),/schedulingUrl: null/);assert.match(read('assets/js/site-config.js'),/measure: null/);});
console.log(passed+' V2 contracts passed');
