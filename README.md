# EXIF Studio — website

Static HTML/CSS/JavaScript, deployed from the repository root. No build step, framework or application package dependencies.

## Pages and routes

| Destination | Clean route | Source |
| --- | --- | --- |
| Home | `/` | `index.html` |
| What We Do | `/expertise` | `expertise.html` |
| Approach | `/approach` | `approach.html` |
| Studio / founder letter | `/studio` | `studio.html` |
| Discuss Your Property | `/inquire` | `inquire.html` |

Cloudflare Pages reads `_redirects` for the four clean route rewrites. Existing `.html` files remain available. `dear-exif.html` preserves its legacy redirect to the homepage letter. Removed Visual Direction & Production routes still redirect to Home. Work, Field Notes and Assessment are reserved future architecture, without placeholder pages.

## Development and checks

From the repository root, with Node 18+:

```sh
node tests/runtime-regressions.cjs
node tests/v2-regressions.cjs
for script in assets/js/*.js tests/*.cjs; do
  node --check "$script" || exit
done
```

The original 18 regression scenarios simulate browser APIs and mock Formspree. V2 contracts check pages, routes, qualification fields, asset references and measurement privacy. CI runs both dependency-free suites on the V2 branch and pull requests to main.

For simple local serving:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Python serves `.html` paths directly; it does not process Cloudflare `_redirects`. To validate clean routes and real browser behavior, use the browser harness:

```sh
node tests/browser-v2.cjs
node tests/touch-v2.cjs
```

This developer QA command requires Playwright and Chromium, already available in the prepared cloud machine. They are test tools, not site dependencies. `EXIF_CHROMIUM_PATH` can select another installed Chromium executable; `EXIF_ARTIFACT_DIR` selects an artifact folder outside the checkout (default `/workspace/artifacts/exif-v2/after`). `touch-v2.cjs` uses the running Python server (override with `EXIF_TEST_ORIGIN`) for native emulated touch, final Spanish title bounds, clipping fallback and short viewports. The main browser harness starts an ephemeral local server that applies the checkout's 200 rewrites. It blocks external requests, mocks Formspree and writes current-run browser results only after success. It exercises EN/ES at 360/390/768/860/1024/1440px, forms, drawer focus/geometry, page transitions/history, gallery controls, failed images and no-JS fallback. It does not validate Safari, external font delivery, Cloudflare itself, real form delivery or calendar booking.

## Runtime and preservation

`site-v1.js` owns language persistence, the editorial drawer, page transitions and Dear EXIF. `nav-context.js` mounts the viewport drawer, preserves the desktop close proxy and samples header contrast. Homepage modules retain their responsibilities:

- `180902.js`: reveal observer and cinematic first-entry loader/hero.
- `190926.js`: split-color title, gallery markup and URL normalization.
- `editorial-painpoint.js`: comparison narrative and scroll choreography.
- `motion-gallery.js`: continuous track, controls, wheel/drag/touch, pause and reduced motion.
- `approach-cards.js`: the expanding Observe / Decide / Create deck and word summary.

Historical CSS files remain explicitly linked in their existing order. `website-v2.css` is a final additive layer for new pages and targeted refinements. `--sans` now aliases the existing sans family. The gallery's dormant zero-padded size variants remain dormant so the approved sequence is preserved; actual image dimensions now prevent incorrect pre-decode proportions. Original photographs/fonts and the founder letter are unchanged.

`site-config.js` supplies reviewed public configuration. `measurement.js` implements local, allowlisted events without transmitting data. `site-v2.js` supplies bilingual page metadata and the inquiry form. Every page has a static/no-JavaScript navigation fallback; the original letter becomes fully expanded without scripts. English is the static default; interactive language switching requires JavaScript.

## Conversion and integrations

The homepage retains Dear EXIF and its existing Formspree endpoint. The inquiry page requests name, email, property name/website, relationship and project context, with an optional explanation. It truthfully offers follow-up availability for a free 30-minute discovery conversation. Success means an accepted inquiry, not a booked meeting.

No booking URL or analytics provider is configured. See [integration requirements](docs/WEBSITE-V2-INTEGRATIONS.md) before enabling either in `assets/js/site-config.js`. No tokens or credentials belong in site files. Analytics payloads exclude names, emails, property details and raw campaign strings. A real provider must confirm bookings before booking completion can be counted.

## Review and deployment

- [Preservation inventory](docs/WEBSITE-V2-PRESERVATION-AUDIT.md)
- [V2 implementation and validation report](docs/WEBSITE-V2-REVIEW.md)
- [Scheduling, measurement and publication requirements](docs/WEBSITE-V2-INTEGRATIONS.md)
- [September 30 audit](CODE-AUDIT-2026-09-30.md) and [historical V1 notes](V1-NOTES-2026-09-21.md)

Cloudflare Pages deploys the root with no build command. V2 is delivered on a development branch for review; do not merge, change production settings or publish unapproved material during implementation. Review image ownership/licensing/release questions before new photographic case studies or promotion. The Seasons still uses existing fallbacks until a licensed kit is supplied. Browser screenshots are review evidence, not proof of publication rights, real Formspree delivery or production readiness.
