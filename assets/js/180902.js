// 180902 — restrained motion + working-interface interactions.
document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll('.reveal, .reveal-media');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  var signals = document.querySelectorAll('.signal[data-panel]');
  var panels = document.querySelectorAll('.canvas-panel[data-content]');
  signals.forEach(function (signal) {
    signal.addEventListener('click', function () {
      var target = signal.getAttribute('data-panel');
      signals.forEach(function (item) { item.classList.remove('active'); });
      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.getAttribute('data-content') === target);
      });
      signal.classList.add('active');
    });
  });

  var steps = document.querySelectorAll('.sequence-step');
  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      steps.forEach(function (item) { item.classList.remove('active'); });
      step.classList.add('active');
    });
  });

  /* HERO ONLY — JS owns DOM/state/timing. CSS owns all geometry and presentation. */
  var hero = document.querySelector('#what-exif-does');
  if (!hero) return;

  var finalImage = 'https://raw.githubusercontent.com/pmtzk/exif-studio/dfad59a8809948b4537c4e8be36be13348dd0235/assets/img/exif-fullbleed.jpg';
  var frames = [
    'assets/img/work-chair-detail.jpg',
    'assets/img/work-window-reflection.jpg',
    'assets/img/work-human-moment.jpg',
    'assets/img/work-open-air-space.jpg',
    'assets/img/work-restaurant-atmosphere.jpg',
    'assets/img/hero-couch-doorway.jpg',
    'assets/img/work-exterior-view.jpg',
    finalImage
  ];

  hero.classList.add('exif-cinematic-hero');
  hero.querySelector('.wrap').insertAdjacentHTML('beforeend',
    '<img class="exif-hero-bg" src="' + finalImage + '" alt="Hospitality property at sunset">' +
    '<div class="exif-hero-shade" aria-hidden="true"></div>' +
    '<div class="exif-hero-copy"><h1><span class="line"><span class="word">A PLACE,</span></span><span class="line"><span class="word">MADE</span></span><span class="line"><span class="word">UNMISTAKABLE.</span></span></h1><div class="exif-hero-meta"><span>SIGNAL</span><span>MEXICO + CARIBBEAN</span></div></div>'
  );

  function setHeroHeaderState() {
    if (window.scrollY < Math.max(80, hero.offsetHeight - 90)) {
      document.body.classList.add('exif-hero-live');
    } else {
      document.body.classList.remove('exif-hero-live');
    }
  }

  if (reduced) {
    document.body.classList.add('exif-hero-live');
    hero.querySelector('.exif-hero-copy').classList.add('is-visible');
    window.addEventListener('scroll', setHeroHeaderState, { passive: true });
    return;
  }

  document.body.classList.add('exif-intro-running');
  var loader = document.createElement('div');
  loader.className = 'exif-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = '<div class="exif-loader-stage"></div><span class="exif-loader-count">EXIF / LOADING</span>';
  document.body.appendChild(loader);

  var stage = loader.querySelector('.exif-loader-stage');
  var imgs = frames.map(function (src) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    stage.appendChild(img);
    return img;
  });

  frames.forEach(function (src) {
    var preload = new Image();
    preload.src = src;
  });

  setTimeout(function () {
    stage.classList.add('is-window');
    loader.classList.add('is-sequencing');
  }, 420);

  setTimeout(function () {
    var i = 0;
    function flash() {
      imgs.forEach(function (img) { img.classList.remove('is-active'); });
      imgs[i].classList.add('is-active');
      i += 1;

      if (i < imgs.length) {
        setTimeout(flash, 125);
        return;
      }

      loader.classList.remove('is-sequencing');
      setTimeout(function () {
        /* is-hero is the final portrait rectangle; it is never a full-viewport state. */
        stage.classList.add('is-hero');

        setTimeout(function () {
          document.body.classList.add('exif-hero-live');
          loader.classList.add('is-gone');
          document.body.classList.remove('exif-intro-running');

          setTimeout(function () {
            hero.querySelector('.exif-hero-copy').classList.add('is-visible');
          }, 300);

          setTimeout(function () { loader.remove(); }, 900);
          window.addEventListener('scroll', setHeroHeaderState, { passive: true });
        }, 1050);
      }, 360);
    }
    flash();
  }, 1050);
});
