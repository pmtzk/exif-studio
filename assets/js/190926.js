// 190926 — stable desktop hero text mask.
// Mask geometry comes from the same CSS rectangle used by the loader and hero.
document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;

  var initialized = false;
  var resizeFrame = 0;
  var lastWidth = window.innerWidth;
  var lastHeight = window.innerHeight;

  function waitForImage(img) {
    if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve();
    return new Promise(function (resolve) {
      var done = function () { resolve(); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  function waitForFonts() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    return document.fonts.ready.catch(function () {});
  }

  function setupHeroMask() {
    if (initialized) return true;

    var copy = hero.querySelector('.exif-hero-copy');
    var photo = hero.querySelector('.exif-hero-bg');
    if (!copy || !photo) return false;

    var original = copy.querySelector('h1');
    if (!original) return false;

    var cream = original.cloneNode(true);
    cream.classList.add('exif-hero-title-cream');
    cream.setAttribute('aria-hidden', 'true');
    original.classList.add('exif-hero-title-green');
    copy.insertBefore(cream, original.nextSibling);

    function syncMask() {
      if (window.innerWidth < 860) {
        cream.style.clipPath = '';
        return;
      }

      // Read the final rendered hero rectangle. Loader and hero now share the
      // same fixed viewport coordinate system, so this rectangle is canonical.
      var r = cream.getBoundingClientRect();
      var p = photo.getBoundingClientRect();
      var top = Math.max(0, p.top - r.top);
      var right = Math.max(0, r.right - p.right);
      var bottom = Math.max(0, r.bottom - p.bottom);
      var left = Math.max(0, p.left - r.left);
      cream.style.clipPath = 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px)';
    }

    cream.style.visibility = 'hidden';

    Promise.all([waitForFonts(), waitForImage(photo)]).then(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          syncMask();
          cream.style.visibility = '';
          hero.classList.add('exif-mask-ready');
        });
      });
    });

    window.addEventListener('resize', function () {
      var width = window.innerWidth;
      var height = window.innerHeight;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(syncMask);
    }, { passive: true });

    initialized = true;
    return true;
  }

  if (!setupHeroMask()) {
    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (setupHeroMask() || tries >= 20) window.clearInterval(timer);
    }, 25);
  }
});
