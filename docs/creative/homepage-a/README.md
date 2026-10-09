# Homepage A — controlled moving prototype

[Working branch preview](https://feat-exif-interaction-protot.exif-studio.pages.dev/) · [Watch the paired recordings](https://feat-exif-interaction-protot.exif-studio.pages.dev/docs/creative/homepage-a/index.html)

| Browser recording | Protected original | Homepage A |
| --- | --- | --- |
| Desktop, 1440 × 900 | [28 sec MP4](recordings/before-desktop.mp4) | [20 sec MP4](recordings/after-desktop.mp4) |
| Mobile, 390 × 844 | [37 sec MP4](recordings/before-mobile.mp4) | [28 sec MP4](recordings/after-mobile.mp4) |

## What changed

Loader → restored hero → brief commercial comparison → existing gallery → Observe / Decide / Create → Dear EXIF.

The sole hero invitation sits in the desktop cream margin and in a 136 px strip **below** the first mobile photographic screen. Removed the extra hero audience paragraph, reading link and discovery-call promise; the positioning introduction, empty frame passage, language exercise, duplicate closing invitation and recognition chapter are omitted from this A sequence. Recognition has **not** been relocated to an inner page. Its assets and the original checkpoint remain intact.

The bridge retains four original statements. Its question settles first; “Your property” resolves from blur later as the visitor scrolls, followed by the alternative. The original gallery signal, photographic entrance and green rise take over during the exit. There is no pin, timed wait, intercepted vertical scroll or new gallery animation. Scrolling back reverses the existing comparison resolution.

**Judgment after watching the captures:** A brings photography back soon enough to sustain the opening’s atmosphere, while preserving a reason for a property owner to care. The question and decision occupy different scroll beats; the smaller alternative makes the final beat less declamatory. The gallery is the answer in images, rather than an illustration after more explanation. I retained more breathing space than the static storyboard: approximately **739 px desktop / 592 px mobile**, versus **2,514 / 1,616 px** in the original. The live layout gives the decision room to resolve before the photographic handoff; I prioritized that progression over reproducing the mockup’s exact height.

## Verification and protection

- Chromium: **13 cases / 994 checks**. Desktop 1440 and mobile 390/360, EN/ES, loader release, photographic bounds, scroll resolution, gallery sequence/controls/pause/drag, card selection, Dear EXIF progression/draft, CTA/history, reduced motion, native gallery touch and no-JS fallback. All 25 page pairs in both languages on desktop/mobile: **100 navigation journeys**. No page exceptions or missing local assets.
- Existing runtime regressions: **18 passed**. Selected existing inquiry/letter/no-JS/provider browser checks: **4 cases / 26 assertions**, with Formspree mocked. No real form submission.
- All existing assets except the comparison controller are byte-identical to the pre-A baseline. All four inner pages, navigation, routing, original loader/hero controllers and styles, gallery code/image order, cards, Dear EXIF and founder letter are protected. The mobile EN first photographic viewport is pixel-identical to the original in the matched lossless captures.
- WebKit verification is partial: its full default-motion test crashed during animated card selection, as in the earlier original-site audit. See [focused results](webkit-focused.json). No physical iPhone Safari verification is claimed.

[Chromium results](chromium-results.json) · [Protection record](protection.json) · [Capture inputs and geometry](recordings/capture.json)

The films show real local browser journeys at normal speed, including the unchanged loader. External HTTPS/fonts were blocked equally for deterministic archive comparison. Mobile uses native Chromium emulated touch in the outer 12 px margin: the original archive traps vertical touch over its gallery. The current gallery passed separate horizontal and vertical touch checks. These limits are not hidden by the films. Source comparison: original `9a02ab7`, pre-A `b539f86`.

Reproduce functional checks: start `node tests/review-server.cjs /absolute/path/to/exif-studio 8080`, then `node tests/homepage-a.cjs`. The [capture method](method/record.cjs) records the protected original archive and current checkout; update its absolute roots for another environment.

Kept on `feat/exif-interaction-prototypes-2026-10-09`. No merge or production deployment. The additional pre-A checkpoint is `checkpoint-exif-before-homepage-a-2026-10-09` at `b539f86`.
