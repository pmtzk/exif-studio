/* Real Chromium QA. Requires Playwright and a Chromium executable; no site dependencies.
   Run: node tests/browser-v2.cjs
   Uses an ephemeral local server applying this checkout's _redirects rewrites.
   External requests are blocked; Formspree is mocked. Artifacts stay outside checkout. */
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const root=path.resolve(__dirname,'..');const artifactRoot=process.env.EXIF_ARTIFACT_DIR||'/workspace/artifacts/exif-v2/after';fs.mkdirSync(artifactRoot,{recursive:true});
const rewrites=Object.fromEntries(fs.readFileSync(path.join(root,'_redirects'),'utf8').trim().split('\n').map(l=>l.split(/\s+/)).filter(r=>r[2]==='200').map(r=>[r[0],r[1]]));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let rel=rewrites[pathname]||pathname;if(rel==='/')rel='/index.html';else if(!path.extname(rel)&&fs.existsSync(path.join(root,rel+'.html')))rel+='.html';let file=path.resolve(root,'.'+rel);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':mime[path.extname(file)]||'text/plain'});res.end(e?'Missing':b);});});
let browser,checks=0;const results=[];
function verify(value,message){assert(value,message);checks++;}
async function shot(page,name){await page.screenshot({path:path.join(artifactRoot,name+'.png')});}
async function block(context){await context.route('https://**/*',r=>r.abort());}
async function settle(page,ms=350){await page.waitForTimeout(ms);}
async function test(name,fn){if(process.env.EXIF_BROWSER_CASE&&!new RegExp(process.env.EXIF_BROWSER_CASE).test(name))return;await fn();results.push(name);console.log('PASS '+name);}
async function copyMatches(page,lang){const failures=await page.locator('[data-en][data-es]').evaluateAll((els,lang)=>els.filter(el=>el.textContent.trim()!==el.getAttribute('data-'+lang).trim()).map(el=>el.tagName+':'+el.textContent.slice(0,35)),lang);verify(!failures.length,'Incorrect '+lang+' copy: '+failures.join(', '));}
async function home(context,base){const page=await context.newPage();await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.body.classList.contains('exif-header-ready'));await settle(page,1500);return page;}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({executablePath:process.env.EXIF_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 for(const width of [360,390,768,860,1024,1440])for(const lang of ['en','es']){
  await test(width+'px '+lang+' pages, drawer geometry and preserved components',async()=>{
   const context=await browser.newContext({viewport:{width,height:900}});await block(context);
   await context.addInitScript(lang=>{if(!localStorage.getItem('exif-language'))localStorage.setItem('exif-language',lang);},lang);
   const page=await context.newPage(),errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)missing.push(r.url());});
   await page.goto(base,{waitUntil:'domcontentloaded'});await settle(page,650);await shot(page,`${width}-${lang}-loader`);
   await page.waitForFunction(()=>document.body.classList.contains('exif-header-ready'));await settle(page,1500);await shot(page,`${width}-${lang}-hero`);
   verify(await page.locator('.exif-loader').count()===0,'Loader not released');
   verify(await page.locator('.hero-commercial').isVisible(),'Commercial category hidden');
   const cta=await page.locator('.hero-actions [data-primary-cta]').boundingBox();verify(cta.y>=0&&cta.y+cta.height<=900,'Hero CTA outside initial viewport');
   await page.locator('.nav-toggle').click();await settle(page,1100);await shot(page,`${width}-${lang}-drawer`);
   verify(await page.locator('.v1-nav-link').count()===4,'Four primary drawer routes missing');
   verify(await page.locator('main').evaluate(el=>el.inert),'Background not inert while drawer open');
   for(const route of ['home','expertise','approach','studio']){
    const link=page.locator('.v1-nav-link[data-route="'+route+'"]'),rect=await link.boundingBox();verify(rect.width>0&&rect.height>=44,'Drawer target too small');
    await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5);await settle(page,260);
    verify(await link.locator('.v1-nav-label').evaluate(el=>el.classList.contains('is-hover-copy')),'Wrong hover zone for '+route);
    verify((await link.getAttribute('aria-label')).length>0,'Route name lost during hover');
   }
   await page.keyboard.press('Escape');await settle(page,1100);
   verify(await page.locator('.exif-drawer').evaluate(el=>el.inert&&el.getAttribute('aria-hidden')==='true'),'Closed drawer links accessible');
   verify(!await page.locator('main').evaluate(el=>el.inert),'Background remains inert');
   verify(await page.locator('.nav-toggle').evaluate(el=>el===document.activeElement),'Close focus not restored');
   for(const [name,selector] of [['choice','.editorial-choice'],['gallery','.gallery-chapter'],['cards','.exif-approach'],['recognition','.recognition-section'],['practice','.v2-practice'],['letter','#dear-exif']]){
    await page.locator(selector).scrollIntoViewIfNeeded();await settle(page,700);await shot(page,`${width}-${lang}-${name}`);
   }
   await page.locator('.approach-card[data-approach="create"]').scrollIntoViewIfNeeded();await page.locator('.approach-card[data-approach="create"]').click();await settle(page,700);
   verify(await page.locator('.approach-card[data-approach="create"]').getAttribute('aria-expanded')==='true','Create card not active');
   const overflow=await page.locator('.approach-card.is-active').evaluate(card=>{const r=card.getBoundingClientRect(),t=card.querySelector('.approach-card-title').getBoundingClientRect(),c=card.querySelector('.approach-card-copy').getBoundingClientRect();return c.bottom>r.bottom-10||c.right>r.right+1||t.bottom>c.top+1;});verify(!overflow,'Active card title/copy overlap');
   await page.locator('#property-url').fill('example.com');await page.locator('.dear-continue').click();await settle(page,800);verify(await page.locator('#property-url').inputValue()==='https://example.com','URL normalization failed');await shot(page,`${width}-${lang}-letter-expanded`);
   await copyMatches(page,lang);
   for(const route of ['expertise','approach','studio','inquire']){
    await page.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await settle(page,250);verify(await page.locator('html').getAttribute('lang')===lang,'Language lost on '+route);await copyMatches(page,lang);await shot(page,`${width}-${lang}-${route}`);
    verify(await page.locator('h1').count()===1,'Invalid heading count on '+route);
    const offscreen=await page.locator('main h1, main h2, .v2-inquiry-form').evaluateAll(els=>els.some(el=>{const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}));verify(!offscreen,'Heading/form overflow on '+route);
   }
   verify(!errors.length,'Browser errors: '+errors.join('; '));verify(!missing.length,'Missing assets: '+missing.join('; '));await context.close();
  });
 }
 await test('Keyboard boundary, close proxy, responsive lifecycle and language persistence',async()=>{
  const context=await browser.newContext({viewport:{width:1440,height:900}});await block(context);await context.addInitScript(()=>sessionStorage.setItem('exif-intro-seen','1'));let page=await home(context,base);
  await page.locator('.nav-toggle').focus();await page.keyboard.press('Enter');await settle(page,700);await page.keyboard.press('Tab');verify(await page.locator('.v1-nav-link').first().evaluate(el=>el===document.activeElement),'First Tab did not enter drawer');const order=['home','expertise','approach','studio','inquire','dear','instagram','linkedin','language','close'];for(let i=1;i<order.length;i++){await page.keyboard.press('Tab');const actual=await page.evaluate(()=>{const a=document.activeElement;return a.dataset.route||(a.hasAttribute('data-primary-cta')?'inquire':a.hasAttribute('data-dear-route')?'dear':a.classList.contains('lang-toggle')?'language':a.classList.contains('exif-close-proxy')?'close':a.textContent.trim().toLowerCase());});verify(actual===order[i],'Keyboard order skips '+order[i]);}await page.keyboard.press('Tab');verify(await page.locator('.v1-nav-link').first().evaluate(el=>el===document.activeElement),'Forward focus cycle lost');await page.keyboard.press('Shift+Tab');verify(await page.locator('.exif-close-proxy').evaluate(el=>el===document.activeElement),'Reverse tab not trapped at proxy');await page.keyboard.press('Tab');verify(await page.locator('.v1-nav-link').first().evaluate(el=>el===document.activeElement),'Proxy Tab did not wrap');
  await page.setViewportSize({width:390,height:900});await settle(page,500);verify(!await page.locator('body').evaluate(el=>el.classList.contains('nav-open')),'Resize stranded drawer');verify(!await page.locator('main').evaluate(el=>el.inert),'Resize stranded background');
  await page.locator('.site-header .lang-toggle').click();verify(await page.locator('html').getAttribute('lang')==='es','Spanish switch failed');await page.locator('.hero-actions [data-primary-cta]').click();await page.waitForURL(/\/inquire(?:\.html)?\?/);verify(await page.locator('html').getAttribute('lang')==='es','Spanish transition lost');await page.goBack();await settle(page,700);verify(!await page.locator('html').evaluate(el=>el.classList.contains('exif-transition-out')),'History cover stuck');
  await page.setViewportSize({width:1440,height:900});await settle(page,600);verify(await page.locator('.exif-hero-title-cream').count()===1,'Responsive split-color not mounted');await page.locator('.nav-toggle').click();await settle(page,500);verify(await page.locator('.exif-close-proxy').count()===1,'Desktop proxy not mounted after resize');await page.keyboard.press('Escape');await settle(page,900);await context.close();
 });
 await test('Inquiry validation, duplicate guard, bilingual failures, retry and truthful success',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:900}});await block(context);let calls=0;await context.route('https://formspree.io/**',async route=>{calls++;await new Promise(r=>setTimeout(r,180));await route.fulfill({status:calls===1?500:200,contentType:'application/json',body:'{}'});});
  const page=await context.newPage();await page.goto(base+'/inquire');await page.evaluate(()=>{window.qaEvents=[];window.addEventListener('exif:measure',e=>qaEvents.push(e.detail));});
  await page.locator('#discovery-inquiry button').click();verify(calls===0,'Invalid inquiry sent');
  for(const [id,value]of [['inquiry-name','QA Guest'],['inquiry-email','guest@example.com'],['inquiry-property','Example property']])await page.locator('#'+id).fill(value);await page.locator('#inquiry-role').selectOption('owner');await page.locator('#inquiry-context').selectOption('opening');await page.locator('#inquiry-message').fill('Private context');
  await page.locator('#discovery-inquiry').evaluate(form=>{form.requestSubmit();form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});await page.locator('.site-header .lang-toggle').click();await settle(page,350);verify(calls===1,'Duplicate inquiry');verify((await page.locator('.v2-form-status').textContent()).includes('No pudimos'),'Failure not translated');verify(await page.locator('#inquiry-message').inputValue()==='Private context','Failed inquiry lost');
  await page.locator('#discovery-inquiry button').click();await page.locator('#inquiry-received').waitFor({state:'visible'});verify(calls===2,'Retry missing');verify((await page.locator('#inquiry-received').textContent()).includes('horarios disponibles'),'Success implies a booked meeting');verify(await page.locator('#inquiry-received').evaluate(el=>el===document.activeElement),'Receipt focus missing');
  const events=await page.evaluate(()=>qaEvents);verify(events.filter(e=>e.event==='inquiry_form_success').length===1,'Success measurement incorrect');verify(!JSON.stringify(events).includes('Guest')&&!JSON.stringify(events).includes('private')&&!JSON.stringify(events).includes('@'),'Personal data leaked');await context.close();
 });
 await test('Dear EXIF still preserves drafts and reports mocked successful letters',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:900}});await block(context);await context.addInitScript(()=>sessionStorage.setItem('exif-intro-seen','1'));let calls=0;await context.route('https://formspree.io/**',route=>{calls++;return route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  const page=await home(context,base);await page.locator('#property-url').fill('https://example.com');await page.locator('.dear-continue').click();await page.locator('[name="message"]').fill('A draft');await page.locator('[name="name"]').fill('QA Guest');await page.locator('[name="email"]').fill('guest@example.com');await page.goto(base+'/studio');await page.goto(base+'/#dear-exif');verify(await page.locator('[name="message"]').inputValue()==='A draft','Letter draft lost across pages');await page.locator('.dear-send').click();await page.locator('.dear-received').waitFor({state:'visible'});verify(calls===1,'Letter request count');verify(await page.evaluate(()=>sessionStorage.getItem('exif-dear-draft')===null),'Successful draft retained');await context.close();
 });
 await test('Gallery manual controls, pause, reduced motion and pointer drag',async()=>{
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await block(context);const page=await home(context,base);await page.locator('.gallery-chapter').scrollIntoViewIfNeeded();await settle(page,700);
  const track=page.locator('.motion-gallery-track'),before=await track.getAttribute('style');await page.locator('[data-gallery-step="next"]').click();verify(await track.getAttribute('style')!==before,'Reduced-motion arrow failed');let after=await track.getAttribute('style');await page.locator('.motion-gallery-viewport').dispatchEvent('wheel',{deltaX:100,deltaY:0});verify(await track.getAttribute('style')!==after,'Horizontal wheel failed');
  const box=await page.locator('.motion-gallery-viewport').boundingBox();after=await track.getAttribute('style');await page.mouse.move(box.x+box.width*.65,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.35,box.y+box.height*.5,{steps:8});await page.mouse.up();verify(await track.getAttribute('style')!==after,'Pointer drag failed');verify(await page.locator('[data-gallery-pause]').isDisabled(),'Reduced-motion auto control enabled');verify(await page.locator('.capability-run').first().evaluate(el=>getComputedStyle(el).animationName)==='none','Reduced-motion rail animates');await shot(page,'1440-en-reduced');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();await page.locator('.gallery-chapter').scrollIntoViewIfNeeded();await settle(page,500);await page.locator('[data-gallery-pause]').click();await settle(page,300);after=await track.getAttribute('style');await settle(page,350);verify(await track.getAttribute('style')===after,'Paused gallery still cruises');await context.close();
 });
 await test('No-JavaScript navigation and form fallback remain reachable',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false});await block(context);const page=await context.newPage();for(const route of ['','/expertise','/approach','/studio','/inquire']){await page.goto(base+route);verify(await page.locator('.v2-nojs-nav').isVisible(),'No-JS navigation missing');verify(await page.locator('h1').isVisible(),'No-JS heading hidden');}
  await page.goto(base);verify(await page.locator('.dear-send').isVisible(),'No-JS letter fields hidden');await shot(page,'390-en-no-js');await context.close();
 });
 await test('Failed and slow images release loader and keep the inquiry route usable',async()=>{
  for(const mode of ['failed','slow']){const context=await browser.newContext({viewport:{width:390,height:900}});await block(context);await context.route('**/assets/img/exif-fullbleed.jpg',async route=>{if(mode==='slow')await new Promise(r=>setTimeout(r,4500));await route.abort();});const page=await home(context,base);verify(!await page.locator('body').evaluate(el=>el.classList.contains('exif-intro-running')),'Image failure locks scroll');verify(await page.locator('.exif-hero-bg').evaluate(el=>el.complete&&el.naturalWidth>0),'Fallback image unavailable');await page.locator('.hero-actions [data-primary-cta]').click();await page.waitForURL(/\/inquire(?:\.html)?\?/);await context.close();}
 });
 await test('Mock provider URL switches the interface without duplicated qualification',async()=>{
  const context=await browser.newContext();await block(context);await context.route('**/assets/js/site-config.js',route=>route.fulfill({contentType:'text/javascript',body:'window.EXIF_CONFIG={schedulingUrl:"https://calendar.example.org/exif-discovery"};'}));const page=await context.newPage();await page.goto(base+'/inquire');verify(await page.locator('#discovery-inquiry').isHidden(),'Provider flow duplicates questions');verify(await page.locator('[data-scheduling]').getAttribute('href')==='https://calendar.example.org/exif-discovery','Provider link missing');verify((await page.locator('#provider-inquiry').textContent()).includes('confirmed by the provider'),'Provider confirmation copy incorrect');await context.close();
 });
 fs.writeFileSync(path.join(artifactRoot,'browser-results.json'),JSON.stringify({cases:results.length,assertions:checks,passed:results},null,2));console.log(results.length+' browser cases / '+checks+' assertions passed');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));});
