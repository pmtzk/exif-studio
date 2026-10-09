# EXIF Studio — interaction reference study

Research run: **2026-10-09, 03:25–03:47 UTC**. Baseline: `2289050f0eeb150a337019facf9372ec158846fb`, branch `feat/exif-creative-experience-v3-2026-10-09`. Research only. Website source, branches and production were not changed.

**Published evidence:** [GitHub Release](https://github.com/pmtzk/exif-studio/releases/tag/exif-reference-research-2026-10-09) · [Download the six evidence archives](https://github.com/pmtzk/exif-studio/blob/feat/exif-creative-experience-v3-2026-10-09/docs/research/evidence-downloads/README.md).

The six ZIPs together include this report, the portable evidence viewer, 211 live screenshots, 29 recordings and diagnostic logs. Extract all six into the same folder, then open `docs/research/reference-evidence/index.html`. Relative evidence links below resolve inside the extracted packet. GitHub's release asset upload endpoint returned HTTP 401 for both the full ZIP and a tiny test ZIP, so the archives are available as ordinary GitHub downloads under `docs/research/evidence-downloads/`, linked from the release page. Website files are unchanged.

## Findings for creative review

**The retry succeeded. All five original websites rendered successfully on desktop and mobile.** Each homepage was scrolled from arrival to footer; meaningful controls and navigation were exercised in the actual browser. The strongest direction for EXIF is **an editorial experience in which a visible piece of evidence changes as the visitor understands a decision**. Photography provides atmosphere; service artifacts, a process thread and annotated studies explain the work.

The five proposed implementation priorities are:

1. **Demonstrate service decisions through a changing artifact** — What We Do.
2. **Create one bounded photographic passage into the editorial narrative** — homepage, beside the existing photographic sequence.
3. **Carry one visual thread through the five process stages** — Approach.
4. **Reveal the reasoning behind an editorial decision in explicit layers** — In Practice.
5. **Make navigation a clear editorial preview with direct destinations** — existing drawer.

These are proposals for approval, not implemented changes. The exact behaviors, feasibility and acceptance criteria appear at the end of this study.

Open the [portable evidence viewer](reference-evidence/index.html) after extracting the research ZIP. The [evidence index](reference-evidence/README.md) explains screenshots, short recordings, timestamps and diagnostics. Screenshots illustrate states; the recordings and action logs establish interactions.

## Method and evidence boundaries

- Actual Chromium `151.0.7922.173`, controlled through Playwright, with certificate verification enabled. Desktop viewport **1440 × 900**; mobile **390 × 844**, touch enabled, device scale 1.
- Original pages loaded in fresh desktop/mobile contexts. Initial document responses were HTTP 200 in all ten reference visits; page title, visible identity and loaded media were checked. This is stronger evidence than a successful HTTP probe alone.
- Native wheel events traversed the homepages. Direct positioning was used to revisit specific states, then native hover, click or tap exercised controls. The log distinguishes wheel input from `scrollTo` revisits. Some sites amplify wheel deltas through their own scrolling code.
- Mobile inspection includes full narrow-viewport homepage journeys, native taps, and a separate fresh-context check using **CDP native touch-start/move/end input**. All five references scrolled in that touch check; see [native-touch-results.json](reference-evidence/live/native-touch-results.json). This remains browser emulation, not an iPhone/Safari or physical-device test.
- Each main page was inspected from beginning to end, plus selected internal destinations: Tengile `/about`, White Desert `/camps/whichaway-camp`, Documentary `/courses/documentary-foundations`, Horeca `#services`/`#workflow`, Vero `/process`. This is not an audit of every route or product flow. Vero's desktop Process page was additionally scrolled through its four stages to the footer.
- Screenshots were taken during live navigation and scrolling. MP4 clips are excerpts of real browser recordings at their original speed, not animations assembled from screenshots. No audio was captured. Native-touch clips are separate recordings.
- [interaction-log.json](reference-evidence/live/interaction-log.json) records UTC action times, URLs, results, actual scroll positions, errors and media readiness. `*-scroll-samples.json` records visible geometry and computed transforms during the journeys. A DOM node's presence alone was not treated as visual evidence: hidden menus and duplicate animated text also appear in the DOM.
- Technique descriptions distinguish **measured CSS/DOM behavior**, **identified runtime tools**, and **our proposed EXIF implementation**. Absent global variables do not prove a bundled library is absent. No frame-rate, Lighthouse, full accessibility or reduced-motion compliance claim is made for the references.
- No forms were filled or submitted, messages sent, booking/purchase initiated, accounts accessed, or material copied into EXIF's production assets.

## Discovery sources

Both requested sources were opened successfully in the actual desktop browser. They were used to locate/verify originals, not to substitute an award description or embedded preview for live inspection.

| Source | Actual access and action | Evidence |
| --- | --- | --- |
| [Details inspiration](https://www.details.so/inspo) | HTTP 200; rendered inspiration index. Clicked the Tengile entry at `/inspo/site/tengilemalamala-com` and inspected its actual original-site Visit link. | [Index](reference-evidence/live/details-desktop-index.png), [original link](reference-evidence/live/details-tengile-original-link.png), [navigation recording](reference-evidence/live/details-desktop-discovery.mp4). |
| [Awwwards](https://www.awwwards.com/) | HTTP 200; rendered index. Clicked `/sites/tengile-malamala-collection` and inspected its original-site link to `https://tengilemalamala.com`. | [Index](reference-evidence/live/awwwards-desktop-index.png), [original link](reference-evidence/live/awwwards-tengile-original-link.png), [navigation recording](reference-evidence/live/awwwards-desktop-discovery.mp4). |

The user supplied the original Tengile, White Desert, Horeca and Vero URLs. The Art of Documentary's identity was verified from the rendered filmmaking academy at `theartofdocumentary.com`, including its named course pages. The successful discovery pass was desktop only; historical mobile discovery attempts failed before the environment fix. All five original references received successful desktop **and** mobile inspection.

## Research matrix

Priority ranks the value of adapting a principle to EXIF, not the overall quality of the reference. P1 = first implementation candidates; P2 = supporting direction with a bounded adaptation.

| Reference name | Original URL | Access status | Interaction observed | Visual evidence | Desktop/mobile differences | Technical feasibility | Proposed EXIF application | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tengile MalaMala | [tengilemalamala.com](https://tengilemalamala.com/) | Desktop/mobile HTTP 200; homepages and About rendered; full home journeys completed. | Playing hero preview; small image translations inside clipped, overscaled frames; native gallery Next changes photograph and 1/6 → 2/6; menu opening, link hover and About navigation; mobile footer disclosure. | [Photo composition](reference-evidence/live/tengile-desktop-scroll-02.png), [mobile gallery change](reference-evidence/live/tengile-mobile-gallery-next.png), [desktop live scroll](reference-evidence/live/tengile-desktop-scroll-review.mp4), [mobile controls](reference-evidence/live/tengile-mobile-controls.mp4). | Two-column compositions compress/stack. Separate mobile hero preview; explicit Watch Video affordance. Right-side desktop drawer becomes broad mobile panel; large gallery hit regions become small arrow controls. | High for EXIF adaptation: overflow clipping, bounded transforms and native buttons. Exact original animation engine unconfirmed. Preserve the existing gallery controller. | A restrained photograph-to-caption passage and visible gallery navigation; retain EXIF photography, type and color identity. | P1; proposal 2 |
| White Desert | [white-desert.com](https://white-desert.com/) | Desktop/mobile HTTP 200; homepages and Whichaway camp rendered; full home journeys completed. | Vertical input drives a long pinned Our Camps section and horizontal travel between cards/image panels. Experience hover changes button appearance; click opens navigation; camp link navigates. Mobile menu accordion expands. | [Desktop camp travel](reference-evidence/live/white-desktop-scroll-16.png), [mobile camp travel](reference-evidence/live/white-mobile-home-scroll-18.png), [desktop live scroll](reference-evidence/live/white-desktop-scroll-review.mp4), [mobile navigation](reference-evidence/live/white-mobile-controls.mp4). | Trips stack, but **the long pinned horizontal camps sequence remains on mobile**. Mobile has one Menu control and category accordions; desktop has top-level category tabs. | Moderate for a short EXIF continuity motif; high complexity/risk for a literal long pin. Fixed ancestors, pin spacers and measured X translations confirm the mechanism; specific library unconfirmed. | Approach: continuity between stages, with native anchors and a short finite visual scope. Proposed vertical mobile treatment is an EXIF adaptation, not White Desert's observed fallback. | P2; proposal 3 |
| The Art of Documentary | [theartofdocumentary.com](https://theartofdocumentary.com/) | Desktop/mobile HTTP 200; full home journeys completed after closing promotional overlays. Course navigation rendered. Main preview and desktop full trailer played. One alternate mobile preview request returned 403. | Narrative progression through promise, supporting outcomes, photographic testimony, course detail, included benefits and student work. Next changes testimony image/quote. Supporting-detail button expands text beside an image. Desktop course-menu hover shows a named course image; click/tap navigates. | [Testimony before](reference-evidence/live/documentary-desktop-home-scroll-02.png), [after](reference-evidence/live/documentary-desktop-testimonial-next.png), [expanded detail](reference-evidence/live/documentary-desktop-included-expanded.png), [detail recording](reference-evidence/live/documentary-desktop-details.mp4), [playing trailer](reference-evidence/live/documentary-desktop-trailer.mp4). | Course cards and benefits become a vertical reading sequence; menu prioritizes course links above a two-column page list. Desktop side image/preview disappears from the mobile menu/benefit composition. Mobile disclosure still works. | High for native disclosure and explicit evidence/decision states; moderate for synchronized frame changes. DOM buttons, CSS layout and HTML video observed; exact motion library unconfirmed. | In Practice: a shared editorial artifact with optional evidence and a visible interpretation/decision. Avoid importing sales popups, outcome claims or enrollment logic. | P1; proposal 4 |
| Horeca Social | [horeca-social.com](https://www.horeca-social.com/) | Desktop/mobile HTTP 200; services, workflow anchors and inquiry overlays worked; full home journeys completed. Mobile testimonial interval rendered blank, also on a fresh recheck. | Service panels overlap as scroll advances; associated media grows from a small inset to a large composition. Native CTA opens a service-choice inquiry modal. Desktop menu unfolds into inline section links; mobile menu becomes a full panel. | [Desktop service](reference-evidence/live/horeca-desktop-scroll-04.png), [mobile service](reference-evidence/live/horeca-mobile-scroll-04.png), [inquiry opening](reference-evidence/live/horeca-desktop-controls.mp4), [mobile blank recheck](reference-evidence/live/horeca-mobile-fresh-touch-testimonials-recheck.png), [desktop live scroll](reference-evidence/live/horeca-desktop-scroll-review.mp4). | Desktop service text sits beside media; mobile places media below text and CTA, while retaining panel overlaps and long theatrical sections. Portrait hero video changes source. Mobile menu uses explicit Services/Workflow destinations. | Moderate. GSAP, ScrollTrigger and Lenis runtime globals, Swiper script and Webflow markup positively identified. EXIF can adapt the content/media relationship with small scoped CSS/DOM state, without importing that stack. | What We Do: demonstrate each responsibility through a distinct artifact and retain immediately readable scope/deliverables. Copy the relationship between service and evidence, not pink branding or prolonged typographic spectacle. | P1; proposal 1 |
| Vero | [verostudio.com](https://www.verostudio.com/) | Desktop/mobile HTTP 200; full home journeys and Process navigation completed. It is a wedding-dress sculpture studio, not a hospitality studio. | Cinematic arrival; canvas-backed logo/media elements; aperture/scale changes; Dress → Data → Sculpture visual handoff with current-stage emphasis; small menu-trigger hover marker; large editorial menu; Process navigation. | [Desktop process transition](reference-evidence/live/vero-desktop-scroll-08.png), [mobile transition](reference-evidence/live/vero-mobile-scroll-08.png), [menu](reference-evidence/live/vero-desktop-menu.png), [desktop live scroll](reference-evidence/live/vero-desktop-scroll-review.mp4), [Process navigation](reference-evidence/live/vero-desktop-controls.mp4). | Separate portrait hero footage, icon-only header controls and smaller menu typography. **Spatial scene transitions persist on mobile**; the process phrase can extend beyond the narrow crop during transitions. | Moderate for clipping, bounded transforms and typographic hierarchy. Canvas is confirmed; rendering engine/3D implementation is not. No need to reproduce a canvas or 3D scene in EXIF. | Approach material continuity, homepage hierarchy and a composed navigation preview. Adapt restraint and meaning while keeping EXIF's established fonts, palette and hospitality voice. | P1; proposals 2, 3, 5 |

## 1. Tengile MalaMala — photography with a readable pace

**Desktop journey.** Arrival is a playing river/safari preview with a large offset serif statement. The page moves through an asymmetric introduction, accommodation, experiences/conservation, gallery, story, photographic inquiry and footer. The elephant/leopard pairing places the larger frame beside smaller text/image material rather than giving every element equal weight. Subsequent photographic sections alternate scale with substantial reading space.

The motion is observable, not inferred from the screenshots: at approximately page Y 687, 1389 and 2090, the elephant image's parallax parent changed vertical translation from about **−39.7px → 1.2px → 41.8px**, while the image remained overscaled around **1.12** inside an overflow-clipped frame. This moves the image content relative to its aperture while text continues in document flow. See [desktop geometry samples](reference-evidence/live/tengile-desktop-scroll-samples.json) and the scroll recording. The scale is a crop allowance, not proof of a user-triggered zoom.

**Controls.** Gallery Next changed the actual photograph and counter to 2/6. Menu opened a cream panel on the right; hovering Experiences changed link styling while the original hero preview continued playing. Continuing video frames were not attributed to the hover. About click loaded the original `/about` page. On mobile, Menu, gallery Next, About and footer Explore were exercised through touch taps.

**Mobile.** Reading becomes narrower and largely stacked; the hero uses a separate mobile preview file. Explicit video and arrow affordances replace broad desktop interaction areas. The mobile gallery's observed Next target is only about 40px square; EXIF should preserve generous touch targets rather than copy that dimension.

**EXIF value.** Let a frame, crop and caption change together at one meaningful boundary. Keep photographic focal points stable and the paragraph readable throughout. The reference does not justify animating every image or replacing EXIF's existing photographic/gallery system.

Evidence: [desktop scroll](reference-evidence/live/tengile-desktop-scroll-review.mp4), [gallery/menu](reference-evidence/live/tengile-desktop-controls.mp4), [mobile scroll](reference-evidence/live/tengile-mobile-scroll-review.mp4), [mobile menu](reference-evidence/live/tengile-mobile-menu.png), [native mobile pan](reference-evidence/live/tengile-mobile-native-pan.mp4).

## 2. White Desert — spatial continuity with a substantial scroll cost

**Desktop journey.** The playing Antarctica hero establishes a grid, panoramic scale and condensed headline. Reading/trips lead into Our Camps, a prolonged sequence of moving cards over large photographic panels. The page eventually releases the pin into further activities/information and a conventional footer.

The camps sequence is **vertical-scroll-driven horizontal movement**, not merely a horizontal image row. In its active interval, the media ancestor was fixed at the viewport top and a clipped wrapper's X translation changed roughly **0 → 1400 → 2983 → 3773 → 4200px** as page Y advanced through the scene. Pin spacers and measured transforms corroborate the footage. The desktop scene occupies thousands of pixels of vertical travel, roughly Y 6200–14750 before release. See [geometry samples](reference-evidence/live/white-desktop-scroll-samples.json).

**Controls.** Hovering Experience altered its button appearance; it did not open the menu. Clicking Experience opened a left category panel; hovering and clicking Whichaway reached the camp route. Mobile Menu opened a drawer, Experience expanded its list, the actual Close button dismissed it, and Whichaway tap navigated. A wheel attempt while the mobile menu was open correctly left the background at Y 0; those files are menu-lock diagnostics, not the completed home journey.

**Mobile.** Narrow trip layouts become vertical, but horizontal camps movement persists in a long pinned scene. Cards and adjacent image panels cross the narrow viewport. This is valuable evidence against assuming award-site interactions automatically become simple on mobile.

**EXIF value.** Maintain the identity of one working artifact between stages. Limit its travel and duration; use a normal vertical reading flow and direct anchors. The proposed mobile alternative is deliberately adapted to EXIF's reading needs.

Evidence: [desktop scroll](reference-evidence/live/white-desktop-scroll-review.mp4), [desktop navigation](reference-evidence/live/white-desktop-controls.mp4), [mobile full home](reference-evidence/live/white-mobile-scroll-review.mp4), [mobile accordion](reference-evidence/live/white-mobile-menu-expanded.png), [native mobile pan](reference-evidence/live/white-mobile-native-pan.mp4).

## 3. The Art of Documentary — claims become more persuasive beside evidence

**Desktop journey.** A playing cinematic preview introduces a direct promise. The page then presents capability/outcome statements, statistics, full photographic testimony, grouped course offers, included benefits, community/student work, films and purchasing choices before the footer. These are the academy's claims, not outcomes independently verified in this investigation.

The most useful interaction is a relationship between two content layers: a person/image and a testimony, or a benefit heading and its explanation. The testimony Next button changed the Ryan Wilkes composition to **Liam Hall and a different quote/image**. In-depth guided teaching expanded a short explanation beside the shared photograph; the control changed to View Less/minus. This adds information without replacing the whole page with another scene. Hovering the next benefit row supplied localized highlighting.

Opening the desktop menu and hovering Documentary Foundations displayed a corresponding course image at the right and highlighted the course title. Clicking it loaded the named course page; after the transition settled, its preview video was ready and playing. Mobile course tap also reached the rendered course page.

**Media.** Watch Trailer opened a full-film overlay. Its desktop video had readyState 4 and advancing playback time (about 5.6s after opening); the actual image was captured. The close button returned to the homepage. This validates visual playback, not audio quality or the entire film.

**Mobile.** Cards and benefits become a longer vertical document; the expanded benefit is still readable. The menu lists courses first, followed by page links in two columns; the desktop side preview is absent. An automatically appearing waitlist promotion locked the background on both widths. It was closed without submitting anything before completing the home journeys.

**EXIF value.** Place a specific observation next to its interpretation and reveal supporting detail by choice. The proposed Observe / Interpret / Decide chain is our EXIF adaptation; that exact three-state interface was **not** observed on AOD. Do not copy its commercial urgency, pricing panels, numerical claims or automatic waitlist interruption.

Evidence: [desktop full scroll](reference-evidence/live/documentary-desktop-scroll-review.mp4), [changed testimony](reference-evidence/live/documentary-desktop-testimonial-next.png), [expanded detail recording](reference-evidence/live/documentary-desktop-details.mp4), [course-menu hover](reference-evidence/live/documentary-desktop-course-menu-hover.png), [mobile disclosure](reference-evidence/live/documentary-mobile-included-expanded.png), [native mobile pan](reference-evidence/live/documentary-mobile-native-pan.mp4).

## 4. Horeca Social — services as distinct compositions

**Desktop journey.** After the moving hero and agency-scale figures, three service panels introduce Content Creation, Influencer Marketing and Social Media Marketing. Service names, short scope and project CTA sit beside associated media. Scrolling layers successive panels and increases the image/video scale; later sections use oversized typographic sequences, partners, testimony, workflow, a further slogan and contact/footer.

The first service media wrapper increased from roughly **scale 0.3 near Y 1393 to scale 1 near Y 2788**. That was driven by scrolling. Hovering the media was tested, but it did not establish a separate service-selection or preview mechanism. Do not describe the reference as a three-tab selector: the observed service presentation is a scrolling panel sequence.

**Controls.** Project CTA opened a white inquiry composition over a dimmed service background. It included explicit service choices, information fields and a submit button; no fields or submission were used. Its close control returned to the original page position. Desktop Menu unfolded into inline Services/References/Workflow/Contact links; visible Workflow click updated the hash and traveled to its section. On mobile Menu produced a full panel, Services tap navigated to `#services`, and the service project CTA opened the inquiry composition.

**Mobile and limitation.** Service media follows the text/CTA. A separate portrait hero video loads. Panel overlaps and extended typography persist. The testimonial region showed a large blank pale interval around Y 9000 and through several subsequent samples. It stayed blank after a six-second recheck and after a fresh mobile context with a five-second settle. DOM geometry showed a large pin spacer and testimony cards far below the viewport; all 20 images eventually loaded in the main context. The cause is not established. The later testimonial cards, workflow and footer did render. This is an observed behavior in this Chromium environment, not a claim that every visitor sees a production defect.

**Technique.** Runtime inspection positively found GSAP, ScrollTrigger and Lenis; loaded Swiper and Webflow/JQuery assets are recorded. Their availability does not make them necessary for EXIF. The transferable idea is coordination of service meaning and visual material, not its dependency stack or long pins.

**EXIF value.** Give each service a visibly different output and explain what professional choice caused it. Keep service descriptions readable independently. The artifact state selector proposed below extends EXIF's existing folios; it is not attributed to Horeca as an observed control.

Evidence: [desktop scroll](reference-evidence/live/horeca-desktop-scroll-review.mp4), [desktop inquiry](reference-evidence/live/horeca-desktop-project-dialog.png), [mobile service](reference-evidence/live/horeca-mobile-scroll-04.png), [mobile inquiry opening](reference-evidence/live/horeca-mobile-controls.mp4), [fresh blank recheck](reference-evidence/live/horeca-mobile-fresh-touch-testimonials-recheck.png), [native mobile pan](reference-evidence/live/horeca-mobile-native-pan.mp4).

## 5. Vero — a transformation that belongs to the product

**Identity and journey.** This exact user-supplied Vero is a fine-art studio turning wedding dresses into sculptures. Its relevance is luxury composition and the way a material transformation explains its product, not hospitality positioning. The homepage moves from cinematic arrival into the sculptural object and explanation, Dress → Data → Sculpture, commission/craft storytelling, an image field/gallery, founder material and footer.

The three-part transition preserves the subject while scene boundaries and emphasis change. On desktop its media wrapper changed from about **scale 0.833** with an inset polygon clip to a full aperture/scale 1 over the inspected scroll interval. Related images also translated laterally within cropped frames. The three labels remain a shared statement while the current material/stage gains emphasis. This makes motion causal: the dress is captured as data and becomes the object.

Canvas elements are present, including a persistent logo element. Their presence does **not** prove WebGL, Three.js or a specific 3D engine. No engine attribution is made. The scene change can inspire a much lighter DOM/CSS implementation in EXIF.

**Controls.** Hovering the desktop Menu trigger showed a small diamond marker/label treatment. Menu click opened a large cream typographic route sheet. Hovering Process and clicking it reached `/process`; its four stages were Commission, Capture, Create and Deliver. Mobile icon Menu, Close and Process navigation worked through native taps. Purchase and newsletter controls were not activated.

**Mobile.** Portrait footage uses a different source from desktop. The header condenses to menu/order icons, and route lettering reduces to fit. The scene transition remains spatial; during its intermediate positions some of the process phrase extends beyond the viewport. This supports using shorter, fully readable stage labels in EXIF, not assuming scale-down alone preserves meaning.

**EXIF value.** Connect the evolution of a brief, evidence, hierarchy and deliverable using one authored artifact. Borrow the controlled scale relationships and small interaction feedback; retain EXIF's original identity and readable text. Treat canvas/3D as unnecessary until a concrete content need establishes otherwise.

Evidence: [desktop transition](reference-evidence/live/vero-desktop-scroll-review.mp4), [mobile transition](reference-evidence/live/vero-mobile-scroll-review.mp4), [desktop menu](reference-evidence/live/vero-desktop-menu.png), [native Process navigation](reference-evidence/live/vero-mobile-controls.mp4), [Process stages](reference-evidence/live/vero-desktop-process-scroll-04.png), [native mobile pan](reference-evidence/live/vero-mobile-native-pan.mp4).

## Access, capture and interaction limitations

1. **Earlier environment failures were resolved for this study.** Initial CONNECT 403 and Chromium certificate errors remain as historical diagnostics. They are not evidence of reference design. The authorized retry ran browsers with TLS verification enabled using the environment CA; no certificate-error bypass was used. Automatic deletion traps later reported the research certificate nicknames absent. A privileged final NSS listing showed exactly the four original OpenAI roots with their original `C,,` attributes and no research nickname. See [cleanup verification](reference-evidence/environment-cleanup.json).
2. **AOD alternate mobile asset:** `aod-home-hero-preview-mobile-540.mp4` returned HTTP **403**, with “The element has no supported sources.” The visible primary `...mobile-540p.mp4` played successfully. Both the successful visible playback and this separate failure are recorded; not every media element succeeded.
3. **Awwwards third-party embed:** the YouTube iframe API request failed with `ERR_TUNNEL_CONNECTION_FAILED`. The source index/entry and original links rendered. Its unavailable embed was not treated as inspected interaction evidence.
4. **White Desert cookie control:** the desktop Reject click was intercepted by the chat widget. The cookie strip remained in desktop captures. Mobile Reject worked. No chat was used and no site DOM was edited to remove the obstruction.
5. **Horeca mobile:** the prolonged blank testimonial interval is described above with both main-context and fresh-context evidence. Its underlying cause remains uncertain.
6. Other aborted analytics, preview/prefetch and route-lifecycle requests remain in the log. A request aborted during a transition is not automatically classified as broken visible content. Failed selectors against hidden responsive duplicates are also retained; only the later successful visible-control actions substantiate the findings.
7. Recordings were possible and saved. They capture viewport motion without audio or an overlaid pointer/touch indicator; action times explain inputs. Browser emulation does not validate Safari, a physical device, mobile network conditions, every breakpoint, keyboard accessibility, reduced-motion behavior or steady 60fps. Hero full-film flows for Tengile/White Desert, checkout, submissions and every secondary route were outside the exercised sample.

## Prioritized creative direction for EXIF

Preserve the loader, split-color hero, existing photographs/gallery behavior, cream/deep-green palette, serif/sans families, original letter and authoritative inquiry/page-transition controllers. Current V3 already has service folios, a process reading index, a language study, drawer margin notes and letter-form feedback; simply adding more entrance motion would repeat that work. The direction below develops **content transformations** within those structures. It does not ask for another scroll engine or a redesign into one of the reference brands.

### 1. A service decision becomes a visible output

**Where:** What We Do, inside the existing three service folios. **Basis:** Horeca's distinct service/media compositions and Vero's causal material sequence.

**Behavior:** selecting the existing service name changes a shared, clearly labeled studio demonstration. Examination exposes questions and evidence marks; direction selects and explains a hierarchy; production sets the approved hierarchy into an authored brief/page/narrative. The visitor can compare what changed and why. Responsibility, scope and concrete deliverables remain readable beside or below the artifact, without requiring interaction.

**Implementation:** native controls and scoped DOM/CSS states; no GSAP/Lenis import. One coordinated transition of the artifact, not character-by-character headlines. This is moderate effort, with content design as the main dependency. Reuse the current controller where possible. All authored examples must be labeled as demonstrations; no invented client, property result or commission.

**Mobile / reduced motion:** explicit controls above the artifact; vertical content. No hover-only output. Immediate state changes for reduced motion and a complete static reading for no JS. **Acceptance:** each state shows a professional decision and its consequence; keyboard/touch can reach every state; core scope never becomes hidden.

### 2. A photograph and its editorial frame move together once

**Where:** homepage positioning at the passage into the existing photographic sequence. **Basis:** Tengile's bounded internal image movement and Vero's aperture/scale progression.

**Behavior:** one frame within its existing placement changes aperture gently as a caption/rule aligns with the editorial grid. The photo remains recognizably the same subject. Paragraphs stay still and readable. Normal vertical scroll reverses the finite transition; it must not capture wheel input or set page scroll position.

**Implementation:** overflow clipping, crop allowance and a small coalesced transform on a dedicated wrapper. Moderate effort because the existing photographic controller must remain authoritative. No additional photography, gallery state writes, duplicate image requests or relocated protected original sections. If the approved existing structure cannot safely support a wrapper, use the adjacent rule/caption passage instead.

**Mobile / reduced motion:** stable crop and a shorter vertical passage; no focal subject moves outside the frame. Static aligned frame/caption for reduced motion. **Acceptance:** no gallery drag/wheel/pause regression; no layout jump or text masking; missing JS leaves the original image sequence usable. Photography rights and original-placement constraints remain decisive.

### 3. One working thread connects the five process stages

**Where:** Approach, extending the existing passive reading spine. **Basis:** White Desert's spatial continuity and Vero's Dress → Data → Sculpture relationship.

**Behavior:** one original typographic artifact evolves through Context → Evidence → Priorities → Work → Review while the five stage narratives remain in ordinary document flow. The current index label and artifact mark agree. Direct stage selection follows a real anchor; optional working notes remain optional. A short visual transformation identifies what the next stage carries forward.

**Implementation:** finite desktop sticky region, IntersectionObserver and bounded CSS states/one coalesced passive scroll update. Moderate effort. Keep stage text outside clipping layers. Do not reproduce White Desert's multi-thousand-pixel pinned scene or Horeca's long spacers. Retain the current stage index instead of adding a competing navigation system.

**Mobile / reduced motion:** a vertical thread in reading order, with no compulsory sideways journey; static diagram/state emphasis under reduced motion. **Acceptance:** each stage and relationship is understandable without movement; browser Back, anchors and native scrolling work; a short viewport does not hide the explanation behind a pin.

### 4. An editorial study reveals evidence, interpretation and decision

**Where:** In Practice, extending the existing hospitality-language exercise. **Basis:** AOD's shared image plus explicit testimony/detail relationships, supported by Horeca's service-to-material pairing.

**Behavior:** Observe / Interpret / Decide changes annotations on one shared composition. Observe quotes actual authored material and identifies what it shows. Interpret adds the reasoning and its limits. Decide changes the composition/hierarchy and explains the consequence. Supporting notes use native disclosure. Avoid merely recoloring a sentence or changing typography without explaining the hospitality decision.

**Implementation:** three explicit DOM states with one annotated artifact and a complete static reading beneath/fallback. Moderate effort; convincing original content is the main dependency. A publishable client case requires permission; until then keep a clearly labeled studio exercise and distinguish observation from assumption. AOD's academy success claims are not borrowed.

**Mobile / reduced motion:** annotations follow the subject in one vertical column. Buttons are tappable and work by keyboard; no timed progression. State updates are immediate for reduced motion. **Acceptance:** a reader can trace a visible decision to its evidence, understands uncertainty, and can access every layer without relying on animation.

### 5. Navigation previews the destination without adding a step

**Where:** existing EXIF drawer, building on its margin annotation. **Basis:** Vero's typographic route sheet, Tengile's restrained panel and AOD's course-specific desktop preview.

**Behavior:** keep the route name stable and immediately actionable. Hover/focus gives it a small rule/marker and changes an adjacent **textual destination preview**: the page's question, a specific section title and expected reading. Use the established typography/grid to distinguish “what this page is for” from the large route name. Clicking/tapping remains a single direct navigation; do not require a preview click first. No new photo is needed for this preview.

**Implementation:** low to moderate effort within the current drawer controller. Short CSS feedback plus a small authored preview mapping. Preserve existing modal isolation, close behavior, focus handling and scroll restoration. Avoid replacing labels or animating them letter by letter.

**Mobile / reduced motion:** show the concise purpose as ordinary text beside/below each destination or omit the decorative preview; every route remains directly tappable. Reduced motion retains immediate selection emphasis. **Acceptance:** destinations remain legible in English/Spanish; hover and focus provide equivalent context; touch users take no extra step; opening/closing leaves page position intact.

### Implementation order and review gate

Prototype priorities **1 and 2** first: they produce the strongest visible change in how visitors understand EXIF's services and photographic narrative. Review their content, pace and mobile treatment before extending the same artifact logic into priorities **3 and 4**. Finish with **5**, keeping navigation feedback subordinate to content.

Preserve the existing small CSS/JS budget and no-new-animation-dependency approach. Motion must settle when offscreen, honor reduced motion and leave a readable no-JS document. Proposed transition durations, displacement limits and performance must be measured in an EXIF prototype; they are not claimed measurements of these references.

**Approval requested at the direction stage only.** This packet is the completed research and evidence for that review. No proposed interaction has been implemented, and no website source was modified, merged or deployed.
