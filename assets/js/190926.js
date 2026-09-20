// Desktop split-colour hero: deterministic overlap mask.
// Two sibling H1s share identical CSS. The cream copy is clipped to the exact
// intersection between the title box and the canonical hero photograph.
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

    function paintMask() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var photo = hero.querySelector('.exif-hero-bg');
        if (!photo) return;
        var t = original.getBoundingClientRect();
        var p = photo.getBoundingClientRect();

        var x1 = Math.max(t.left, p.left);
        var y1 = Math.max(t.top, p.top);
        var x2 = Math.min(t.right, p.right);
        var y2 = Math.min(t.bottom, p.bottom);

        if (x2 <= x1 || y2 <= y1 || t.width <= 0 || t.height <= 0) {
          cream.style.clipPath = 'inset(100% 100% 100% 100%)';
          cream.style.webkitClipPath = 'inset(100% 100% 100% 100%)';
          cream.style.visibility = '';
          return;
        }

        // Percent coordinates are relative to the H1 itself. This avoids fixed
        // descendants, nested coordinate systems and viewport-unit rounding.
        var left = ((x1 - t.left) / t.width) * 100;
        var right = ((x2 - t.left) / t.width) * 100;
        var top = ((y1 - t.top) / t.height) * 100;
        var bottom = ((y2 - t.top) / t.height) * 100;
        var polygon = 'polygon(' + left + '% ' + top + '%, ' + right + '% ' + top + '%, ' + right + '% ' + bottom + '%, ' + left + '% ' + bottom + '%)';
        cream.style.clipPath = polygon;
        cream.style.webkitClipPath = polygon;
        cream.style.visibility = '';
      });
    }

    function readyPaint() {
      requestAnimationFrame(function () { requestAnimationFrame(paintMask); });
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

    // Font loading can finish after document.fonts.ready in some Safari cache
    // paths; loadingdone gives us one final geometry pass without polling.
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', readyPaint);

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
