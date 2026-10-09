# Creative reset — browser evidence

9 October 2026. Read the [creative direction and findings](../EXIF-CREATIVE-DIRECTION-RESET.md) first. This folder contains screenshots and recordings from actual browser inspection, not redesign mockups. All website source remains unchanged.

## Original versus prototype

| Evidence | Protected original | Current prototype |
| --- | --- | --- |
| Desktop hero | [Screenshot](original-desktop/03-hero.jpg) | [Screenshot](prototype-desktop/03-hero.jpg) |
| Mobile hero | [Screenshot](original-mobile/03-hero.jpg) | [Screenshot](prototype-mobile/03-hero.jpg) |
| Desktop full homepage | [Capture](original-desktop/home-full.jpg) | [Capture](prototype-desktop/home-full.jpg) |
| Mobile full homepage | [Capture](original-mobile/home-full.jpg) | [Capture](prototype-mobile/home-full.jpg) |
| Gallery | [Desktop](original-desktop/gallery.jpg), [mobile](original-mobile/gallery.jpg) | [Desktop](prototype-desktop/gallery.jpg), [mobile](prototype-mobile/gallery.jpg) |
| Original cards | [Create](original-desktop/card-create.jpg), [mobile](original-mobile/card-create.jpg) | [Create](prototype-desktop/card-create.jpg), [mobile](prototype-mobile/card-create.jpg) |
| Drawer | [Desktop](original-desktop/04-drawer.jpg), [mobile](original-mobile/04-drawer.jpg) | [Desktop](prototype-desktop/04-drawer.jpg), [mobile](prototype-mobile/04-drawer.jpg) |
| Mobile arrival film, first eight seconds | [MP4 download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/original-mobile/arrival.mp4) | [MP4 download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/prototype-mobile/arrival.mp4) |
| Full desktop inspection recording | [WebM download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/original-desktop/journey.webm) | [WebM download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/prototype-desktop/journey.webm) |
| Full mobile inspection recording | [WebM download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/original-mobile/journey.webm) | [WebM download](https://raw.githubusercontent.com/pmtzk/exif-studio/feat/exif-interaction-prototypes-2026-10-09/docs/creative/reset-evidence/prototype-mobile/journey.webm) |

GitHub displays the JPEG/PNG screenshots in its file viewer. The HTTPS raw links above download the video directly; no workspace path or artifact-download interface is required.

## The additions under review

- [V2 full desktop](v2-desktop/home-full.jpg) and [mobile](v2-mobile/home-full.jpg).
- [V3 full desktop](v3-desktop/home-full.jpg) and [mobile](v3-mobile/home-full.jpg).
- [Current positioning block](prototype-desktop/positioning.jpg).
- [Current empty photographic frame, desktop](prototype-desktop/new-passage.jpg) and [mobile](prototype-mobile/new-passage.jpg).
- [Current home study](prototype-mobile/study.jpg) and [selected Decide state](quality-checks/prototype-study-decide.jpg).
- [Service artifact](prototype-mobile/artifact-1.jpg), [older reading slider](quality-checks/prototype-reading-range-end.jpg), [word-emphasis selector](quality-checks/prototype-service-emphasis.jpg), [format choice](quality-checks/prototype-service-format.jpg).
- [What We Do desktop](prototype-desktop/expertise-full.jpg) and [mobile](prototype-mobile/expertise-full.jpg).
- [Approach desktop](prototype-desktop/approach-full.jpg) and [mobile](prototype-mobile/approach-full.jpg); [working-note disclosure](quality-checks/prototype-process-note.jpg).
- [Studio desktop](prototype-desktop/studio-full.jpg) and [mobile](prototype-mobile/studio-full.jpg); [founder’s letter](prototype-mobile/founder-letter.jpg).
- [Inquire desktop](prototype-desktop/inquire-full.jpg) and [mobile](prototype-mobile/inquire-full.jpg).

## Method and limits

**Primary comparison:** actual Chromium `151.0.7922.173`, desktop 1440 × 900 and mobile 390 × 844, mobile touch capability enabled. Eight fresh homepage visits: original, V2, V3 and prototype in each viewport. Every homepage loaded with HTTP 200 and produced no recorded page exceptions. Native wheel input traversed each homepage to its end. `scroll-*.jpg` records that sequence; selected section captures used explicit `scrollTo` revisits. Card selection used native tap on mobile and click on desktop. The mobile journeys used wheel input for scrolling, not physical iPhone gestures.

The four full recordings are the actual original/prototype browser journeys, including the original loader, menu inspection, native wheel traversal and later deliberate revisits. The prototype recordings also include inner-page visits and representative interactions. The eight-second MP4s are trims of those recordings, not synthetic animation. V2/V3 have screenshots and logs, not recordings. Full-page screenshots illustrate layout and are not evidence of an interaction by themselves.

The source was served from isolated Git archives over read-only localhost HTTP servers. HTTPS requests were blocked equally across the four versions, including Google Fonts; local imagery and local font assets remained available. Body-font fallbacks may alter copy wrapping versus a deployment. No form was submitted, no analytics endpoint was exercised, and hosting redirects were not retested by this creative study.

**Reduced motion:** two additional actual desktop Chromium visits to original/prototype, with `prefers-reduced-motion: reduce`, inspected the hero, comparison, gallery and cards. The prototype visit also exercised study Decide, the reading range using the End key, service emphasis, service format and a native process disclosure. These results support the distinction between a meaningful composition and a control that only changes emphasis.

**WebKit limitation:** the initial launch failed host validation for `libGLESv2.so.2`. A launch using graphics libraries already present in the workspace and bypassing that host validation produced original mobile hero, menu, Spanish hero, comparison, gallery and cards captures. The page then crashed during the Decide card interaction. The cause of that browser-process crash is unestablished; it is not attributed to website code. The prototype WebKit visit was not reached. These partial screenshots do not establish a complete WebKit comparison or physical iPhone Safari compatibility.

**Reference revisits:** the 12 PNGs in [reference-revisits](reference-revisits/) are extracted unchanged from the earlier successful live five-site study, conducted 2026-10-09 at 03:25–03:47 UTC. They are not new live reference visits. The [original research report](../../research/EXIF-INTERACTION-REFERENCE-STUDY.md) and [six downloadable evidence archives](../../research/evidence-downloads/README.md) retain the actual interaction logs and recordings.

## Audit records

- [Browser audit](browser-audit.json): checkpoint SHAs, actual browser version, section geometry, response status, screenshot coordinates, gallery load state and actions for all eight main contexts.
- [Supplementary audit](quality-checks/quality-audit.json): reduced-motion actions and the WebKit limitation.
- [Source baseline](source-baseline.json): original/V2/V3/prototype SHAs and pre-study Git blob IDs for website files. All four SHAs were independently checked with GitHub branch refs.
- [Evidence inventory](evidence-files.json): paths, sizes and SHA-256 checksums. Excludes its own checksum.
- [Method scripts](method/): retained research tooling. These scripts are documentation evidence, not website code. The WebKit retry requires the workspace library path described above.

The eight main folders use the version/viewport in their names. `01-loader`, `02-loader-window`, `03-hero`, `04-drawer`, `05-drawer-hover` record arrival/navigation. `scroll-*` captures the continuous wheel journey. Named sections and state suffixes record deliberate revisits and interaction results. Hover in a mobile emulation is not claimed as native mobile behavior. The reports distinguish observed behavior, measured geometry and proposed creative changes.
