// Desktop split-colour hero: deterministic overlap mask.
// Two sibling H1s share identical geometry. The cream copy is clipped to the
// live intersection between the title and the canonical hero photograph.
document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;

  if (window.innerWidth < 860) {
    var legacy = document.createElement('script');
    legacy.src = 'assets/js/180902-mobile-legacy.js';
    legacy.defer = true;
    document.body.appendChild(legacy);
    return;
  }

  var initialized = false;
  var raf = 0;
  var trackingRaf = 0;

  function setup() {
    if (initialized) return true;
    var copy = hero.querySelector('.exif-hero-copy');
    var original = copy && copy.querySelector('h1:not(.exif-hero-title-cream)');
    if (!copy || !original) return false;

    original.classList.add('exif-hero-title-green');
    var cream = original.cloneNode(true);
    cream.classList.remove('exif-hero-title-green');
    cream.classList.add('exif-hero-title-cream');
    cream.setAttribute('aria-hidden', 'true');
    cream.style.visibility = 'hidden';
    copy.insertBefore(cream, original.nextSibling);

    function paintMaskNow() {
      var photo = hero.querySelector('.exif-hero-bg');
      if (!photo) return;
      var t = original.getBoundingClientRect();
      var p = photo.getBoundingClientRect();
      var x1 = Math.max(t.left, p.left), y1 = Math.max(t.top, p.top);
      var x2 = Math.min(t.right, p.right), y2 = Math.min(t.bottom, p.bottom);

      if (x2 <= x1 || y2 <= y1 || t.width <= 0 || t.height <= 0) {
        cream.style.clipPath = 'inset(100% 100% 100% 100%)';
        cream.style.webkitClipPath = 'inset(100% 100% 100% 100%)';
        cream.style.visibility = '';
        return;
      }

      var left = ((x1 - t.left) / t.width) * 100;
      var right = ((x2 - t.left) / t.width) * 100;
      var top = ((y1 - t.top) / t.height) * 100;
      var bottom = ((y2 - t.top) / t.height) * 100;
      var polygon = 'polygon(' + left + '% ' + top + '%, ' + right + '% ' + top + '%, ' + right + '% ' + bottom + '%, ' + left + '% ' + bottom + '%)';
      cream.style.clipPath = polygon;
      cream.style.webkitClipPath = polygon;
      cream.style.visibility = '';
    }

    function paintMask() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paintMaskNow);
    }

    function readyPaint() {
      requestAnimationFrame(function () { requestAnimationFrame(paintMask); });
    }

    /* During the 1.35s scale reveal getBoundingClientRect() changes every
       frame. ResizeObserver does not fire for transforms, so track only for
       the duration of that intentional animation, then stop. */
    function trackScaleReveal() {
      cancelAnimationFrame(trackingRaf);
      var start = performance.now();
      function frame(now) {
        paintMaskNow();
        if (now - start < 1500) trackingRaf = requestAnimationFrame(frame);
      }
      trackingRaf = requestAnimationFrame(frame);
    }

    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready.catch(function(){}) : Promise.resolve();
    fontsReady.then(readyPaint);

    hero.addEventListener('exif:hero-image-ready', readyPaint);
    window.addEventListener('resize', readyPaint, { passive: true });
    window.addEventListener('orientationchange', readyPaint, { passive: true });

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(readyPaint);
      ro.observe(hero);
      ro.observe(original);
    }
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', readyPaint);

    /* 180902 adds is-visible after the loader handoff. Observe that exact state
       change so the mask follows the title while it grows. */
    var mo = new MutationObserver(function () {
      if (copy.classList.contains('is-visible')) trackScaleReveal();
    });
    mo.observe(copy, { attributes: true, attributeFilter: ['class'] });

    readyPaint();
    initialized = true;
    return true;
  }

  if (!setup()) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      if (setup() || attempts >= 40) clearInterval(timer);
    }, 25);
  }
});
