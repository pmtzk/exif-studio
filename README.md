# EXIF Studio — website

Plain HTML/CSS/JS. No build step, no dependencies to install. Ready to push to GitHub and deploy on Cloudflare Pages.

## File structure

```
index.html                          Home
visual-direction-production.html    Service page
dear-exif.html                      Guided inquiry form
assets/css/styles.css               All styles, brand tokens at the top
assets/js/main.js                   Mobile nav + form submission
assets/img/exif-logo.png            Logo (from IMG_1995.png)
assets/img/signal-dark.png          Brand dot divider, dark green
assets/img/signal-light.png         Same graphic, recolored cream (for dark sections)
assets/img/favicon-16/32/48/180/512.png + favicon.ico
assets/fonts/TanWhistling-Regular.woff2
```

## Three things to do before this goes live

### 1. Formspree (Dear EXIF form)
The form on `dear-exif.html` posts to Formspree so submissions land in your inbox.
1. Create a free account at formspree.io and add a new form.
2. Copy the endpoint it gives you, something like `https://formspree.io/f/abcdwxyz`.
3. Open `dear-exif.html`, find `YOUR_FORM_ID` in the `<form action=...>` line, and swap it in.
4. Confirm your email with Formspree the first time a real submission comes through, or it won't deliver.

### 2. The Seasons (Adobe Fonts)
Tan Whistling is self-hosted and already wired up. The Seasons is licensed through Adobe Fonts, which doesn't allow self-hosting the font files, so it has to load from Adobe's CDN.
1. Go to fonts.adobe.com, create a new web project, add **The Seasons** in Regular, Bold and Italic.
2. Add `exif.studio` and `www.exif.studio` as domains on that kit.
3. Adobe gives you a `<link rel="stylesheet" href="https://use.typekit.net/xxxxxxx.css">` tag. Paste it into the `<head>` of all three HTML files, in place of the commented-out placeholder line that already marks where it goes.
4. Until that's done, the site falls back to a similar serif (Cormorant Garamond via system/Google fallback) so nothing looks broken in the meantime.

### 3. Real images
Every photo on the site is a placeholder block labelled with what should go there and its rough aspect ratio (the dashed outline and grey label). Replace them with actual `<img>` tags as photography becomes available:
- Hero image (16:9)
- About portrait (4:5)
- Selected Work grid (6 tiles shown, 4:5 each — designed for 15–25 once you have a full edit)
- Visual Direction & Production stills (4:5)

## Deploying to GitHub + Cloudflare Pages
1. Create a new GitHub repo (e.g. `exif-studio-website`) and push this whole folder as its root.
2. In Cloudflare Pages, connect the repo. Build command: none. Build output directory: `/` (the repo root).
3. Add `exif.studio` as a custom domain in the Pages project settings, and point it at Cloudflare per their instructions (you're already using Cloudflare, so this is usually automatic if the domain's nameservers are already pointed there).

## Notes
- Atmosphere Audit is intentionally left out of the navigation and sitemap for now, as agreed. Its existing page at `/atmosphere-audit` isn't affected by this build and doesn't need to be touched.
- Brand colors are CSS variables at the top of `assets/css/styles.css` (`--ink`, `--forest`, `--sage`, `--cream`, `--ink-deep`), pulled directly from the EXIF Coolors palette. Easy to retune in one place if needed.
- Copy follows your no-em-dash / no-filler-adjective rules throughout, except the one signature line on the homepage that's specified as the brand's core statement.
