# EXIF V3 — creative experience review

V3 evolves the weaker V2 chapters within the existing static architecture. The reference access record and interaction language were committed before implementation. The original photographic/arrival controllers remain intact. Nothing was merged or deployed to production.

## Verified Git boundaries

- Starting V2 commit: `017ee32f22b7c1197251e1059b9121977d070fb5`.
- Permanent [V2 checkpoint](https://github.com/pmtzk/exif-studio/tree/checkpoint-exif-v2-before-creative-evolution-2026-10-09): `checkpoint-exif-v2-before-creative-evolution-2026-10-09`, at that exact SHA. The existing remote `checkpoint` ref prevents the slash-prefixed name; the brief's flat fallback was used.
- [V3 branch](https://github.com/pmtzk/exif-studio/tree/feat/exif-creative-experience-v3-2026-10-09): `feat/exif-creative-experience-v3-2026-10-09`. Both branches were pushed and their equal starting SHAs verified before creative edits.
- [Compare V2 to V3](https://github.com/pmtzk/exif-studio/compare/feat/exif-website-evolution-v2-2026-10-08...feat/exif-creative-experience-v3-2026-10-09).

The V2 branch stays at the approved starting commit. Main and the V1 checkpoint stay at `9a02ab7b17f779d6a2e5190731d428508c3da7ff`. Neither checkpoint was edited. Implementation commits separate the reference/system documents, creative implementation, and QA repairs/evidence. The final delivery commit is identified in the handoff and GitHub branch history rather than creating a self-referencing SHA in this file.

## Research and interaction language

- [Creative reference access/research record](CREATIVE-V3-REFERENCES.md).
- [EXIF interaction language](CREATIVE-V3-INTERACTION-LANGUAGE.md).

**External research remains incomplete.** Every requested details.so category and Awwwards returned proxy CONNECT 403, including after network permission was granted. White Desert and The Art of Documentary also could not be accessed. Tengile MalaMala/Vero were not assigned unverified identities or interaction descriptions. No external functioning-site observations or copied designs/code are claimed. EXIF's actual local benchmark and its working GitHub source/evidence supplied the available design basis. External references need a later access-enabled review; the limitation is not hidden behind invented inspiration.

## Sections and rationale

| Area | Result and purpose |
| --- | --- |
| What We Do | A three-part service folio keeps all responsibility names immediately readable. Native links become an accessible tab index. Examination gets a movable reading line with explicit questions; direction lets the visitor choose emphasis; production sets direction into brief/narrative/page treatments. Every original service explanation, scope-based fee boundary and example deliverable remains. The visitor chooses a reading directly, rather than enduring a carousel or long pinned section. |
| Approach | Five editorial spreads connect context → evidence → priorities → work → review. A finite sticky desktop reading index follows the current chapter; mobile flows normally. Native working-note disclosures identify client contributions and what takes shape without hiding the core narrative. No wheel interception, pinned full-page progression or character-by-character text animation. |
| In Practice | Replaces the website-as-case-study with **Before the image**, a smaller original exercise in hospitality language. Observe / Interpret / Decide change the typographic emphasis and explain the editorial question. It expressly claims no client property, empirical result or commissioned work. Verified property evidence/publication rights are insufficient for a photographic case study, so no such study is fabricated. |
| Home progression | An authored reading rule introduces the positioning chapter; the original image gallery remains the photographic centerpiece. Recognition moves into the deep-green study, then a cream invitation leads into correspondence. This develops chapter rhythm without replacing gallery or scroll mechanics. |
| Studio | A personal typographic opening, an author-to-letter anchor and a correspondence folio connect the institutional context to Katia's original letter. The founder article remains byte-for-byte unchanged, including both languages. No background experience or client credit is invented. |
| Inquire | The five required qualifications become an introduction to “Dear EXIF” on a ruled correspondence spread. All fields stay visible. Focus marks the current line; readiness reflects native validity. Existing pending/retry/duplicate protection and accepted-response logic remain authoritative. The reply slip promises follow-up availability, never a booked meeting. |
| Navigation | Enlarged route landmarks remain stable during hover/focus. Their interpretation occupies a separate margin; small lateral feedback preserves identity and readability. Cream sheet, glass band, close choreography, background isolation, keyboard trap and all routes remain. |

No new photograph, font, color family, gradient, WebGL dependency, animation library, calendar, analytics adapter or production service was added. New visual material is original typesetting and rules. The photographic archive and licensing/release uncertainty are unchanged; no new archive placement was made.

## Evidence accessible for review

[Open the V2 / V3 comparison index](review-v3/README.md). It contains **84 fresh Chromium screenshots** and four comparison sheets (1440px/390px × EN/ES), including service variants, process disclosure, both study readings, Studio/letter, inquiry and mocked receipt. Both widths use a 900px height. Major V2 counterparts come from a separately served archive of the exact checkpoint, not the active V3 checkout. Tap images to inspect full resolution.

[The 1280×900 MP4 walkthrough](review-v3/videos/exif-v3-walkthrough.mp4) records actual local drawer feedback, service/range/emphasis/format selections, process disclosure, study choices, letter navigation and a mocked inquiry. It uses original local fonts/fallbacks with external traffic blocked. It is a recording, not a public preview or real submission. Final emphasis/contrast screenshots were refreshed after the accessibility adjustment.

## Independently executed checks

The following ran during V3 work, rather than being copied from earlier V2 documentation:

| Command | Actual result |
| --- | --- |
| `node tests/runtime-regressions.cjs` | 18/18 original simulated regressions pass. Rerun after implementation and QA fixes. |
| `node tests/v2-regressions.cjs` | 8/8 route, qualification, asset and privacy contracts pass. Rerun after implementation and QA fixes. |
| `EXIF_ARTIFACT_DIR=/workspace/artifacts/exif-v3/v2-regression node tests/browser-v2.cjs` | 19/19 Chromium cases, 560 assertions pass on V3. Includes all six widths × EN/ES, original loader/hero/drawer/cards/letter, forms, gallery, reduced motion, failures and no-JS fallback. |
| `EXIF_BROWSER_CASE='Keyboard\|Gallery\|Inquiry\|Dear' EXIF_ARTIFACT_DIR=/workspace/artifacts/exif-v3/final-core-recheck node tests/browser-v2.cjs` | Subsequent final core recheck: 4/4 cases, 38 assertions pass. |
| `EXIF_TEST_ORIGIN=http://127.0.0.1:8083 EXIF_ARTIFACT_DIR=/workspace/artifacts/exif-v3/touch node tests/touch-v2.cjs` | 12/12 native emulated touch/bounds/short-viewport checks pass. Includes horizontal gallery drag and natural vertical scroll with both clipping paths. |
| `node tests/browser-v3.cjs` | Final interaction matrix: 15/15 cases, 576 assertions pass; 360/390/768/860/1024/1440 × EN/ES, new selections and keyboard controls, copy, overflow, process reading/disclosure, studio/letter, stable menu titles, all inquiry fields/receipt, no-JS/blocked-script fallback, reduced motion and live preference changes. 84 paired/state images. |
| `node tests/performance-v3.cjs` | 3/3 native-touch/scheduling cases pass: 390/768 tap controls and range/disclosure/study; idle/offscreen V3 scheduling sleeps and scroll bursts coalesce. The final run also measures effective text contrast for inactive service names, typographic emphasis and the language control over the dark study. |
| `for script in assets/js/*.js tests/*.cjs; do node --check "$script"; done` | All application and test scripts parse. |
| `git diff --check` | Clean. |
| Exact checkpoint/source comparison | Photography/font bytes, loader/hero/gallery/card controllers and original founder article unchanged. |

The V3 suite blocks external requests, captures page errors and missing local assets, checks all bilingual leaves and document/content bounds, and mocks inquiry responses. The existing suite additionally exercises failed and slow hero images, draft preservation, retry, duplicate submission and receipt focus. No real Formspree request was sent. No remote CI result is claimed; CI now includes V3 branches for the existing dependency-free suites/syntax checks.

The local servers can be reproduced without editing any checkpoint:

```sh
git archive 017ee32f22b7c1197251e1059b9121977d070fb5 -o /tmp/exif-v2-v3-baseline.tar
mkdir -p /tmp/exif-v2-v3-baseline
tar -xf /tmp/exif-v2-v3-baseline.tar -C /tmp/exif-v2-v3-baseline
# Separate terminals:
node tests/review-server.cjs /tmp/exif-v2-v3-baseline 8082
node tests/review-server.cjs /workspace/exif-studio 8083
# Then run the commands in the table.
```

`browser-v3.cjs` accepts `EXIF_V3_ORIGIN`, `EXIF_V2_ORIGIN`, and `EXIF_V3_ARTIFACT_DIR`. Browser tools are developer tooling already available in this environment, not production dependencies. The servers apply the actual rewrite/redirect declarations; they do not claim to be Cloudflare.

## QA findings and performance

- A link outside Studio's original wrap created a 2px overflow and a misplaced anchor; it was moved inside the existing reading grid. The author folio now aligns with the original letter column. The article itself was not rewritten.
- Service-index buttons originally appeared only after enhancement. At 360px ES this produced observed CLS of 0.162. Rendering native section links before enhancement reduced the final observed value to about 0.015; the final 12 width/language measurements range from 0 to **0.0148**.
- Historical color rules overrode the language control's dark-background state. A scoped V3 contrast rule now makes that state authoritative; the study's header control is cream, with dark ink retained in the open cream drawer.
- Inactive large service/specimen/study typography was adjusted to meet the measured AA contrast threshold against its actual cream/deep background. These are targeted checks of new states, not a full assistive-technology audit.
- V3 reading observation now uses the actual viewport, so an offscreen process/frame scope stops scheduling even when explicit scroll events are dispatched. The controller has no continuous RAF loop; one scheduled frame handles a burst of events.
- Added CSS+JS is approximately **7.4KB gzip**, under the stated 12KB budget. No new image requests. Measured local transfer on the Expertise page is about 326KB, including the inherited styles/scripts/assets; it is not total photographic homepage weight or an external-font measurement.

CLS figures come from Chromium PerformanceObserver during the test journeys, excluding entries marked as recent user input. They are not a Core Web Vitals field study, slow-device guarantee, site-wide Lighthouse score or Safari performance claim.

## Remaining limitations and preview

**No verified public preview URL is available.** Fresh read-only requests to Cloudflare's accounts API and the GitHub deployments API fail at proxy CONNECT with 403. The environment's package-manager egress preset does not include those APIs, reference sites or WebKit CDN domains. Network permission did not change that upstream allowlist. No production domain/settings were changed. A branch preview may exist outside this session, but it cannot be discovered or verified here. Review is supplied through GitHub images and the recorded walkthrough, without inventing a URL.

**Safari/WebKit and physical iPad are not tested.** The WebKit executable is absent; its CDN download still returns proxy 403. Chromium mobile/touch emulation is explicitly distinct from device verification. Optical compositing, native select/range behavior, full font delivery and exact Safari paint need real-browser/device review.

Other unresolved gates: external reference inspection; creative acceptance of the new compositions/copy; existing archive/font publication rights; intentional approved Formspree delivery/inbox verification; real production-route parity. Scheduling/analytics remain null and are not mandatory to review the functional inquiry fallback. No fabricated service booking, client case, fee, testimonial, project result or commercial outcome is presented.
