# V1 / V2 rendered comparisons

Fresh Chromium evidence from the protected checkpoint and development branch. These images are committed to GitHub so they can be viewed on an iPad signed into an account with repository access. This is screenshot evidence; a working public preview is still blocked. See the [review report](../WEBSITE-V2-REVIEW.md) for findings, exact tests, creative decisions and blockers.

All widths use a 900px viewport height. Captures use the original local fonts and existing fallbacks with external requests blocked. Both forms use mocked accepted responses; no real message was sent. Full-page images can be opened separately and zoomed. Gallery/marquee phase may vary because ordinary motion remains enabled.

| Layout | English | Español |
| --- | --- | --- |
| 1440px | [Compare EN](1440-en.md) | [Comparar ES](1440-es.md) |
| 390px | [Compare EN](390-en.md) | [Comparar ES](390-es.md) |
| 768px | [Compare EN](768-en.md) | [Comparar ES](768-es.md) |
| 1024px | [Compare EN](1024-en.md) | [Comparar ES](1024-es.md) |

[Confirmed typography regression before the technical fix](images/regressions/recognition-before-fix.jpg) · [Final corrected recognition](images/v2/1440-en-recognition.jpg)

Evidence metadata: [capture results](chromium-capture-results.json), [full browser suite](browser-results.json), [touch suite](touch-results.json), [native wheel / routes / overflow](supplemental-results.json), [decoded image dimensions](decoded-gallery-results.json).
