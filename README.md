# EXIF Studio — website

Static HTML/CSS/JS deployed from the repository root. There is no build step and no package dependency.

## Pages

- `index.html` — homepage
- `visual-direction-production.html` — production/service page
- `dear-exif.html` — inquiry form

## Shared runtime

- `assets/css/styles.css` — global tokens, typography, layout primitives, forms and footer
- `assets/css/nav-composition.css` — drawer composition
- `assets/css/180902-mobile-fix.css` — mobile navigation corrections
- `assets/css/180902-nav-cta.css` — drawer CTA styling
- `assets/css/nav-context.css` — persistent header/nav chrome
- `assets/js/main.js` — drawer behavior, shared navigation behavior, form submission and footer year

Navigation styles are linked explicitly from the HTML. `main.js` no longer injects stylesheets at runtime.

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

Homepage JavaScript is also explicit and ordered at the end of `index.html`:

1. `main.js`
2. `nav-context.js`
3. `180902.js` — cinematic hero + loader
4. `190926.js` — hero split-colour behavior + homepage section mounting
5. `editorial-painpoint.js`
6. `motion-gallery.js`
7. `approach-cards.js`

No homepage module injects another stylesheet or script at runtime.

## Assets currently in use

- `assets/img/exif-logo-trim.png` — header logo/mask source
- `assets/img/exif-logo-light-v2.png` — footer logo
- `assets/img/signal-dark.png` / `signal-light.png` — signal marks
- `assets/img/exif-fullbleed.jpg` — final desktop hero image
- `assets/img/work-*.jpg` — cinematic loader sequence / legacy work fallback
- `assets/img/exif-gallery-*.jpeg` — motion gallery
- `assets/img/production-poolside-v2.jpg` — production section
- `assets/fonts/TanWhistling-Regular.woff2`

Legacy `180902-mobile-legacy.js`, `hero-structural-mask.css`, `production-poolside.jpg`, `exif-logo.png`, and `exif-logo-light.png` were removed during repository cleanup because they were no longer referenced.

## Performance notes

The hero/loader assets are intentionally loaded at startup because they are part of the opening sequence. Gallery images use native lazy loading and no longer receive high fetch priority or a hidden post-hero preload.

The largest remaining performance opportunity is image optimization. Several JPEGs are hundreds of KB and some gallery files are close to 1 MB. Converting them to appropriately sized WebP/AVIF derivatives will produce a larger byte reduction than further JavaScript cleanup.

## Manual follow-ups

1. `first-look.html` is referenced by the homepage and drawer but is not present in this repository. Create the page or point those links to the intended destination.
2. The drawer includes `index.html#audit`, but the current homepage does not contain an element with `id="audit"`. Decide which section should own that destination.
3. If The Seasons should be served through Adobe Fonts, add the licensed Adobe kit link to all page heads. The current CSS has serif fallbacks.
4. Optimize photographic assets manually or through an image pipeline. Preserve originals outside the deployed asset folder if you want archival masters.

## Form

`dear-exif.html` currently posts to the configured Formspree endpoint in the form action. `main.js` submits it asynchronously and reports success/error inline.

## Deployment

Cloudflare Pages can deploy the repository root directly:

- Build command: none
- Build output directory: `/`

Keep checkpoint branches intact before large visual or runtime changes.
