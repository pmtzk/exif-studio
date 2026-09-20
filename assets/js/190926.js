// 190926 — desktop hero text mask: cream only where headline crosses the portrait.
document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;

  function setupHeroMask() {
    var copy = hero.querySelector('.exif-hero-copy');
    var photo = hero.querySelector('.exif-hero-bg');
    if (!copy || !photo || copy.querySelector('.exif-hero-title-cream')) return false;

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
      var r = cream.getBoundingClientRect();
      var p = photo.getBoundingClientRect();
      var top = Math.max(0, p.top - r.top);
      var right = Math.max(0, r.right - p.right);
      var bottom = Math.max(0, r.bottom - p.bottom);
      var left = Math.max(0, p.left - r.left);
      cream.style.clipPath = 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px)';
    }

    syncMask();
    window.addEventListener('resize', syncMask, { passive: true });
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(syncMask);
      ro.observe(hero);
      ro.observe(photo);
      ro.observe(copy);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncMask);
    photo.addEventListener('load', syncMask, { once: true });
    return true;
  }

  if (!setupHeroMask()) {
    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (setupHeroMask() || tries > 80) window.clearInterval(timer);
    }, 50);
  }
});
