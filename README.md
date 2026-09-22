# EXIF Studio — website

Static HTML/CSS/JS deployed from the repository root. There is no build step and no package dependency.

## Pages

- `index.html` — homepage
- `studio.html` — studio/founder page
- `dear-exif.html` — inquiry form

## Shared runtime

- `assets/css/styles.css` — global tokens, typography, layout primitives, forms and footer
- `assets/css/nav-composition.css` — drawer composition
- `assets/css/180902-mobile-fix.css` — mobile navigation corrections
- `assets/css/180902-nav-cta.css` — drawer CTA styling
- `assets/css/nav-context.css` — persistent header/nav chrome
- `assets/js/site-v1.js` — drawer behavior, form submission and footer year
- `assets/js/nav-context.js` — the single site-wide header contrast sampler

Navigation styles and scripts are linked explicitly from each HTML page. `site-v1.js` owns the shared site behavior without injecting stylesheets.

## Homepage runtime

CSS is loaded explicitly in cascade order from `index.html`:

1. `styles.css`
2. `180902.css`
3. `190926.css`
4. `approach-cards.css`
5. `hero-desktop.css`
6. `190926-final.css`
7. shared navigation CSS
8. `editorial-painpoint.css`
9. `motion-gallery.css`
10. `hero-mobile.css`

`hero-mobile.css` contains the mobile hero/loader rules that previously lived inside a JavaScript-generated `<style>` block.

Homepage JavaScript is explicit and ordered at the end of `index.html`:

1. `site-v1.js`
2. `nav-context.js`
3. `180902.js` — reveal observer + cinematic hero/loader
4. `190926.js` — desktop split-colour hero + gallery markup
5. `editorial-painpoint.js`
6. `motion-gallery.js`
7. `approach-cards.js`

No homepage module injects another stylesheet or script at runtime.

The current editorial gap markup now lives directly in `index.html`. The obsolete diagnosis/reading section and legacy Selected Work markup were removed from initial HTML; `#selected-work` is now a small mount point that becomes the motion gallery on DOM ready.

## Assets currently in use

- `assets/img/exif-logo-trim.png` — header logo/mask source
- `assets/img/signal-dark.png` / `signal-light.png` — signal marks
- `assets/img/exif-fullbleed.jpg` — final desktop hero image
- `assets/img/work-*.jpg` — cinematic loader sequence
- `assets/img/hero-couch-doorway.jpg` — loader/fallback hero frame
- `assets/img/exif-gallery-*.jpeg` — motion gallery
- `assets/fonts/TanWhistling-Regular.woff2`

## Removed during cleanup

The following files had no active runtime reference and were removed:

- `assets/js/180902-mobile-legacy.js`
- `assets/css/hero-structural-mask.css`
- `assets/img/production-poolside.jpg`
- `assets/img/exif-logo.png`
- `assets/img/exif-logo-light.png`
- `assets/img/favicon-16.png`
- `assets/img/favicon-512.png`
- `assets/img/favicon.ico`

## Performance state

The hero/loader assets still load at startup because they are part of the opening sequence. The hidden gallery warm-up was removed. Gallery images now use native lazy loading and no gallery image receives high fetch priority. The gallery animation remains idle while the section is offscreen and wakes before entry through an IntersectionObserver root margin.

The largest remaining performance opportunity is image optimization. Several JPEGs are hundreds of KB and some gallery files are close to 1 MB. Converting them to appropriately sized WebP/AVIF derivatives will produce a larger byte reduction than further JavaScript cleanup.

## Manual decisions / follow-ups

1. `first-look.html` is referenced by the homepage and drawer but is not present in this repository. Create the page or point those links to the intended destination.
2. The drawer includes `index.html#audit`, but the current homepage does not contain an element with `id="audit"`. Decide which section should own that destination.
3. If The Seasons should be served through Adobe Fonts, add the licensed Adobe kit link to all page heads. The current CSS has serif fallbacks.
4. Optimize photographic assets manually or through an image pipeline. Preserve originals outside the deployed asset folder if you want archival masters.
5. The remaining dated CSS files (`180902.css`, `190926.css` and the navigation passes) are intentionally still separate because their cascade defines the approved visual state. They can be renamed/merged later after visual regression testing; combining them blindly is high-risk and offers little byte savings compared with image optimization.

## Form

The Dear EXIF form on the homepage posts to the configured Formspree endpoint. `site-v1.js` submits it asynchronously and reports success/error inline; `dear-exif.html` redirects legacy visits to that section.

## Deployment

Cloudflare Pages can deploy the repository root directly:

- Build command: none
- Build output directory: `/`

Keep checkpoint branches intact before large visual or runtime changes.

Cloudflare Pages reads `_redirects`; legacy visits to the removed Visual Direction & Production page resolve permanently to the homepage.
