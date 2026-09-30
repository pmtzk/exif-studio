# EXIF Studio code audit — September 30, 2026

## Scope and isolation

Source: `main` at `231979010b68b82ece7ff303d911dbead4a803bb`.
Review branch: `fix/code-audit-2026-09-30`.

The review branch started as a complete Git snapshot of main, including every binary asset. No fork or second repository was created. All 36 existing text files were read in full, including every JavaScript module, every stylesheet, all HTML, routing, metadata and documentation. Several sources are minified into long lines; their complete statements and declarations were read, rather than treating line count as coverage. There is no AGENTS.md or package/build dependency in this snapshot.

This is a source review plus executable regression testing with simulated browser APIs. It is not a claim of zero regression risk or completed visual/browser verification. The 32 binary assets were inventoried and retained; their image/font contents were not edited or visually audited.

## Corrections

| Area | Before | Change |
| --- | --- | --- |
| URL input | Called selectionStart/setSelectionRange on type=url, which does not support the selection API; also rewrote explicit HTTP URLs. | Removed caret manipulation. Bare URLs normalize to HTTPS on blur; explicit schemes remain intact; normalization emits input so the saved draft stays current. |
| Dear EXIF first step | Continue expanded even with an invalid property; Enter could validate still-hidden required fields. | Validate the property before expansion. Enable manual validation only after initialization; Enter opens the visible step, then the expanded form validates before sending. Collapsed fields are inert. |
| Form submission | Repeated submit events could send twice; translation could overwrite the sending state and restore an outdated button label. | Guard pending/sent submissions, keep sending/error labels synchronized with language, allow retries, retain failed drafts and clear successful drafts. Focus the receipt when the form hides. |
| Form accessibility | Fields relied on placeholders; continue lacked an expanded state. | Add bilingual accessible names, name/email autocomplete, expanded state and a live receipt. Layout markup and visual text remain in place. |
| Storage unavailable | The ES/EN toggle got stuck because each read fell back to English. | Keep current language in memory; storage persistence is optional. Dynamically mounted hero/editorial/cards initialize from document.lang. |
| History navigation | Restoring a page from the back-forward cache could retain the outgoing cover or locked drawer state. | Reset transition classes and drawer lock on persisted pageshow; close timers/listeners are cancelled during reset. |
| Drawer | Closed drawer links remained available to assistive technology during the closing transition; no explicit association with its toggle. | Add inert/aria-hidden lifecycle and aria-controls; restore toggle focus if the closing drawer owns focus. Preserve modifier-click behavior on Dear EXIF. Cancel stale geometry restoration when reopening the desktop proxy. |
| Reduced-motion gallery | Buttons/drag/wheel updated animation targets that the reduced-motion frame never consumed; button nudges could reschedule frames forever. | Directly render deliberate user movement; keep automatic cruising off. Reduced-motion reveal/signal settle immediately. |
| Mobile gallery scroll | touch-action:none prevented the browser from handling vertical swipes over photos. | Use pan-y, reserving horizontal dragging for the gallery. Actual touch/PointerEvent behavior still needs browser QA. |
| Gallery loading | The visible set was created eager with five high-priority images despite documentation describing lazy loading. | All 39 generated images are lazy and none requests high priority. Hero priority stays intact. |
| Header language contrast | editorial-painpoint.js and nav-context.js both wrote the same contrast classes on scroll. | Keep sampling in nav-context.js; editorial module only updates its own section. |
| Desktop hero | Mask was not refreshed on language changes; resize did not refresh the scroll target; a missing Web Animations API could strand the loader. | Refresh mask on language changes and scroll target on resize; finish the intro when animate is unavailable. Set header hero state from the actual scroll position after intro/returning entry. |
| Reduced-motion CSS | site-v1.css overrode an earlier reduced-motion scroll-behavior:auto with smooth. | Restore auto inside the final reduced-motion rule. |
| Documentation | README described removed links, JPEG gallery assets and a removed icon that exists. | Update current runtime facts and document tests/remaining visual decisions. |

## Validation

- 18 dependency-free behavior tests passed in the available JavaScript/V8 execution environment.
- The same suite was run against the original source: 15 regression scenarios failed; the existing draft, persisted-language and network-retry checks passed.
- Tests simulate DOM, events, storage, history restoration, timers and animation frames. Formspree requests are mocked; no real inquiry was sent.
- All 7 JavaScript modules and inline executable scripts compiled; JSON-LD and the webmanifest parsed.
- 66 explicit local HTML/CSS references resolved against the repository tree. Gallery asset names and loader assets also exist.
- All 19 CSS files passed a lexical check for balanced delimiters, strings and comments. This is not full CSS parsing or visual validation.
- `tests/runtime-regressions.cjs` also runs under Node 18+ using vm; `.github/workflows/runtime-regressions.yml` runs Node 22 syntax checks and the same suite on pushes to this review branch. Workflow results are visible in GitHub Actions.
- Existing photographic/font bytes, CSS import order, approved geometry, brand copy, destinations and Formspree endpoint were retained.

Run tests:

```sh
node tests/runtime-regressions.cjs
```

## Visual follow-ups deliberately left for a browser preview

These are source findings, not silently applied visual changes:

