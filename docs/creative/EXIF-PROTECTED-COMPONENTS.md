# Preservation contract

Checkpoint: `checkpoint-exif-v3-before-interaction-prototypes-2026-10-09`, SHA `337ee2dc22937064d86fe648052daa6b5e39e4f2`. Both checkpoint and implementation branches were pushed and verified at this SHA before implementation. The checkpoint remains frozen.

The 297 untracked research evidence files were preserved before branching in two SHA-256 verified copies outside the checkout. Nothing was discarded or overwritten. Their source/size/hash manifest is retained with the preservation backup.

Baseline evidence: [desktop English](review/images/baseline/1440-en-hero.png), [desktop Spanish](review/images/baseline/1440-es-hero.png), [mobile English](review/images/baseline/390-en-hero.png), [mobile Spanish](review/images/baseline/390-es-hero.png). The capture log records the complete journey, including loader, open/closed drawer, gallery pause/next, expanded cards, service selections, Studio, founder letter, correspondence and inquiry. External requests were blocked; no real forms were submitted.

| Protected component | Source / controller | Contract | Evidence example |
|---|---|---|---|
| Cinematic loader and hero | `index.html`, `site-v1.js`, `180902.js`, `190926.js`, original styles | Original composition, timing, easing, split-color typography, photography, entrance/exit and responsive hierarchy | [Loader](review/images/baseline/1440-en-loader.png), [hero](review/images/baseline/390-en-hero.png) |
| Photography | `190926.js`, `motion-gallery.js`; `.motion-gallery-viewport`, `.motion-gallery-controls` | Same image paths, order, crop, lazy loading, controller state; native vertical scrolling; horizontal wheel/drag/touch, pause/next/resume and live reduced-motion preference | [Gallery](review/images/baseline/1440-en-gallery.png), [paused](review/images/baseline/390-en-gallery-paused.png), [next](review/images/baseline/390-en-gallery-next.png) |
| Editorial drawer | `site-v1.js`, `nav-context.js`, original drawer styles; `.exif-drawer` | Green/glass composition, oversized type, hover, focus trapping/return, scroll restoration and all destinations | [Open](review/images/baseline/1440-en-drawer-open.png), [closed](review/images/baseline/390-en-drawer-closed.png) |
| Observe / Decide / Create | `approach-cards.js`; `.exif-approach` | Preserve disclosure, card structure and original wording | [Cards](review/images/baseline/1440-en-observe-decide-create.png), [expanded](review/images/baseline/390-en-create-expanded.png) |
| Recognition rail | Original home controllers; `.recognition-section` | Preserve existing rails and interactions | [Recognition](review/images/baseline/1440-en-recognition.png) |
| Services | `expertise.html`, `site-v3.js`; `.v3-folio-index`, `[data-service]`, original specimens | All descriptions, scope, three tabs, range/emphasis/format controls, keyboard and no-JS content remain. New artifact extends, rather than replaces, these panels | [Examine](review/images/baseline/1440-en-expertise.png), [direction](review/images/baseline/390-en-service-direction.png), [production](review/images/baseline/390-en-service-production.png) |
| Process and hospitality study | `approach.html`, `in-practice.html`, `site-v3.js`; `.v3-process-index`, `.v3-study` | Preserve reading index, disclosures, study buttons and route architecture | Existing browser V3 suite |
| Studio and founder letter | `studio.html`; `.founder-letter` | Byte-identical page, wording and editorial composition; concept document only | [Studio](review/images/baseline/1440-en-studio.png), [letter](review/images/baseline/390-en-founder-letter.png) |
| Correspondence and inquiry | `site-v2.js`, `site-v1.js`; `#dear-exif`, `#discovery-inquiry` | EN/ES, URL editing, Continue, validation, draft restoration, error/retry and inquiry controls unchanged | [Dear EXIF](review/images/baseline/390-en-dear-exif-expanded.png), [inquiry](review/images/baseline/1440-en-inquire.png) |

## Baseline verification

Runtime regression suite: 18 passed. V2 regression suite: 8 passed. Full browser, touch and V3 suites are recorded in the final validation report with checkpoint and implementation results. Screenshots were captured before any website code changed, at 1440 and 390 pixels in both languages. Functional checks alone are insufficient: protected visual states must also be reviewed against these captures.

## Implementation boundaries

Only `index.html` and `expertise.html` may receive scoped prototype insertions and imports. Existing CSS, controllers, media, routes, analytics, form behavior and Studio are frozen. New code must target only `.exif-artifact` and `.exif-passage`. The gallery owns its reveal: use the explicitly authorized adjacent frame/caption fallback; do not write to gallery DOM, images, styles or state. No new dependencies, pinning or scroll interception.
