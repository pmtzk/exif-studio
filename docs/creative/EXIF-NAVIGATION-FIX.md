# Navigation fix: clickable drawer, failing destinations

Branch: `feat/exif-interaction-prototypes-2026-10-09`. Baseline commit: `069b827aee17191256dfac4db414356c19fd57fc`. No production deployment or merge is part of this change.

## Actual reproduction

The user supplied [this immutable Cloudflare preview](https://43c27cb7.exif-studio.pages.dev). Real Chromium and WebKit browsers were used with mobile touch emulation. On the homepage the native menu tap reaches the button, the original drawer opens, `inert` is removed and its computed `pointer-events` is `auto`. The open menu was captured in [Chromium](navigation-fix/chromium-live-preview-menu.png) and [WebKit](navigation-fix/webkit-live-preview-menu.png).

Clicking What We Do starts the page transition but cannot reach its destination. Chromium reports `ERR_TOO_MANY_REDIRECTS`; WebKit reports “Load cannot follow more than 20 redirections.” Direct navigation to the same page fails too. [Actual response and browser-error log](navigation-fix/live-reproduction.json).

[Saved HTTP response evidence](navigation-fix/live-http-responses.json) confirms a self-redirect on all four inner pages:

| Request | Response | Location |
|---|---|---|
| `/expertise` | 308 | `/expertise` |
| `/approach` | 308 | `/approach` |
| `/studio` | 308 | `/studio` |
| `/inquire` | 308 | `/inquire` |

Their `.html` URLs also return 308 to the corresponding clean route, which then repeats the redirect. The explicit `_redirects` rules rewrite a clean URL to an HTML filename, while Cloudflare canonicalizes the HTML filename back to its clean URL. The combined rules create a loop.

The failure is downstream of the interaction. Replacing the menu, raising z-index, removing its glass layer or changing its animation would not repair these destinations. There were no page JavaScript exceptions in the reproduced homepage interaction. Original loader, overlays, transition cover, hit testing, pointer events and inert handling were inspected; successful clicks/open state and the HTTP response trace identify the blocking cause.

The exact Codespaces forwarded URL was not supplied. The branch was tested against an ordinary static server that serves actual filenames without Cloudflare routing. Extensionless links have no corresponding file there; explicit `.html` links do. This is a reproduced local static-server configuration, not a claim of access to the user's Codespace.

## Smallest functional repair across both configurations

1. Remove the four clean-route-to-HTML rewrites. Cloudflare already serves extensionless HTML routes and handles canonicalization. Preserve the two existing legacy 301 redirects.
2. Use explicit `.html` destinations for the four inner pages in the generated drawer, static navigation and page CTAs. These filenames exist on ordinary static servers; Cloudflare redirects them once to its native clean route. Query attribution remains supported. Canonical SEO metadata and sitemap retain clean URLs.
3. Teach the local review servers native clean-route file lookup, and add a browser test that models both Cloudflare canonicalization and plain static serving. The old server honored rewrites but omitted canonicalization, which explains why earlier navigation checks missed this loop.

Only destination strings change in website HTML and `site-v1.js`. No menu controller logic, hover/focus behavior, locking, close proxy, loader timing, transitions, visual styles, hero or gallery code was altered. No new menu or dependency was added.

## Verification

[Cross-host browser results](navigation-fix/results.json) record 1,296 passing browser checks across 200 page-to-page journeys and 40 direct-page loads. They test all five direct pages and every one of the 25 menu origin/destination pairs in each combination of Chromium/WebKit, desktop/mobile and Pages/plain-static routing. Native clicks/taps, menu hit testing, drawer opening, pointer-events/inert, transition arrival and unlocked destinations are asserted. The pre-fix four-route loop is also reproduced against the routing model in both engines.

[Preservation checks](navigation-fix/preservation.json) verify 71 contracts: HTML and shared navigation script differ only in destination URLs; every other existing asset is byte-identical. [Visual comparison](navigation-fix/visual-comparison.json) confirms pixel-identical before/after drawer screenshots at 390 and 1440 pixels in English and Spanish.

| View | Before | After |
|---|---|---|
| Mobile English | [Before](navigation-fix/390-en-before-drawer.png) | [After](navigation-fix/390-en-after-drawer.png) |
| Mobile Spanish | [Before](navigation-fix/390-es-before-drawer.png) | [After](navigation-fix/390-es-after-drawer.png) |
| Desktop English | [Before](navigation-fix/1440-en-before-drawer.png) | [After](navigation-fix/1440-en-after-drawer.png) |
| Desktop Spanish | [Before](navigation-fix/1440-es-before-drawer.png) | [After](navigation-fix/1440-es-after-drawer.png) |

Existing regression suites passed: runtime 18 checks; V2 8 contracts; browser V2 19 cases / 560 assertions; browser V3 15 cases / 576 assertions; touch 12 checks; performance 3 checks; prototypes 252 assertions. [Browser, touch and prototype result files](navigation-fix/regression-results/). Form tests block external requests or use mocks; no real inquiries were sent.

## Limits

WebKit 26.5 tests the engine used by Safari with mobile viewport/touch emulation. Physical iPhone Safari was not available. The fix is verified locally under both server behaviors; the supplied immutable preview still contains its original deployment. No claim is made that its deployed files have been updated. No production deployment was performed.

[Exact files changed](navigation-fix/CHANGED-FILES.txt).
