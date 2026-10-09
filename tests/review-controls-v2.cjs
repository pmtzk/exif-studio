/* Supplemental real-browser review checks. Start the V2 clean-route server on :8080 first.
   External traffic blocked. No form submissions or deployment. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const checks=[];const origin=process.env.EXIF_V2_ORIGIN||'http://127.0.0.1:8080';
try{for(const width of [1440,390,768,1024])for(const lang of ['en','es']){const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<1100});await c.route('https://**/*',r=>r.abort());await c.addInitScript(lang=>{localStorage.setItem('exif-language',lang);sessionStorage.setItem('exif-intro-seen','1')},lang);const p=await c.newPage(),consoleErrors=[];p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('net::ERR_FAILED'))consoleErrors.push(m.text())});await p.goto(origin);await p.waitForTimeout(1600);assert((await p.locator('.hero-actions [data-primary-cta]').textContent()).includes(lang==='en'?'Discuss Your Property':'Hablemos de tu propiedad'));
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.locator('.nav-toggle').click();await p.waitForTimeout(700);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.keyboard.press('Escape');await p.waitForTimeout(750);
await p.locator('.gallery-chapter').scrollIntoViewIfNeeded();await p.waitForTimeout(800);const track=p.locator('.motion-gallery-track');await p.locator('[data-gallery-pause]').click();await p.waitForTimeout(350);let before=await track.getAttribute('style');const box=await p.locator('.motion-gallery-viewport').boundingBox();await p.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await p.mouse.wheel(120,0);await p.waitForTimeout(400);assert.notEqual(await track.getAttribute('style'),before,'Native horizontal wheel failed');const y=await p.evaluate(()=>scrollY);await p.mouse.wheel(0,220);await p.waitForTimeout(450);assert(await p.evaluate(()=>scrollY)>y+40,'Native vertical wheel blocked');assert.deepEqual(consoleErrors,[]);
for(const route of ['/','/expertise','/approach','/studio','/inquire']){const response=await p.goto(origin+route);assert.equal(response.status(),200);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
for(const route of ['/visual-direction-production','/visual-direction-production.html']){const response=await c.request.get(origin+route,{maxRedirects:0});assert.equal(response.status(),301);assert.equal(response.headers().location,'/');}
checks.push(`${width}px ${lang}: CTA, home/drawer/five-page overflow, native wheel X/Y, console, routes and legacy redirects`);console.log('PASS '+checks.at(-1));await c.close();}
const decodedGallery=[];
for(const width of [1440,390,768,1024]){
 const values=[];
 for(const baseline of [true,false]){
  const c=await browser.newContext({viewport:{width,height:900}}),p=await c.newPage();await c.route('https://**/*',r=>r.abort());
  await p.goto(baseline?(process.env.EXIF_V1_ORIGIN||'http://127.0.0.1:8081'):origin);
  await p.locator('.motion-gallery-track img').evaluateAll(es=>es.slice(0,13).forEach(e=>e.loading='eager'));
  await p.locator('.motion-gallery-track img').evaluateAll(es=>Promise.all(es.slice(0,13).map(e=>e.decode())));
  values.push(await p.locator('.motion-gallery-track img').evaluateAll(es=>es.slice(0,13).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})));
  await c.close();
 }
 assert.deepEqual(values[0],values[1],'Decoded original gallery framing changed at '+width);
 decodedGallery.push({width,same:true,v1:values[0],v2:values[1]});console.log('PASS '+width+'px decoded gallery frame comparison');
}
fs.mkdirSync('docs/review-v2',{recursive:true});fs.writeFileSync('docs/review-v2/decoded-gallery-results.json',JSON.stringify(decodedGallery,null,2));fs.writeFileSync('docs/review-v2/supplemental-results.json',JSON.stringify({cases:checks.length,checks},null,2));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
