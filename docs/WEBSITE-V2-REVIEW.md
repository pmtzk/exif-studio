# EXIF website evolution V2 — review report

V2 is implemented on the development branch for review. No main merge or production deployment was performed. The project retains static HTML/CSS/JavaScript and has no build or application dependency installation.

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

## Screenshots

Before/after PNGs are outside the deployed checkout in the current cloud machine:

- `/workspace/artifacts/exif-v2/before`: baseline at 360/390/768/860/1024/1440, EN/ES, loader, hero, drawer, choice, gallery, cards, recognition, letter/expanded letter, Studio and reduced motion.
- `/workspace/artifacts/exif-v2/after`: V2 equivalents plus In Practice, Expertise, Approach and Inquiry; final Spanish title/drawer captures overwrite earlier candidates after refinement.
- `/workspace/artifacts/exif-v2/recheck`: final focused screenshot matrix after the native-scroll fix.
- `after/browser-results.json`, `after/touch-results.json`, `after/responsive-results.json` and `recheck/browser-results.json` and `keyboard-recheck/browser-results.json`: outcome records from completed runs.

Representative review: `before/1440-en-hero.png` vs `after/1440-en-hero.png`; `before/360-es-hero.png` vs `after/360-es-hero.png`; `before/1440-es-drawer.png` vs `after/1440-es-drawer.png`; `before/860-en-cards.png` vs `recheck/860-en-cards.png`. New pages: `after/390-en-expertise.png`, `after/390-es-approach.png`, `after/390-en-inquire.png`. These local artifacts are available in the development environment, not committed or included as new deployed assets.

## External requirements and remaining limits

See [integration/publication requirements](WEBSITE-V2-INTEGRATIONS.md).

- Scheduling URL remains null. Inquiry submission asks for follow-up availability; no instant booking is claimed. A real provider/calendar, approval and provider-confirmed completion integration are required for direct scheduling and booking counts.
- Analytics provider remains null. Local allowlisted events transmit no data. Future adapters require an appropriate consent/privacy policy and explicit consent before calls. CRM stages beyond accepted inquiry are documented and remain outside the site.
- Real Formspree delivery/inbox receipt was not tested and requires an approved intentional submission. Automated tests sent no real inquiries.
- Copyright/employment ownership, licensing and identifiable-person/model-release evidence for the existing professional archive is unresolved. Preserve assets; review permissions before new case studies/promotional use or production approval. No former employer/property is named publicly, no strategic client engagement/results are fabricated, and no new commissioned project claim is made.
- Screenshots use local fonts and existing fallbacks; Google Fonts delivery was not exercised. The Seasons remains a licensed-kit follow-up. Safari/physical-device behavior, exact production deployment parity, Cloudflare preview routing and live external integrations are unverified. Local clean-route testing uses the checkout's actual rewrite declarations rather than claiming to run Cloudflare.
- Original dormant gallery size variants are intentionally left inactive. No historical CSS consolidation or image recompression is performed without a justified visual comparison.

No essential failure remains in the exercised local workflows. This is a review delivery with explicit external/manual gates, not a production-readiness claim.

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
- `tests/browser-v2.cjs`
- `tests/touch-v2.cjs`
- `tests/v2-regressions.cjs`
