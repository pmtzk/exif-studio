/* Native Chromium touch emulation, including clipping fallback and short viewports.
   Requires Playwright, Chromium and a local static server (EXIF_TEST_ORIGIN).
   Run python3 -m http.server 8000 --bind 127.0.0.1, then node tests/touch-v2.cjs.
   No external requests or real form submissions. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const origin=process.env.EXIF_TEST_ORIGIN||'http://127.0.0.1:8000';
const artifacts=process.env.EXIF_ARTIFACT_DIR||'/workspace/artifacts/exif-v2/after';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.EXIF_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const passed=[];
 try{
  for(const width of [360,390,768,860,1024,1440]){
   const context=await browser.newContext({viewport:{width,height:900}});await context.route('https://**/*',r=>r.abort());await context.addInitScript(()=>{localStorage.setItem('exif-language','es');sessionStorage.setItem('exif-intro-seen','1');});const page=await context.newPage();await page.goto(origin+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1400);
   const text=await page.locator('.exif-hero-copy h1:not([aria-hidden]) .line:last-child .word').evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect();return {left:r.left,right:r.right};});assert(text.right<=width+1&&text.left>=0,'Spanish title clipped at '+width);
   const cta=await page.locator('.hero-actions [data-primary-cta]').boundingBox();assert(cta.y+cta.height<900,'CTA outside viewport');await page.screenshot({path:artifacts+'/'+width+'-es-hero.png'});await page.locator('.nav-toggle').click();await page.waitForTimeout(850);await page.screenshot({path:artifacts+'/'+width+'-es-drawer.png'});passed.push('Final Spanish title and CTA bounds '+width);console.log('PASS '+passed.at(-1));await context.close();
  }
  for(const fallback of [false,true]){
   const context=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await context.route('https://**/*',r=>r.abort());const page=await context.newPage();await page.goto(origin+'/');await page.locator('.gallery-chapter').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
   if(fallback)await page.addStyleTag({content:'.motion-gallery,.motion-gallery-viewport{overflow:visible!important;clip-path:inset(0)!important;overscroll-behavior:auto!important}'});
   const session=await context.newCDPSession(page);
   async function swipe(x,y,dx,dy){await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});for(let i=1;i<=10;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/10,y:y+dy*i/10,id:1}]});await page.waitForTimeout(20);}await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250);}
   let box=await page.locator('.motion-gallery-viewport').boundingBox();const beforeY=await page.evaluate(()=>scrollY);await swipe(195,Math.min(700,box.y+box.height*.5),0,-120);assert(await page.evaluate(()=>scrollY)>beforeY+40,'Native vertical gallery swipe blocked');
   await page.locator('.gallery-chapter').scrollIntoViewIfNeeded();await page.waitForTimeout(500);box=await page.locator('.motion-gallery-viewport').boundingBox();const before=await page.locator('.motion-gallery-track').getAttribute('style');await swipe(270,Math.min(700,box.y+box.height*.5),-130,0);assert(await page.locator('.motion-gallery-track').getAttribute('style')!==before,'Horizontal reduced-motion gallery swipe failed');passed.push('Native emulated touch: '+(fallback?'clip-path fallback':'overflow:clip'));console.log('PASS '+passed.at(-1));await context.close();
  }
  for(const [width,height] of [[360,640],[390,700],[768,540],[860,600]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await context.route('https://**/*',r=>r.abort());const page=await context.newPage();await page.goto(origin+'/');await page.locator('.nav-toggle').click();await page.waitForTimeout(300);const dear=page.locator('.v1-nav-dear');await dear.scrollIntoViewIfNeeded();assert(await dear.isVisible(),'Short drawer invitation unreachable');await page.keyboard.press('Escape');await page.waitForTimeout(300);await page.locator('.approach-card[data-approach="create"]').scrollIntoViewIfNeeded();await page.locator('.approach-card[data-approach="create"]').click();await page.waitForTimeout(400);const fits=await page.locator('.approach-card.is-active').evaluate(card=>{const r=card.getBoundingClientRect(),t=card.querySelector('.approach-card-title').getBoundingClientRect(),c=card.querySelector('.approach-card-copy').getBoundingClientRect();return c.bottom<=r.bottom&&c.top>=t.bottom;});assert(fits,'Short viewport card overlaps');passed.push('Short viewport drawer/cards '+width+'x'+height);console.log('PASS '+passed.at(-1));await context.close();
  }
  fs.mkdirSync(artifacts,{recursive:true});fs.writeFileSync(artifacts+'/touch-results.json',JSON.stringify({cases:passed.length,passed},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
