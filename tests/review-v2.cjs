/* Review evidence only. Start clean-route static servers for checkpoint/V2 first.
   EXIF_V1_ORIGIN defaults to :8081; EXIF_V2_ORIGIN to :8080.
   Blocks external traffic, mocks forms; never deploys or sends real inquiries. */
const {chromium,webkit}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const output=process.env.EXIF_REVIEW_DIR||path.resolve(__dirname,'../docs/review-v2');
const engine=process.env.EXIF_REVIEW_ENGINE||'chromium';
const fullOnly=process.env.EXIF_REVIEW_FULL_ONLY==='1';
const results=fullOnly?JSON.parse(fs.readFileSync(path.join(output,`${engine}-capture-results.json`),'utf8')):{engine,capturedAt:new Date().toISOString(),captures:[],checks:[],errors:[],missing:[],geometry:{}};
const origins={v1:process.env.EXIF_V1_ORIGIN||'http://127.0.0.1:8081',v2:process.env.EXIF_V2_ORIGIN||'http://127.0.0.1:8080'};
const homeStates=[['comparison','.editorial-choice'],['gallery','.gallery-chapter'],['cards','.exif-approach'],['recognition','.recognition-section'],['dear-exif','#dear-exif'],['footer','.site-footer']];
const additions=[['positioning','.v2-introduction'],['in-practice','.v2-practice'],['closing-invitation','.v2-invitation']];
const sleep=(page,n=150)=>page.waitForTimeout(n);
(async()=>{
 const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{}:{executablePath:process.env.EXIF_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 for(const width of [1440,390,768,1024])for(const lang of ['en','es'])for(const version of ['v1','v2']){
  const dir=path.join(output,'images',version);fs.mkdirSync(dir,{recursive:true});
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<1100,isMobile:width===390});
  await context.route('**/*',r=>new URL(r.request().url()).origin===origins[version]?r.continue():r.abort());
  let sent=0;await context.route('https://formspree.io/**',r=>{sent++;return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
  await context.addInitScript(({lang,fullOnly})=>{localStorage.setItem('exif-language',lang);if(fullOnly)sessionStorage.setItem('exif-intro-seen','1')},{lang,fullOnly});
  const page=await context.newPage();page.on('pageerror',e=>results.errors.push(`${version}/${width}/${lang}: ${e.message}`));page.on('response',r=>{if(r.url().startsWith(origins[version])&&r.status()>=400)results.missing.push(r.url())});
  async function shot(name,fullPage=false){if(fullPage)await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await sleep(page);const file=`${width}-${lang}-${name}.jpg`;await page.screenshot({path:path.join(dir,file),type:'jpeg',quality:80,fullPage});results.captures.push(`images/${version}/${file}`)}
  if(fullOnly){
   await page.goto(origins[version]+'/');await page.waitForFunction(()=>document.body.classList.contains('exif-header-ready'));
   for(const [,sel]of [...homeStates,...(version==='v2'?additions:[])]){await page.locator(sel).scrollIntoViewIfNeeded();await sleep(page,350)}
   const target=page.locator('.approach-card[data-approach="create"]');await target.scrollIntoViewIfNeeded();await target.click();await sleep(page,650);await shot('home-overview',true);
   await page.goto(origins[version]+'/studio.html');await page.locator('.founder-letter').scrollIntoViewIfNeeded();await sleep(page,500);await shot('founder-letter',true);
   if(version==='v2'){
    await page.goto(origins.v2+'/inquire');
    for(const [id,v]of [['inquiry-name','Review Guest'],['inquiry-email','guest@example.com'],['inquiry-property','Review property']])await page.locator('#'+id).fill(v);
    await page.locator('#inquiry-role').selectOption('owner');await page.locator('#inquiry-context').selectOption('opening');await page.locator('#discovery-inquiry button').click();await page.locator('#inquiry-received').waitFor({state:'visible'});assert(sent===1);await shot('inquiry-confirmation',true);
   }
   console.log(`FULL PAGE ${version} ${width}px ${lang}`);await context.close();continue;
  }
  await page.goto(origins[version]+'/');await sleep(page,650);await shot('loader');await page.waitForFunction(()=>document.body.classList.contains('exif-header-ready'));await sleep(page,1600);await shot('hero');
  results.geometry[`${version}/${width}/${lang}`]=await page.locator('.exif-hero-copy').boundingBox();
  assert(await page.locator('html').getAttribute('lang')===lang);
  const heroState=await page.locator('.exif-hero-bg').evaluate(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}));assert(heroState.loaded);
  await page.locator('.nav-toggle').click();await sleep(page,950);await shot('drawer-open');
  await page.keyboard.press('Escape');await sleep(page,950);await shot('drawer-closed');
  for(const [name,sel]of [...homeStates,...(version==='v2'?additions:[])]){await page.locator(sel).scrollIntoViewIfNeeded();await sleep(page,750);await shot(name)}
  const images=await page.locator('.motion-gallery-track img').evaluateAll(is=>is.slice(0,13).map(i=>i.getAttribute('src')));const railFont=await page.locator('.capability-frame').first().evaluate(e=>getComputedStyle(e).font);const arrowFont=await page.locator('[data-gallery-step="next"]').evaluate(e=>getComputedStyle(e).font);results.checks.push({version,width,lang,hero:heroState.src,images,railFont,arrowFont});
  for(const card of ['observe','decide','create']){const target=page.locator(`.approach-card[data-approach="${card}"]`);await target.scrollIntoViewIfNeeded();await target.click();await sleep(page,600);assert(await target.getAttribute('aria-expanded')==='true');await shot(`card-${card}`)}
  await shot('home-overview',true);
  await page.locator('#property-url').fill('example.com');await page.locator('.dear-continue').click();await sleep(page,700);await shot('dear-expanded');
  await page.locator('[name="message"]').fill('Review test — mocked only');await page.locator('[name="name"]').fill('Review Guest');await page.locator('[name="email"]').fill('guest@example.com');await page.locator('.dear-send').click();await page.locator('.dear-received').waitFor({state:'visible'});assert(sent===1);await shot('dear-confirmation');
  await page.goto(origins[version]+'/studio.html');await sleep(page,700);await shot('studio',true);await page.locator('.founder-letter').scrollIntoViewIfNeeded();await shot('founder-letter',true);
  if(version==='v2'){
   for(const route of ['expertise','approach','inquire']){await page.goto(origins.v2+'/'+route);await sleep(page,700);assert(await page.locator('html').getAttribute('lang')===lang);assert(await page.locator('h1').count()===1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow: '+route);await shot(route,true)}
   await page.goto(origins.v2+'/');await page.waitForFunction(()=>document.body.classList.contains('exif-header-ready'));await page.locator('.hero-actions [data-primary-cta]').click();await page.waitForURL('**/inquire?**');
   for(const [id,v]of [['inquiry-name','Review Guest'],['inquiry-email','guest@example.com'],['inquiry-property','Review property']])await page.locator('#'+id).fill(v);
   await page.locator('#inquiry-role').selectOption('owner');await page.locator('#inquiry-context').selectOption('opening');await page.locator('#discovery-inquiry button').click();await page.locator('#inquiry-received').waitFor({state:'visible'});assert(sent===2);assert(await page.locator('#inquiry-received').evaluate(e=>e===document.activeElement));await shot('inquiry-confirmation',true);
  }
  console.log(`CAPTURE ${version} ${width}px ${lang}`);await context.close();
 }
 for(const width of [1440,390,768,1024])for(const lang of ['en','es']){const a=results.checks.find(c=>c.version==='v1'&&c.width===width&&c.lang===lang),b=results.checks.find(c=>c.version==='v2'&&c.width===width&&c.lang===lang);assert.deepEqual(a.images,b.images,'Rendered gallery sequence changed');assert.equal(a.hero,b.hero,'Rendered hero source changed');assert.equal(a.railFont,b.railFont,'Original recognition/gallery rail typography changed');assert.equal(a.arrowFont,b.arrowFont,'Original gallery arrow typography changed')}
 results.captures=[...new Set(results.captures)];if(fullOnly){results.fullPageRecapturedAt=new Date().toISOString();results.fullPageCaptureRule='Full-page screenshots scroll to top first, avoiding fixed header/hidden skip-link artifacts at the previous scroll position.'}
 assert.deepEqual(results.errors,[]);assert.deepEqual(results.missing,[]);fs.writeFileSync(path.join(output,`${engine}-capture-results.json`),JSON.stringify(results,null,2));console.log(fullOnly?'40 full-page captures corrected at scroll top; 8 additional mocked receipts; original capture checks retained.':`${results.captures.length} captures; 8 V1/V2 photo-sequence pairs; 16 mocked Dear submissions; 8 complete discovery journeys; no page errors/missing assets.`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
