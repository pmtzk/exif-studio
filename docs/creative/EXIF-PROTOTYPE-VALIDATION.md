# Prototype validation and review boundaries

Checkpoint: `337ee2dc22937064d86fe648052daa6b5e39e4f2` on `checkpoint-exif-v3-before-interaction-prototypes-2026-10-09`. Implementation branch: `feat/exif-interaction-prototypes-2026-10-09`.

## Implemented scope

**What We Do:** one illustrative courtyard study, three connected states. Examination names observable material and a question; definition prioritizes the shared moment and explains why; translation makes an image/narrative brief from that hierarchy. A persistent illustrative label makes clear that no commission or client result is represented. New native buttons synchronize with the existing service folio tabs in both directions. All original descriptions, scope and specimen controls remain present.

**Homepage:** the authorized adjacent frame/caption fallback. The original gallery already controls its own aperture/reveal. Integrating a second aperture into it would violate the preservation boundary, so the new passage uses only an adjacent typographic frame, coordinated label and rule. A single bounded progress value follows natural vertical scrolling. There is no new photograph, image duplication, crop, gallery write, wheel handler, pinning or scroll library. This intentionally does not alter a photographic aperture.

**Studio:** proposed editorial concept only. The Studio HTML, founder letter and controllers remain byte-identical to the checkpoint.

## Automated checks

| Suite | Checkpoint | Prototype |
|---|---|---|
| `runtime-regressions.cjs` | 18 passed | 18 passed |
| `v2-regressions.cjs` | 8 passed | 8 passed |
| `browser-v2.cjs` | 19 cases / 560 assertions passed | 19 cases / 560 assertions passed |
| `browser-v3.cjs` | 15 cases / 576 assertions passed | 15 cases / 576 assertions passed |
| `performance-v3.cjs` | 3 checks passed | 3 checks passed |
| `touch-v2.cjs` | 12 checks passed | 12 checks passed |
| `review-controls-v2.cjs` | Used as the comparison baseline | 8 journeys and 4 decoded-gallery frame comparisons passed |
| `interaction-prototypes.cjs` | Not applicable | 252 assertions passed |

Targeted checks cover 360, 390, 768, 1024 and 1440 pixels, English and Spanish, direct selection, keyboard wrapping/Home/End, existing-folio synchronization, native taps and vertical touch gestures, ordinary wheel scrolling, bounded framing, live reduced motion, no-JavaScript and blocked-script fallbacks, console exceptions and horizontal overflow. Essential artifact content remains available without enhancement; inactive buttons are hidden.

The legacy `review-v2.cjs` evidence generator is also run against checkpoint/prototype origins, not the historic V1/V2 versions. [Result](review/legacy-review-results.json): 344 captures, 8 matched photo-sequence pairs, 16 mocked Dear EXIF submissions, 8 complete discovery journeys, no page errors or missing assets. Review servers are loopback-only; this is not a deployment. Form journeys use mocked responses and do not send external inquiries.

## Visual preservation evidence

- [Before/after journey capture log](review/baseline-capture-log.json) and [after log](review/after-capture-log.json): 76 screenshots per version, four desktop/mobile/language journeys per version, including actual loader states and recordings.
- [Protected source/media hashes](review/protected-file-hashes.json): 68 existing files byte-identical. Existing controllers, styles, photographs, other pages and Studio are unchanged.
- [Protected HTML comparison](review/protected-markup-results.json): removing only the new sections/imports produces exactly the original parsed document markup on both edited pages. Original copy, destinations, image elements and approved components remain intact.
- [Viewport pixel comparison](review/protected-visual-comparison.json): hero, closed drawer, Dear EXIF, inquiry, Studio and founder letter are pixel-identical in all four captured viewport/language combinations.
- [Normalized component comparison](review/normalized-visual-comparison.json): all four gallery frames are pixel-identical. Seven of eight card states are pixel-identical; the remaining Spanish collapsed state includes a timing-dependent header difference. Expanded card compositions and dimensions match. Recognition rails retain matching composition/dimensions but differ in movement phase/header timing.

Actual images were reviewed: loader composition, mobile hero, drawer, illustrative states, mobile gallery and recognition. Independent screenshots taken mid-animation are not asserted to be exact temporal matches. The loader’s before/after image size difference is a sampling-phase difference; original timing/easing/sequence source and all loader markup are unchanged. Recordings retain the full arrival sequence.

The scoped frame uses a fixed document-flow height and changes only positioned frame geometry, a short label offset and rule length. It does not animate paragraphs or change layout height. Post-startup artifact interaction layout-shift checks pass below 0.01. At 360px Spanish, startup CLS measured 0.014789 at checkpoint versus 0.014788 after: the pre-existing language/font/layout startup shift is not claimed to be zero.

## Limits

Chromium 151 and emulated touch were tested; physical iOS/Safari/Android hardware was not tested. External requests, including hosted fonts and analytics, were blocked consistently for local comparisons. Evidence represents this controlled local configuration, not a production deployment or a new reference-site investigation. Studio photography selection and rights remain future approval decisions. The homepage prototype deliberately uses the approved fallback rather than changing protected photographic framing.
