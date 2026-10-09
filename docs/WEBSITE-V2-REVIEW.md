# EXIF website evolution V2 — review report

V2 is implemented on the development branch for review. The subsequent preservation-verification phase is recorded below, with committed screenshots accessible through GitHub. Interactive preview delivery remains blocked by environment network/access restrictions. No main merge or production deployment was performed. The project retains static HTML/CSS/JavaScript and has no build or application dependency installation.

## Git safety and review links

- Starting SHA: `9a02ab7b17f779d6a2e5190731d428508c3da7ff`.
- [Permanent checkpoint](https://github.com/pmtzk/exif-studio/tree/checkpoint-exif-before-website-evolution-2026-10-08): `checkpoint-exif-before-website-evolution-2026-10-08`.
- [Development branch](https://github.com/pmtzk/exif-studio/tree/feat/exif-website-evolution-v2-2026-10-08): `feat/exif-website-evolution-v2-2026-10-08`.
- [Compare for review](https://github.com/pmtzk/exif-studio/compare/main...feat/exif-website-evolution-v2-2026-10-08).

Both remote branches initially matched the starting SHA and the clean tree was verified before source changes. The remote branch named `checkpoint` prevented the suggested slash-prefixed name, so a flat checkpoint name was used. Existing branches were retained; no force push was used. The checkpoint and main still point to the starting SHA. Focused commits separate the audit, implementation and final validation/refinements.

Production parity is unconfirmed: the read-only production HTML request returned proxy 403. Git access works, but the GitHub API request also returned Forbidden, so a draft PR could not be created through the CLI. The compare link supplies the review route without claiming a PR exists. No Cloudflare branch-preview URL was available; no preview URL was guessed and no production settings were altered.

## Preservation and visual decisions

[The inventory](WEBSITE-V2-PRESERVATION-AUDIT.md) was created before redesign. All original photographic/font files and the complete founder-letter article remain byte-for-byte unchanged against the starting commit. The cinematic loader, signature, split-color title, comparative narrative, gallery sequence, expanding deck, recognition rails, correspondence and page transitions remain.

The hero gains small commercial annotations in its existing margins and two distinct routes. The desktop photograph/title geometry is retained; mobile retains the full photograph with a restrained upper vignette, elevated signature and visible actions. Source/browser comparison identified and corrected a pre-existing clipped Spanish hero word at 360px.

The drawer keeps its cream sheet, oversized green serif, asymmetric icon/close proxy, Dear EXIF invitation, social links and geographic footer. Four primary links and a separate commercial invitation fit the original asymmetric layout. Hover now uses actual link bounds, including all routes; route accessible names remain stable during hover copy changes. Open navigation isolates the background and traps keyboard focus among menu/language/close controls; closing restores the toggle. Width changes release scroll locks and correctly mount/remove the desktop proxy.

Optical treatment retains clear, strongly blurred original colors. A small SVG turbulence/displacement filter applies only to the 14px edge band where supported; the scene uses CSS blur/saturation and prefixed fallback. No WebGL, replacement photo or opaque white overlay is introduced. Chromium screenshots were inspected; Safari/WebKit is unavailable and requires review before production approval.

The Observe / Decide / Create deck keeps its choreography and expands its copy to research, strategy and coordinated production. `--sans` uses the existing family; desktop deck/summary proportions and copy zones now fit 860px. Active card descriptions are exposed to assistive technology; inactive descriptions are hidden. Dormant zero-padded gallery size selectors remain dormant to preserve the approved sizes rather than unexpectedly activate unreviewed variants.

The gallery retains continuous sequencing, arrows, drag and horizontal wheel behavior, with a bilingual pause control. Reduced motion disables automatic cruising and keeps deliberate movement. Native touch testing found nested hidden-overflow containers blocked vertical page scroll; non-scroll clipping fixes that, with a clip-path fallback. Image attributes now reflect real source dimensions, without changing image bytes or cropping policy. The existing gallery gains accurate previous-professional-experience provenance; it is not recast as an EXIF commission.

## Page-by-page implementation

| Page | Implementation |
| --- | --- |
| Home `/` | Approved category and audience in the cinematic hero; Discuss Your Property and Open the Reading; preserved editorial narrative/photos/cards/recognition; concrete positioning introduction; In Practice examines EXIF's own website and existing image sequence; free discovery invitation; original Dear EXIF and founder route. |
| What We Do `/expertise` | Research & Representation Assessment; Positioning & Creative Direction; Creative Production & Implementation. Specific possible outputs, responsibilities and scope-based quotation. No mandatory packages, fictional client results or universal assessment price. |
| Approach `/approach` | Understand, examine, define, translate and evaluate as an editorial numbered narrative. Explains evidence, owner contributions, findings/briefs, approved direction, collaborators and review criteria. Home retains its three-card summary. |
| Studio `/studio` | Updated independent creative studio introduction; previous hospitality sales/photography/operations/management experience in Mexico and the Caribbean; founder direction and scoped specialist collaboration. The original lowercase bilingual founder letter and Write Back remain unchanged. |
| Discuss Your Property `/inquire` | Free 30-minute discovery conversation; who it serves, discussion and next-step possibilities. Functional inquiry to the existing Formspree endpoint, five required qualification fields and optional explanation, status/retry/receipt focus, direct email and Dear EXIF alternative. No simulated booking. |

All five pages use bilingual copy, persisted language, accessible field names, updated metadata and shared transitions. Static default is English; language switching requires JavaScript. Sitemap lists the five real clean routes. Cloudflare rewrite declarations and existing `.html`/legacy bookmarks remain. No empty Work, Field Notes or Assessment destination is published.

## Tests and evidence

- **18/18 original simulated-browser regression scenarios passed**, including letter validation/drafts/retry, storage failure, bfcache restoration, loader handoff without Web Animations and reduced-motion gallery controls.
- **8/8 new dependency-free V2 contracts passed**: routes/canonical shell, reserved destinations, qualification scope, asset references, private measurement payloads, consent-gated adapter, categorical attribution and no network/visitor identifiers.
- **19/19 real Chromium browser cases passed, with 550 assertions**: all six requested widths in EN/ES; initial loader, signature/category/actions, drawer hover geometry, closed/open focus state, cards, narrative/gallery/recognition, letter expansion, all new pages and translations, native mouse dragging, wheel events, reduced motion, no-JS, slow/failed hero fallback, both mocked forms, history/resize and mocked provider configuration.
- A subsequent native touch check exposed the hidden-overflow issue after the broad matrix. After repair, **12/12 final bounds/native-touch/short-viewport checks passed**: Spanish final-word/CTA bounds at six widths; native emulated vertical scroll and horizontal gallery drag with both overflow:clip and clip-path fallback; drawer/card fit at 360×640, 390×700, 768×540 and 860×600.
- **4/4 focused Chromium cases passed with 100 assertions after the repair**: 390px ES, 860px EN, keyboard/resize/history and gallery controls/pause/reduced motion.
- A final full forward/reverse drawer focus-cycle recheck passed 20 assertions, including every route, both social links, language and close. The implementation explicitly follows this order so the background/header logo cannot interrupt the cycle.
- An additional initial-mobile resize check passed through 390 → 860 → 859 → 1440 → 390 → 1024px, maintaining one split-color mask and releasing drawer background locks.
- All active JavaScript/test files pass `node --check`; `git diff --check` is clean. Original image/font bytes and founder-letter bytes were compared explicitly against the checkpoint.

The new browser/touch harnesses use existing Playwright/Chromium developer tools; no production library or framework is introduced. Browser tests block external requests and mock Formspree. A test described as provider configuration uses an explicitly mocked URL/interface, not a real calendar or verified booking. CI now runs both dependency-free suites on the V2 branch and pull requests to main; remote CI results are not claimed here.

The changed homepage text files add roughly 13KB of gzip payload over their corresponding baseline files. Photos and their network byte weights remain unchanged; no new promotional photo placements are added. This is a payload estimate, not a Lighthouse or frame-time benchmark. Gallery cruising still sleeps offscreen and can be paused; reduced-motion recognition rails no longer restart through a later CSS override.

## Accessible review evidence

Open the [committed comparison index](review-v2/README.md) on GitHub while signed into an account with access to this repository. It links eight side-by-side review sheets: 1440, 390, 768 and 1024px, each in English and Spanish. Tap any image to open and zoom the original capture. This replaces reliance on the earlier machine-local screenshot directories.

The package contains fresh checkpoint/V2 captures of loader, hero, open/closed drawer, editorial comparison, gallery, all three active cards, recognition, Dear EXIF initial/expanded/receipt states, footer, full homepage, Studio and the original founder letter. It also contains V2 positioning introduction, In Practice, closing invitation, What We Do, Approach, inquiry form and mocked confirmation. All browser viewport heights are 900px; short viewports are tested separately. Moving galleries and rails can be at different animation phases between shots. Both forms are mocked; receipt screenshots do not represent actual delivery.

## Preservation verification phase — 2026-10-09 UTC

Reviewed implementation input: `0f62aa69ac419e4706144c8225196d5bb1781928` on `feat/exif-website-evolution-v2-2026-10-08`. Pulled with `--ff-only`; it was already current. Main and the checkpoint were independently checked with `git ls-remote` and still point to `9a02ab7b17f779d6a2e5190731d428508c3da7ff`. Verified site/fix commit: `037a2da43e121545a82c28091345ec11fdc5dc26`. This phase retains the same development branch and adds review evidence plus the one confirmed CSS defect repair below. No new creative iteration is implemented.

### Preview investigation — blocked

There is **no verified public preview URL**. Local clean-route serving and Chromium rendering work, but localhost is not accessible from an iPad outside this machine.

- No Cloudflare project ID, Wrangler configuration, deployment workflow, preview URL, Cloudflare credential requirement or installed preview utility was found. Existing documentation specifies repository-root/no-build Cloudflare Pages publishing, but account/project branch-preview settings cannot be inspected from those files.
- `gh api repos/pmtzk/exif-studio/deployments` fails with `Forbidden`; the GitHub Actions API request also fails at proxy CONNECT with 403. Existing deployment statuses or a Pages branch preview could not be discovered. Git transport remains functional; screenshots and documentation can be pushed to the authorized development branch.
- The saved environment policy is restricted to its package-manager preset, has no custom egress rules and declares no secrets/runtime credentials. Its allowlist excludes Cloudflare APIs, GitHub API and WebKit CDN hosts. A read-only Cloudflare accounts API request to `api.cloudflare.com` fails at proxy CONNECT with 403. A Pages preview deployment cannot be created or verified here. No production settings/domain were changed.
- A downloaded Cloudflare `cloudflared` executable was tried against the local V2 server. The quick-tunnel creation request fails with DNS connection refused for `api.trycloudflare.com`. A separate proxied POST to that API fails at CONNECT with 403. No tunnel hostname was issued. The failed tunnel was not left running.
- No platform public-port/preview tool or other authenticated deployment connector is exposed in this session. A GitHub Pages fallback would require hosting configuration/access that is unavailable and was not enabled.

To complete interactive iPad review, the existing Cloudflare project needs an enabled preview for this development branch and a verified deployment URL, or this environment needs authorized access to an appropriate preview mechanism. Do not promote production to achieve it. An already generated branch preview may exist externally; that cannot be confirmed here. The screenshot package is available now, but the request's live-preview definition of done is **not yet met**.

### Rendered preservation audit

| Component | Independently observed result | Limits / review decision |
| --- | --- | --- |
| Photography | Rendered hero source and ordered first 13 gallery sources match checkpoint across eight width/language pairs. All original image/font files remain unchanged. All 13 decoded gallery frame dimensions match at 1440/390/768/1024px. | Correct V2 source-dimension attributes can change unloaded placeholder geometry; fully decoded framing matches. Rights/release review remains external. |
| Desktop hero | Side-by-side renders retain original photograph framing, signature geometry/line hierarchy and green/cream split. Loader releases, including failed/slow-image fallback. | Commercial margin annotations are new and require creative review. |
| Mobile hero | Original photo remains; signature is raised to accommodate the new discovery and reading links. Initial CTA/title bounds pass. | Vertical balance, vignette, bilingual line breaks and added copy are creative decisions, not exact V1 preservation. |
| Drawer | Cream sheet, original oversized serif vocabulary, choreography, close proxy, blurred scene, Dear EXIF and social/geographic details remain visible. Open/close, hover, keyboard trap/restore and responsive reset pass. | Four links plus discovery invitation change type size, spacing and hierarchy. Review these differences rather than accepting a blanket preserved label. |
| Optical glass | Chromium open-drawer comparisons show the underlying original photo/color scene through the blurred lower band. No missing/opaque replacement layer was observed. | Added edge treatment is subtle; refraction fidelity and Safari compositing are not established. Review on actual Safari/iPad. |
| Gallery | Original image sequence, continuous/manual movement, pause, native wheel, mouse drag, native emulated horizontal touch and natural vertical scroll pass. Reduced motion retains deliberate controls. | Different screenshot motion phases are expected; physical iPad behavior remains untested. |
| Recognition | Original headline/grid and moving perimeter remain rendered. An unintended global font-variable effect was confirmed and repaired. Computed rail and arrow fonts now match V1 in the capture matrix. | Final side-by-side evidence includes the repaired typography; reduced motion stops the rails. |
| Three cards | All Observe/Decide/Create states render and activate; mobile/short-viewport copy fit and accessible states pass. | V2 copy, title placement, deck/summary proportions and resulting line breaks differ from V1; their visual acceptance needs approval. |
| Founder letter / Dear EXIF | Complete founder article is byte-for-byte intact. Full Studio/letter captures in both languages are supplied. Original letter expansion, persistence, retry and mocked receipt work. | Surrounding institutional introduction is new. No real Formspree delivery was attempted. |
| Section rhythm | Original cream/deep-green contrast remains; full-home captures show original chapters and inserted introductions, In Practice and closing invitation. No responsive horizontal overflow found in checked home/drawer/five-page states. | The new chapter sequence, whitespace and cumulative page length require creative review. |
| Accessibility | Focus management, EN/ES persistence, labels, validation, receipt focus, keyboard activation, no-JS fallbacks and reduced motion pass in Chromium. | No assistive-technology session, physical touch device or WebKit run is claimed. |

### Confirmed regression and technical fix

The V2 stylesheet defined `--sans` globally. That activated a previously unresolved font shorthand in the original capability frame and gallery arrows. At 1440px the rendered rail changed from V1's `16px / 25.6px` to `8.64px / 8.64px`, visibly reducing the recognition perimeter typography. The same defect affected tablet/desktop rails and arrow typography.

`assets/css/website-v2.css` now defines the alias only on `.exif-approach`, where it is needed for card copy. This restores original rendered rails/arrows while retaining card accessibility/fit work. Capture tests compare computed V1/V2 rail and arrow fonts, rather than checking only the presence of selectors. [Before the fix](review-v2/images/regressions/recognition-before-fix.jpg) and [final corrected render](review-v2/images/v2/1440-en-recognition.jpg) are supplied. No other technical regression was confirmed in this phase. Earlier scroll/focus/title repairs remain in place and were retested; they are not new fixes from this phase.

### Creative decisions awaiting approval — unchanged this phase

1. Hero commercial annotations, mobile signature height/vignette, bilingual wrapping and balance of discovery/reading actions.
2. Expanded drawer hierarchy, reduced primary-link scale, commercial invitation placement and optical-edge treatment.
3. Positioning introduction, homepage chapter order/whitespace, provenance caption and closing invitation.
4. Observe/Decide/Create copy, active-title placement and deck/summary proportions relative to V1.
5. In Practice content and composition. No redesign was performed.
6. The editorial concepts, typography, line breaks and density of What We Do and Approach, and institutional content around the unchanged founder letter.
7. The inquiry page's hierarchy, field presentation and receipt composition. No redesign or scheduling integration was performed.

### Commercial journey verification

The primary English CTA remains **Discuss Your Property**; its Spanish equivalent is **Hablemos de tu propiedad**. The complimentary 30-minute conversation is explained in the hero invitation, closing section and inquiry page. Eight new complete journeys (four widths × two languages) follow the actual home CTA, enter five required qualification fields, accept a mocked response and focus the receipt. Receipt copy promises email follow-up with available times; it never confirms a booked meeting. Sixteen corresponding checkpoint/V2 Dear EXIF journeys accept mocked letters without contacting Formspree.

Rendered EN/ES checks span all five pages. The three service areas remain separately named/described. Property priorities decide where the engagement begins; Assessment remains one possible next step, with a directly scoped project/no engagement also possible. Source/content review found no introduced testimonials, named commissions, fabricated results or universal prices. Analytics and scheduling remain unconfigured. No real inquiry, calendar booking, analytics connection or production deployment occurred.

### Independently executed verification in this phase

Earlier implementation-phase results above are historical. The following commands were run again for this phase, including after the typography repair:

```sh
node tests/runtime-regressions.cjs
node tests/v2-regressions.cjs
EXIF_ARTIFACT_DIR=/workspace/artifacts/exif-v2/final-verification node tests/browser-v2.cjs
EXIF_TEST_ORIGIN=http://127.0.0.1:8080 EXIF_ARTIFACT_DIR=/workspace/artifacts/exif-v2/final-touch node tests/touch-v2.cjs
node tests/review-controls-v2.cjs
node tests/review-v2.cjs
EXIF_REVIEW_FULL_ONLY=1 node tests/review-v2.cjs
for script in assets/js/*.js tests/*.cjs; do node --check "$script"; done
git diff --check
```

The review/touch commands require local servers. Reproduce without modifying the checkpoint:

```sh
git archive checkpoint-exif-before-website-evolution-2026-10-08 -o /tmp/exif-v1-review.tar
mkdir -p /tmp/exif-v1-review
tar -xf /tmp/exif-v1-review.tar -C /tmp/exif-v1-review
# Start each server in a separate terminal, then run the commands above.
node tests/review-server.cjs /workspace/exif-studio 8080
node tests/review-server.cjs /tmp/exif-v1-review 8081
```

Origins can be overridden with `EXIF_V1_ORIGIN` and `EXIF_V2_ORIGIN`; capture directory with `EXIF_REVIEW_DIR`. The server applies the actual 200/301 declarations, excludes dotfiles, and is local developer tooling. It is not Cloudflare itself.

After the typography fix: **18/18 original regressions**, **8/8 V2 contracts**, **19/19 real Chromium cases with 560 assertions**, and **12/12 native-touch/responsive checks** pass. The supplemental native wheel/routes/console/overflow matrix passes at four widths in both languages; all four decoded gallery-frame comparisons pass. **344 fresh screenshots** cover the complete checkpoint/V2 matrix, with eight photo-sequence/font comparisons, sixteen mocked Dear submissions and eight complete home-to-inquiry journeys. Full-page overview/founder/receipt captures are additionally recaptured from scroll top so fixed headers and the hidden skip link are not drawn at a previous scroll position. Screenshot comparison/font checks are recorded in the capture result file. Syntax checks and `git diff --check` pass. Fresh machine-readable results are linked in the comparison index. WebKit is **not tested**: its executable is absent; installation into `/tmp` failed with 403 `Domain forbidden` from both `cdn.playwright.dev` and `playwright.download.prss.microsoft.com`. No macOS Safari or physical iPad is available. External-font delivery and actual provider delivery are also untested.

## External requirements and remaining limits

See [integration/publication requirements](WEBSITE-V2-INTEGRATIONS.md).

- Scheduling URL remains null. Inquiry submission asks for follow-up availability; no instant booking is claimed. A real provider/calendar, approval and provider-confirmed completion integration are required for direct scheduling and booking counts.
- Analytics provider remains null. Local allowlisted events transmit no data. Future adapters require an appropriate consent/privacy policy and explicit consent before calls. CRM stages beyond accepted inquiry are documented and remain outside the site.
- Real Formspree delivery/inbox receipt was not tested and requires an approved intentional submission. Automated tests sent no real inquiries.
- Copyright/employment ownership, licensing and identifiable-person/model-release evidence for the existing professional archive is unresolved. Preserve assets; review permissions before new case studies/promotional use or production approval. No former employer/property is named publicly, no strategic client engagement/results are fabricated, and no new commissioned project claim is made.
- Screenshots use local fonts and existing fallbacks; Google Fonts delivery was not exercised. The Seasons remains a licensed-kit follow-up. Safari/physical-device behavior, exact production deployment parity, Cloudflare preview routing and live external integrations are unverified. Local clean-route testing uses the checkout's actual rewrite declarations rather than claiming to run Cloudflare.
- Original dormant gallery size variants are intentionally left inactive. No historical CSS consolidation or image recompression is performed without a justified visual comparison.

Exercised local workflows pass. Interactive preview delivery is blocked; creative approval, Safari/iPad verification, publication rights and live Formspree delivery remain launch gates. This is a review package, not a production-readiness or completed-preview claim.

## Changed files

- `.github/workflows/runtime-regressions.yml`
- `README.md`
- `_redirects`
- `approach.html`
- `assets/css/website-v2.css`
- `assets/js/180902.js`
- `assets/js/190926.js`
- `assets/js/approach-cards.js`
- `assets/js/measurement.js`
- `assets/js/motion-gallery.js`
- `assets/js/nav-context.js`
- `assets/js/site-config.js`
- `assets/js/site-v1.js`
- `assets/js/site-v2.js`
- `docs/WEBSITE-V2-INTEGRATIONS.md`
- `docs/WEBSITE-V2-PRESERVATION-AUDIT.md`
- `docs/WEBSITE-V2-REVIEW.md`
- `expertise.html`
- `index.html`
- `inquire.html`
- `site.webmanifest`
- `sitemap.xml`
- `studio.html`
- `tests/review-server.cjs` (local clean-route evidence server)
- `tests/review-controls-v2.cjs` (native wheel, overflow, redirects and decoded checkpoint framing)
- `tests/review-v2.cjs` (bilingual checkpoint/V2 screenshot evidence)
- `docs/review-v2/` (GitHub-accessible images, comparison index/sheets and result files)
- `tests/browser-v2.cjs`
- `tests/touch-v2.cjs`
- `tests/v2-regressions.cjs`