1. **Undefined font token.** Some active rules use `var(--sans)`, but no stylesheet defines `--sans`. Invalid font shorthands fall back to inherited/browser defaults. Aliasing this to `--font-sans` also activates previously ignored sizes/line heights and can change wrapping. Compare cards, summary, gallery controls and recognition rails before applying.
2. **Gallery slot selectors.** Markup generates `gallery-slot-1` through `gallery-slot-13`; several CSS rules target zero-padded `gallery-slot-02`, `04`, etc. Enabling those rules changes photo sizes and offsets. Preserve the current composition until a preview confirms the intended variant.
3. **Desktop/mobile initialization on resize.** The split hero and desktop close proxy are initialized according to the initial width. Crossing 860px without reloading needs browser verification and a coordinated lifecycle fix; CSS geometry was not reorganized speculatively.
4. **Menu keyboard focus.** Closed links are now inert, but there is no complete modal focus trap for the open drawer. Verify the header language button, real/proxy close button, logo and background tab order before adding one; the drawer remains an editorial nav, not a newly invented dialog.
5. **No-JavaScript and delayed-image entry.** The homepage dynamically mounts several sections and hides mobile chrome until runtime is ready. Test blocked scripts, slow/failed final-image decoding, loader interruption and the no-JavaScript fallback before further structural changes.
6. **CSS cascade and obsolete rules.** Older selectors for removed sections remain in shared stylesheets. Their presence is not a runtime bug by itself. Keep them until coverage and screenshots prove a deletion/merge leaves all pages unchanged.
7. **Fonts and social metadata.** The Seasons has no licensed kit; existing fallbacks are retained. Studio lacks the full canonical/social-image metadata of Home. Adding font assets or choosing metadata is outside the bug-only patch.

## Browser release checklist

Before merging or promoting this branch, compare main and the review branch at 360/390/768/860/1440px and short/landscape viewports, in EN and ES:

- First entry, returning entry, slow assets, reduced motion and unsupported/failed animation.
- Home ↔ Studio ↔ founder letter/Write Back, including Back/Forward cache restoration.
- Drawer open/close/Escape, scroll restoration, rapid toggles, keyboard focus, modifier clicks and width changes.
- Vertical scroll over gallery, horizontal drag, trackpad wheel and both gallery arrows with/without reduced motion.
- Empty/invalid property, bare domain, HTTP/HTTPS URL, Enter in step one, draft restoration, textarea growth, invalid expanded fields, retry, language switch while sending and receipt focus.
- Real Formspree delivery only with an intentional test inquiry.

## Existing-file coverage

Line counts refer to the unmodified source snapshot, including its trailing newline.

| File | Original lines | Disposition |
| --- | ---: | --- |
| `README.md` | 105 | Corrected; see fixes above. |
| `V1-NOTES-2026-09-21.md` | 119 | Historical design constraints retained. |
| `_redirects` | 3 | Reviewed; retained. |
| `assets/css/180902-mobile-fix.css` | 36 | Reviewed; retained. |
| `assets/css/180902-nav-cta.css` | 55 | Reviewed; retained. |
| `assets/css/180902.css` | 3 | Reviewed; retained. |
| `assets/css/190926-final.css` | 28 | Reviewed; retained. Visual token/selector follow-up below. |
| `assets/css/190926.css` | 123 | Reviewed; retained. |
| `assets/css/approach-cards-mobile-resilience.css` | 72 | Reviewed; retained. |
| `assets/css/approach-cards.css` | 5 | Reviewed; retained. Visual token/selector follow-up below. |
| `assets/css/drawer-foundation.css` | 8 | Reviewed; retained. |
| `assets/css/editorial-painpoint.css` | 33 | Reviewed; retained. |
| `assets/css/hero-desktop.css` | 16 | Reviewed; retained. |
| `assets/css/hero-mobile.css` | 41 | Reviewed; retained. |
| `assets/css/mobile-header-authority.css` | 29 | Reviewed; retained. |
| `assets/css/motion-gallery.css` | 11 | Corrected; see fixes above. Touch gesture fix included; Visual token/selector follow-up below. |
| `assets/css/nav-composition.css` | 113 | Reviewed; retained. |
| `assets/css/nav-context.css` | 20 | Reviewed; retained. |
| `assets/css/recognition-closing.css` | 40 | Reviewed; retained. |
| `assets/css/recognition-vertical-loop.css` | 36 | Reviewed; retained. |
| `assets/css/site-v1.css` | 18 | Corrected; see fixes above. |
| `assets/css/styles.css` | 471 | Reviewed; retained. |
| `assets/js/180902.js` | 71 | Corrected; see fixes above. |
| `assets/js/190926.js` | 76 | Corrected; see fixes above. |
| `assets/js/approach-cards.js` | 36 | Corrected; see fixes above. |
| `assets/js/editorial-painpoint.js` | 47 | Corrected; see fixes above. |
| `assets/js/motion-gallery.js` | 34 | Corrected; see fixes above. |
| `assets/js/nav-context.js` | 21 | Corrected; see fixes above. |
| `assets/js/site-v1.js` | 20 | Corrected; see fixes above. |
| `dear-exif.html` | 1 | Reviewed; retained. |
| `favicon.svg` | 7 | Reviewed; retained. |
| `index.html` | 13 | Corrected; see fixes above. |
| `robots.txt` | 5 | Reviewed; retained. |
| `site.webmanifest` | 14 | Reviewed; retained. |
| `sitemap.xml` | 6 | Reviewed; retained. |
| `studio.html` | 25 | Reviewed; retained. |

## Merge status

All changes belong to the review branch. Main was not merged into, rewritten or used as the correction target. Automatic zero-breakage guarantees are not possible; visual/browser QA and real service delivery remain explicit limits of this audit.
